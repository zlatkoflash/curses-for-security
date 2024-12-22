var PhishPages = {
	page: '#lesson52',
	nPage: 52,
	exam: fin_exam2,
	nPageExit: 50, //Course.goLesson(50) at the end
	cnt: 0, //count of questions
	nQuestion: 0, //curr question 0...cnt-1
	nResults: 0, //count of correct answers
	f_ini: false,
	f_loaded: false,
	currQPage: null, //curr html-page with question

	ini: function() //one-time!
	{
		if(!PhishPages.f_ini) //once
		{
			PhishPages.f_ini = true;

			PhishPages.cnt = PhishPages.exam.length;
			$(PhishPages.page + ' .quiz-progress .quiz-round span.cnt').html(PhishPages.cnt);
		
			//rects
			let rects = $(PhishPages.page + ' .quiz-progress .rects');
			for(let i=0; i<PhishPages.cnt; i++)
			{
				rects.append('<span class="rect-'+i+'"></span>');
			}
			
			//load html-files
			let quiz_pages = $(PhishPages.page + ' .wrap-quiz .quiz-pages');
			let n_loaded = 0;
			for(let i=0; i<PhishPages.exam.length; i++)
			{
				let urlfile = PhishPages.exam[i].file;

				$.ajax({
					url: urlfile,
					dataType: 'html',
					success: function(res)
					{
						quiz_pages.append(res);
						n_loaded++;
					
						//if the last page
						if(n_loaded == PhishPages.exam.length)
						{
							PhishPages.f_loaded = true;
							PhishPages.start(); //the first call
						}
					},
					error: function()
					{
						alert("Cannot load a file " + urlfile);
					}
				});
			}

			//Listeners
			$(PhishPages.page + ' .wrap-quiz .check-question .chbox').click(function()
			{
				if($(this).hasClass('checked'))
					$(this).removeClass('checked');
				else
					$(this).addClass('checked');
					
				//should we enable 'next-question'?
				let f_dis = true;
				if($(PhishPages.page + ' .wrap-quiz .check-question .chbox.checked').length > 0) f_dis = false;
				PhishPages.disNextQuestion(f_dis);
			});
		}
		else
		{
			PhishPages.start(); //re-call quiz
		}
	},
	
	//Do not call this function.
	//This is called from the "ini" function.
	//The first call is made only when all pages have been loaded.
	start: function()
	{
		PhishPages.disNextLesson(true); //disable 'next lesson' button
		$(PhishPages.page + ' .quiz-progress .rects span').removeClass('ok bad');
		PhishPages.nResults = 0;
		PhishPages.nQuestion = 0;
		$(PhishPages.page + ' .wrap-quiz .check-question .chbox').removeClass('checked');

		PhishPages.loadQuestion(); //load current question
	},
	
	disNextLesson: function(mode)
	{
		$(PhishPages.page + ' .bot-buttons button.but-next-lesson').attr('disabled', mode);
	},

	disNextQuestion: function(mode)
	{
		$(PhishPages.page + ' .but-prev-next-q button.but-next').attr('disabled', mode);
	},

	loadQuestion: function()
	{
		if(PhishPages.nQuestion >= PhishPages.exam.length) return;

		PhishPages.disNextQuestion(true); //disable 'next question' button
		
		//question
		let q = PhishPages.exam[PhishPages.nQuestion];
		$(PhishPages.page + ' .wrap-quiz .question').html(q.question);
		$(PhishPages.page + ' .wrap-quiz .question2').html(q.question2);
		$(PhishPages.page + ' .quiz-progress .quiz-round span.n').html((PhishPages.nQuestion+1)); //# of question

		//answers
		$(PhishPages.page + ' .wrap-quiz .check-question .chbox')
			.removeClass('correct incorrect checked last')
			.css('pointer-events','auto');

		for(let ians=0; ians<5; ians++) //5 answers max
		{
			if(q.answers.length > ians)
			{
				$(PhishPages.page + ' .wrap-quiz .check-question .item' + ians).show();
				$(PhishPages.page + ' .wrap-quiz .check-question .item' + ians + ' .label').html(q.answers[ians]);
			}
			else
			{
				$(PhishPages.page + ' .wrap-quiz .check-question .item' + ians).hide();
			}
		}
		$(PhishPages.page + ' .wrap-quiz .check-question .item' + (q.answers.length-1)).addClass('last');
		
		$(PhishPages.page + ' .wrap-quiz .answer').hide(); //'correct' / 'incorrect'
		
		//html page
		$(PhishPages.page + ' .wrap-quiz .quiz-pages .quiz-ph').css('display','none').removeClass('answered');
		PhishPages.currQPage = $(PhishPages.page + ' .wrap-quiz .quiz-pages ' + q.page);
		PhishPages.currQPage.css('display','block');
	},
	
	nextQuestion: function()
	{
		if(PhishPages.currQPage.hasClass('answered'))
		{
			//go to the next page
			PhishPages.nQuestion++;
			if(PhishPages.nQuestion >= PhishPages.exam.length)
			{
				//end
				Course.goLesson(PhishPages.nPageExit);
			}
			else
			{
				PhishPages.loadQuestion(); //load the next question
			}
		}
		else
		{
			//result
			let el_ans = $(PhishPages.page + ' .wrap-quiz .check-question .chbox.checked');
			let ans = 0;
			el_ans.each(function()
			{
				let weight = $(this).attr('data-weight');
				ans += parseInt(weight);
			});
			
			let correct_ans = parseInt(PhishPages.exam[PhishPages.nQuestion].answer);
			let answers = PhishPages.exam[PhishPages.nQuestion].answers;
			let rect = $(PhishPages.page + ' .quiz-progress .rects span.rect-' + PhishPages.nQuestion);

			if(ans == correct_ans)
			{
				PhishPages.nResults++;

				$(PhishPages.page + ' .wrap-quiz .answer-correct').show();
				window['Lesson' + PhishPages.nPage].examAnswer(parseInt(PhishPages.nQuestion),true);
				rect.addClass('ok');
			}
			else
			{
				$(PhishPages.page + ' .wrap-quiz .answer-incorrect').show();
				window['Lesson' + PhishPages.nPage].examAnswer(parseInt(PhishPages.nQuestion),false);
				rect.addClass('bad');
				
				//show correct answers
				let sansw = "";
				if(correct_ans & 1) sansw += '<br>' + answers[0];
				if(correct_ans & 2) sansw += '<br>' + answers[1];
				if(correct_ans & 4) sansw += '<br>' + answers[2];
				if(correct_ans & 8) sansw += '<br>' + answers[3];
				if(correct_ans & 16) sansw += '<br>' + answers[4];
				sansw = sansw.substr(4);
				$(PhishPages.page + ' .wrap-quiz .answer-incorrect .corr-ans').html(sansw);
			}
			
			//select correct/incorrect answers
			$(PhishPages.page + ' .wrap-quiz .check-question .chbox').css('pointer-events', 'none');

			if(correct_ans & 1)
				$(PhishPages.page + ' .wrap-quiz .check-question .chbox.item0').addClass('correct');
			else
				$(PhishPages.page + ' .wrap-quiz .check-question .chbox.item0.checked').addClass('incorrect');
			
			if(correct_ans & 2)
				$(PhishPages.page + ' .wrap-quiz .check-question .chbox.item1').addClass('correct');
			else
				$(PhishPages.page + ' .wrap-quiz .check-question .chbox.item1.checked').addClass('incorrect');

			if(correct_ans & 4)
				$(PhishPages.page + ' .wrap-quiz .check-question .chbox.item2').addClass('correct');
			else
				$(PhishPages.page + ' .wrap-quiz .check-question .chbox.item2.checked').addClass('incorrect');

			if(correct_ans & 8)
				$(PhishPages.page + ' .wrap-quiz .check-question .chbox.item3').addClass('correct');
			else
				$(PhishPages.page + ' .wrap-quiz .check-question .chbox.item3.checked').addClass('incorrect');

			if(correct_ans & 16)
				$(PhishPages.page + ' .wrap-quiz .check-question .chbox.item4').addClass('correct');
			else
				$(PhishPages.page + ' .wrap-quiz .check-question .chbox.item4.checked').addClass('incorrect');
		
			//show tips after user's answer
			PhishPages.currQPage.addClass('answered');
		}
	},
	
	resize: function()
	{
		//resize .rects
		let rects = $(PhishPages.page + ' .quiz-progress .rects');
		let cx_rects = rects.width()+2; //minus last margin
		let cx = cx_rects / PhishPages.cnt;
		cx -= 3; //margin-right
		if(cx < 2) rects.children('span').css('width', '0');
		else rects.children('span').css('width', cx+'px');
	}
};
