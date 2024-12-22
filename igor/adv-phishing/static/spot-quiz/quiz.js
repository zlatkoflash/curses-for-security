//Spot the phishing scam

var SpotQuiz = {
	f_ini: false,
	f_loaded: false,
	f_endquiz: false,
	page: '#lesson31',
	nPage: 31,
	nPageExit: 30, //Course.goLesson(30) at the end
	fRand: true, //randomize files
	thresholdGood: 50, //if result is OK (>=50% - good, <50% - bad, 100% - great)
	thresholdGreat: 99, //>=99% - great
	nQuestion: 1, //curr question 1...cnt-1
	cnt: 0, //count of questions on all pages
	nCurrPage: 0, //curr page 0...files.length-1
    files: [
		'q0.html', //Ebay
		'q1.html', //JPMorgan
		'q2.html', //UPS
		'q3.html', //VENMO
		'q4.html', //PayPal
		'q5.html', //Adobe Flash Player
		'q6.html' //Tivter
    ],
	enableLusyAnswer: true, //false - disable call lucyQuizAnswer
	nFiles: [], //randomized # of files
	answers: [], //user's answers (1-correct, -1-incorrect)
	result: 0, //% result
	lives: 12, //the user is given 12 attempts
	quizEl: null,
	timePage: 0, //timer (see showCurrPage)
	ntimePage: 0, //seconds for the curr page
	wasHover: false, //hover event occurred
	disHover: false, //true - 'hover' event is disabled
	
	ini: function() //one-time!
	{
		//Fill <ul><li>... for all y/n menus
		//m_page - page .quiz-m
		function fill_yn_menus(m_page)
		{
			let ssafe = $(SpotQuiz.page + ' .row-sect--gamespot input.inp-safe').val();
			let sunsafe = $(SpotQuiz.page + ' .row-sect--gamespot input.inp-unsafe').val();
			m_page.find('div.yn_menu').each(function(i)
			{
				$(this).html('<ul><li class="safe">' + ssafe + '</li><li class="unsafe">' + sunsafe + '</li></ul>');
				$(this).css('display','none');
			});
		}
		
		//Fill <div class="pointsmsg" ...
		function fill_points(m_page)
		{
			let point = $(SpotQuiz.page + ' .row-sect--gamespot input.inp-point').val();
			m_page.find('div.pointsmsg').each(function(i)
			{
				$(this).html(point);
			});
		}

		//Fill <div class="lifemsg" ...
		function fill_lives(m_page)
		{
			let life = $(SpotQuiz.page + ' .row-sect--gamespot input.inp-life').val();
			m_page.find('div.lifemsg').each(function(i)
			{
				$(this).html(life);
			});
		}

		if(SpotQuiz.f_ini) return; //already initialized
		SpotQuiz.f_ini = true;

		SpotQuiz.quizEl = $(SpotQuiz.page + ' .wrap-quiz .quiz-pages');
		SpotQuiz.cnt = 0;
		var n_loaded = 0;

		//load html-files
		for(let i=0; i<SpotQuiz.files.length; i++)
		{
			let urlfile = SpotQuiz.files[i];

			$.ajax({
				url: urlfile,
				dataType: 'html',
				success: function(res)
				{
					//replace 'class="quiz-m' to 'class="quiz-m qXXX'
					res = res.replace('class="quiz-m', 'class="quiz-m q' + i);

					SpotQuiz.quizEl.append(res);
					
					let m_page = SpotQuiz.quizEl.find('.quiz-m.q'+i);
					let cnt = m_page.attr('data-cntans');
					SpotQuiz.cnt += parseInt(cnt);
					//console.log(i, "cnt", cnt, SpotQuiz.cnt);
					
					//init safe/unsafe menu
					fill_yn_menus(m_page);
					//init '+1 Point' elements
					fill_points(m_page);
					//init '-1 Life' elements
					fill_lives(m_page);

					n_loaded++;
					
					//if the last page
					if(n_loaded == SpotQuiz.files.length)
					{
						SpotQuiz.f_loaded = true;
						//count of questions on all pages
						$(SpotQuiz.page + ' .quiz-progress .quest-n span.cnt').html(SpotQuiz.cnt);
						
						SpotQuiz.initListeners();
					}
				}
			});
		}
		
		//count of pages
		$(SpotQuiz.page + ' .quiz-progress .quiz-round span.cnt').html(SpotQuiz.files.length);
		
		//rects
		let rects = $(SpotQuiz.page + ' .quiz-progress .rects');
		for(let i=0; i<SpotQuiz.files.length; i++)
		{
			rects.append('<span class="rect-'+i+'"></span>');
		}
		
		SpotQuiz.resize(); //resize .rects
	},
	
	initListeners: function()
	{
		function yel_lighting_hover(el)
		{
			let id = el.attr('data-id');
			let fl = el.attr('data-flag');
			if(fl > 0) //the answer has already been (1-correct, 2-wrong, 3-disabled)
			{
				SpotQuiz.show_yn_menu(null,false);

				let m_page = el.parents('.quiz-m');
				let el_msg = m_page.find('.d_buble[data-id=' + id + ']');

				if(fl != 3) //not disabled
				{
					if(fl == 1)
						el_msg.addClass('d_buble_green');
					if(fl == 2)
						el_msg.addClass('d_buble_red');
					el_msg.addClass('d_buble_show');
				}
			}
			else
			{
				//Show safe/unsafe menu
				SpotQuiz.show_yn_menu(id,true);
			}
		}

		$(SpotQuiz.page + ' .quiz-pages .yel_lighting').on('touchstart', function (e) {
			SpotQuiz.disHover = true;
		});

		//hovering the mouse over the highlighted area
		$(SpotQuiz.page + ' .quiz-pages .yel_lighting').hover(function()
		{
			//console.log("disHover", SpotQuiz.disHover);
			//$(SpotQuiz.page + ' div.test').html("dis "+SpotQuiz.disHover);

			if(SpotQuiz.disHover) return;

			let id = $(this).attr('data-id');
			let fl = $(this).attr('data-flag');
			if(fl > 0) //the answer has already been (1-correct, 2-wrong, 3-disabled)
			{
				SpotQuiz.show_yn_menu(null,false);

				let m_page = $(this).parents('.quiz-m');
				let el_msg = m_page.find('.d_buble[data-id=' + id + ']');

				if(fl != 3) //not disabled
				{
					if(fl == 1)
						el_msg.addClass('d_buble_green');
					if(fl == 2)
						el_msg.addClass('d_buble_red');
					el_msg.addClass('d_buble_show');
				}
			}
			else
			{
				//Show safe/unsafe menu
				SpotQuiz.show_yn_menu(id,true);
			}
		},
		function() //leave
		{
			if(SpotQuiz.disHover) return;

			let m_page = $(this).parents('.quiz-m');
			let id = $(this).attr('data-id');
			let el_msg = m_page.find('.d_buble[data-id=' + id + ']');
			el_msg.removeClass('d_buble_show');
		}); //hover

		$(SpotQuiz.page + ' .quiz-pages .yel_lighting').click(function()
		{
			//$(SpotQuiz.page + ' div.test').html("dis "+SpotQuiz.disHover);

			let id = $(this).attr('data-id');
			//console.log("yel_lighting click", id);
			let fl = $(this).attr('data-flag');
			let m_page = $(this).parents('.quiz-m');

			//hide all bubles
			m_page.find('.d_buble').removeClass('d_buble_show');

			if(fl > 0) //the answer has already been (1-correct, 2-wrong, 3-disabled)
			{
				SpotQuiz.show_yn_menu(null,false);

				let el_msg = m_page.find('.d_buble[data-id=' + id + ']');

				if(fl != 3) //not disabled
				{
					if(fl == 1)
						el_msg.addClass('d_buble_green');
					if(fl == 2)
						el_msg.addClass('d_buble_red');
						
					el_msg.addClass('d_buble_show');
					el_msg.css('pointer-events', 'auto');
				}
			}
			else
			{
				//Show safe/unsafe menu
				SpotQuiz.show_yn_menu(id,true);
			}
		});

		$(SpotQuiz.page + ' .quiz-pages .d_buble').click(function()
		{
			$(this).removeClass('d_buble_show');
		});
		
		//safe/unsafe menu Click on answer
		$(SpotQuiz.page + ' .quiz-pages div.yn_menu').click(function(ev)
		{
			//fcorrect = true (correct), false (wrong)
			function incNA(fcorrect)
			{
				//save user's answer
				SpotQuiz.answers.push(fcorrect ? 1 : -1);
				
				//update count of correct answers
				let ncorrect = 0;
				for(let i=0; i<SpotQuiz.answers.length; i++)
					if(SpotQuiz.answers[i] > 0) ncorrect++;
					
				if(SpotQuiz.cnt < 1) return; //Error! Mustn't
				SpotQuiz.result = ncorrect * 100 / SpotQuiz.cnt;
				$(SpotQuiz.page + ' .quiz-progress .quest-n span.n').html(ncorrect);
			}
		
			let m_page = $(this).parents('.quiz-m');
			let data_id = $(this).attr('data-id');
			let data_ans = $(this).attr('data-ans');
			let id = $(this).attr('data-id');
			let f_safe = $(ev.target).hasClass('safe');
			let f_correct = false;
			
			if(f_safe && (data_ans == 0)) f_correct = true; //correct answer
			if(!f_safe && (data_ans == 1)) f_correct = true; //correct answer
			
			let yel_light = m_page.find('.yel_lighting[data-id=' + data_id + ']');
			if(f_correct) //correct
			{
				incNA(true);
				SpotQuiz.showUpPoint(m_page, data_id);
				//yel_lighting data-flag = 1 - correct
				yel_light.attr('data-flag', '1'); //correct user's answer
			}
			else //incorrect
			{
				incNA(false);
				SpotQuiz.showDnLife(m_page, data_id);
				yel_light.attr('data-flag', '2'); //incorrect user's answer
				if(SpotQuiz.lives > 0) { SpotQuiz.lives--; SpotQuiz.prnLives(); }
				if(SpotQuiz.lives < 1)
				{
					//no lives
					SpotQuiz.show_outlives();
					return;
				}
			}
			
			//remove blinking
			yel_light.removeClass('blink');
			
			//call LessonXX.examAnswer
			window['Lesson' + SpotQuiz.nPage].examAnswer(parseInt(SpotQuiz.nQuestion),f_correct);
			
			//hide yn_menu
			$(this).hide();
			
			if(SpotQuiz.isPageFinished())
			{
				//passed?
				let nBad = m_page.find('.yel_lighting[data-flag=2]').length;
				if(nBad < 1) //passed
				{
					$(SpotQuiz.page + ' .wrap-quiz .col-block').addClass('passed');
				}
				else //not passed
				{
					$(SpotQuiz.page + ' .wrap-quiz .col-block').addClass('not-passed');
				}
			
				//enable 'next question' button
				$(SpotQuiz.page + ' .col-butnext button.but-next').prop('disabled', false);
				
				clearInterval(SpotQuiz.timePage);
				SpotQuiz.timePage = 0;
				SpotQuiz.show_endround();
			}
		});
		
		//close pop-message
		$(SpotQuiz.page + ' .pop-msg span.close').click(function()
		{
			SpotQuiz.hide_popups();
		});
	},
	
	//Show safe/unsafe menu
	//id - id of menu (1, 2, 3, 4)
	show_yn_menu: function(id, f)
	{
		$(SpotQuiz.page + ' .quiz-pages .quiz-m.active div.yn_menu').hide();
		if(f == false) return;
		$(SpotQuiz.page + ' .quiz-pages .quiz-m.active div.yn_menu' + id).show();
	},

	//+1 point flies up
	showUpPoint: function(m_page, data_id)
	{
		let el = m_page.find('.pointsmsg[data-id=' + data_id + ']');
		var x = parseInt(el.css('left'));
		var y = parseInt(el.css('top'));

		el.stop(true);
		el.css({ 'display': 'block', 'opacity': 0 });
		el.css({'left':x+'px', 'top':y+'px'});

		el.animate({
			opacity:1
		}, 300, "linear", function()
		{
			el.animate({
				opacity:0,
				top:y-200+'px'
			},4000, "linear", function()
			{
				el.css({ 'top': y+'px', 'display': 'none' });
			});
		});
	},

	prnLives: function()
	{
		/*
		if(SpotQuiz.lives > 0)
		{
			let span_act = $(SpotQuiz.page + ' .quiz-progress .lives span.active').first();
			span_act.removeClass('active');
		}
		*/
		let d_lives = $(SpotQuiz.page + ' .quiz-progress .lives');
		let bgpos = -24 * SpotQuiz.lives;
		d_lives.css('background-position', '0 ' + bgpos + 'px');
	},

	//-1 life flies down
	showDnLife: function(m_page, data_id)
	{
		SpotQuiz.prnLives();

		let el = m_page.find('.lifemsg[data-id=' + data_id + ']');
		let x = parseInt(el.css('left'));
		let y = parseInt(el.css('top'));

		el.stop(true);
		el.css({ 'display': 'block', 'opacity': 0 });
		el.css({'left':x+'px', 'top':y+'px'});

		el.animate({
			opacity:1
		}, 300, "linear", function()
		{
			el.animate({
				opacity:0,
				top:y+150+'px'
			},4000, "linear", function()
			{
				el.css('top',y+'px');
				el.css('display','none');
			});
		});
	},

	//fill array SpotQuiz.nFiles
	makeNFiles: function()
	{
		SpotQuiz.nFiles = [];
		var n, i;
		
		for(i=0; i<SpotQuiz.files.length; i++)
		{
			if(SpotQuiz.fRand)
			{
				for(;;)
				{
					n = Math.floor(Math.random() * SpotQuiz.files.length);
					if(n >= SpotQuiz.files.length) continue;
					if(SpotQuiz.nFiles.includes(n)) continue;
					break;
				}
			}
			else
			{
				n = i;
			}
			SpotQuiz.nFiles.push(n);
		}
	},
	
	start: function()
	{
		SpotQuiz.makeNFiles(); //randomize pages
		$(SpotQuiz.page + ' .quiz-pages .quiz-m').removeClass('active'); //hide all pages

		var ntime = 60; //30 sec
		var tm = setInterval(function()
		{
			if(SpotQuiz.f_loaded) //all pages are loaded
			{
				clearInterval(tm);
				SpotQuiz.start_();
			}
			
			ntime--;
			if(ntime < 1)
			{
				clearInterval(tm);
				alert("Error: Not all spot-quiz pages have loaded!")
			}
		}, 500);
	},

	//Initialization. Performed before each start, including repeated ones.
	reInit: function()
	{
		SpotQuiz.f_endquiz = false;

		//disabled 'next lesson'
		$(SpotQuiz.page + ' .bot-buttons button.but-next').prop('disabled', true);
		//disable 'next question' button
		$(SpotQuiz.page + ' .col-butnext button.but-next').prop('disabled', true);
		//hide all messages
		SpotQuiz.hide_popups();
		//remove green/red border
		$(SpotQuiz.page + ' .wrap-quiz .col-block').removeClass('passed not-passed');

		//reset answers before start
		SpotQuiz.answers = [];
		SpotQuiz.result = 0;

		//reset # of page
		SpotQuiz.nCurrPage = 0;
		$(SpotQuiz.page + ' .quiz-progress .quiz-round span.n').html("1");
		//reset # of question
		SpotQuiz.nQuestion = 1;
		$(SpotQuiz.page + ' .quiz-progress .quest-n span.n').html("0");
		//lives
		SpotQuiz.lives = 12;
		SpotQuiz.prnLives();

		$(SpotQuiz.page + ' .quiz-pages .quiz-m').removeClass('active');

		//rects
		$(SpotQuiz.page + ' .quiz-progress .rects span').removeClass('bad ok');

		//init .yel_lighting
		let yel_lighting = $(SpotQuiz.page + ' .quiz-pages .yel_lighting');
		yel_lighting.attr('data-flag', 0);
		yel_lighting.removeClass('blink');
		
		//init bubles
		$(SpotQuiz.page + ' .quiz-pages .quiz-m .d_buble').removeClass('d_buble_green d_buble_red d_buble_show');
	},
	
	//Do not call this function!
	//It is called automatically from the start function only when all quiz pages have loaded.
	start_: function()
	{
		SpotQuiz.reInit();
		SpotQuiz.showCurrPage();
	},
	
	//show current page with questions
	showCurrPage: function()
	{
		$(SpotQuiz.page + ' .quiz-progress .quiz-round span.n').html(SpotQuiz.nCurrPage+1);
	
		let n = SpotQuiz.nFiles[SpotQuiz.nCurrPage];
		let m_page = $(SpotQuiz.page + ' .quiz-pages .q' + n);
		m_page.addClass('active');
		
		//remove green/red border
		$(SpotQuiz.page + ' .wrap-quiz .col-block').removeClass('passed not-passed');

		//disable 'next question' button
		$(SpotQuiz.page + ' .col-butnext button.but-next').prop('disabled', true);
		
		if(SpotQuiz.timePage > 0) clearInterval(SpotQuiz.timePage);
		SpotQuiz.timePage = 0;
		SpotQuiz.ntimePage = 0;
		SpotQuiz.timePage = setInterval(function()
		{
			SpotQuiz.ntimePage++;
		}, 1000);

		let noAnswered = m_page.find('.yel_lighting[data-flag=0]');
		noAnswered.addClass('blink');
	},

	isPageFinished: function()
	{
		let m_page = $(SpotQuiz.page + ' .quiz-pages .quiz-m.active');
		let noAnswered = m_page.find('.yel_lighting[data-flag=0]').length;
		//console.log("noAns",noAnswered, m_page, m_page.find('.yel_lighting[data-flag=0]'));
		if(noAnswered > 0) return false;
		return true;
	},

	//show the next quiz page
	butNext: function()
	{
console.log("f_endquiz",SpotQuiz.f_endquiz);
		if(SpotQuiz.f_endquiz)
		{
			Course.goLesson(SpotQuiz.nPageExit);
			return;
		}
	
		//hide all messages
		SpotQuiz.hide_popups();

		//do we have lives?
		if(SpotQuiz.lives < 1)
		{
			SpotQuiz.show_outlives();
			return;
		}
		
		//was the page completed successfully?
		let m_page = $(SpotQuiz.page + ' .quiz-pages .quiz-m.active');
/*
		let nBad = m_page.find('.yel_lighting[data-flag=2]').length;
		let rect = $(SpotQuiz.page + ' .quiz-progress .rects .rect-' + SpotQuiz.nCurrPage);
		if(nBad > 0) rect.addClass('bad');
		else rect.addClass('ok');
*/		
		SpotQuiz.nCurrPage++;

		//are the pages out?
		if(SpotQuiz.nCurrPage >= SpotQuiz.files.length)
		{
			SpotQuiz.show_endquiz();
			return;
		}
		
		//hide this completed page
		m_page.removeClass('active');
		
		//show the next page
		SpotQuiz.showCurrPage();
	},
	
	//close quiz
	exit: function()
	{
		//return to the parent lesson
		Course.goLesson(SpotQuiz.nPageExit);
	},
	
	//messages
	hide_popups: function()
	{
		$(SpotQuiz.page + ' .wrap-quiz .pop-msg').hide();
		$(SpotQuiz.page + ' .msg-endquiz').hide();
	},
	
	/*
	show_pop_bg: function()
	{
		$(SpotQuiz.page + ' .wrap-quiz .pop-bg').show();
		$(SpotQuiz.page + ' .quiz-pages div.yn_menu').css('display','none');
	},
	*/

	//Round summary
	show_endround: function()
	{
		let m_page = $(SpotQuiz.page + ' .quiz-pages .quiz-m.active');
		
		//answers
		let nans = m_page.attr('data-cntans');
		$(SpotQuiz.page + ' .pop-msg.msg-endround .nans').html(nans);
		//correct answers
		let ncorr = m_page.find('.yel_lighting[data-flag=1]').length;
		$(SpotQuiz.page + ' .pop-msg.msg-endround .ncorr').html(ncorr);
		//time
		let time = SpotQuiz.ntimePage;
		let min = parseInt(time / 60);
		let sec = time - min * 60;
		let stime = "";
		if(min < 10) stime += '0';
		stime += min + ':';
		if(sec < 10) stime += '0';
		stime += sec;
		$(SpotQuiz.page + ' .pop-msg.msg-endround .time').html(stime);
		//completed
		$(SpotQuiz.page + ' .pop-msg.msg-endround .compl').html(parseInt(SpotQuiz.result) + '%');
		
		//rect
		let nBad = m_page.find('.yel_lighting[data-flag=2]').length;
		let rect = $(SpotQuiz.page + ' .quiz-progress .rects .rect-' + SpotQuiz.nCurrPage);
		if(nBad > 0) rect.addClass('bad');
		else rect.addClass('ok');

		$(SpotQuiz.page + ' .pop-msg.msg-endround').show();
	},

	//You ran out of lives!
	show_outlives: function()
	{
		$(SpotQuiz.page + ' .pop-msg.msg-endlives').show();
	},
	
	//Game over
	show_endquiz: function()
	{
		SpotQuiz.f_endquiz = true; //end of quiz
	
		let resultClass = "bad";

		//stars (each star = 20%)
		let result = SpotQuiz.result;
		let stars = [ 0,0,0,0,0 ]; //0-grey, 1-greengrey, 2-green
		for(let i=0; i<5; i++)
		{
			if(result > 0)
			{
				stars[i] = 1;
			}
			if(result >= 20)
			{
				stars[i] = 2;
			}
			result -= 20;
			if(result < 1) break;
		}
		//console.log("stars", stars);
		let sstars = "";
		for(let i=0; i<5; i++)
		{
			if(stars[i] < 1) { sstars += '<div class="star"></div>'; continue; }
			if(stars[i] < 2) { sstars += '<div class="star greengrey"></div>'; continue; }
			sstars += '<div class="star green"></div>';
		}
		$(SpotQuiz.page + ' .msg-endquiz .d-stars').html(sstars);
		
		if(SpotQuiz.result >= SpotQuiz.thresholdGood) resultClass = "good";
		if(SpotQuiz.result >= SpotQuiz.thresholdGreat) resultClass = "great";

		$(SpotQuiz.page + ' .msg-endquiz span.score').html(SpotQuiz.result);

		$(SpotQuiz.page + ' .msg-endquiz').removeClass('bad good great');
		$(SpotQuiz.page + ' .msg-endquiz').show().addClass(resultClass);
	},

	//resize
	resize: function()
	{
		//resize .rects
		let rects = $(SpotQuiz.page + ' .quiz-progress .rects');
		let cx_rects = rects.width()+2; //minus last margin
		let cx = cx_rects / SpotQuiz.files.length;
		cx -= 3; //margin-right
		if(cx < 2) rects.children('span').css('width', '0');
		else rects.children('span').css('width', cx+'px');
	}
};
