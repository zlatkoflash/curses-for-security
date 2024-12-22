var PhQuiz = {
	page: '#lesson32',
	nPage: 32,
	nQuestion: 1, //curr question 1...5
    files: [
        'qp2.html',
        'qp6.html',
        'qp8.html',
        'qp13.html',
        'qp14.html'
    ],
	result: 0, //% result
	quizEl: null, //$(PhQuiz.page + ' .wrap-quiz .quiz-body .quiz-body-wrap');
	cnt: 1, //count of emails
	currEmail: 0, //current email (0...cnt-1)
	
	ini: function() //one-time!
	{
		PhQuiz.cnt = PhQuiz.files.length;
		PhQuiz.quizEl = $(PhQuiz.page + ' .wrap-quiz .quiz-body .quiz-body-wrap');

		var cnt = 0;
		PhQuiz.files.map(function(item) {
			var urlfile = item;

			$.ajax({
				url: urlfile,
				dataType: 'html',
				success: function(res)
				{
					PhQuiz.quizEl.append(res);
					if(cnt == 0) //1st section.mail-section
					{
						PhQuiz.quizEl.children('section.mail-section').first().addClass('active');
					}
					if(cnt == (PhQuiz.cnt-1))
					{
						//last url
						PhQuiz.resize();
					}
					
					//add class 'mail-'+cnt
					PhQuiz.quizEl.children('section.mail-section').last().addClass('mail-'+cnt);
					
					cnt++;
				}
			});
		});

		//top rects
		var rects = $(PhQuiz.page + ' .quiz-tools .rects');
		var i;
		for(i=0; i<PhQuiz.cnt; i++)
		{
			rects.append('<span class="rect-'+i+'"></span>');
		}

		//correct
		$(PhQuiz.page + ' .quiz-tools .quiz-progress .correct span.n').text('0');

		//copy '.quiz-tools .quiz-progress' to '.col-block .narrowscr .quiz-progress'
		var childrenProgress = $(PhQuiz.page + ' .quiz-tools .quiz-progress').html();
		$(PhQuiz.page + ' .col-block .narrowscr .quiz-progress').append(childrenProgress);

		//vopy h3
		var h3html = $(PhQuiz.page + ' .control-interface h3.h3-isphish').html();
		$(PhQuiz.page + ' .col-block .narrowscr h3').html(h3html);

		//Listeners
		
		//a
		$(PhQuiz.page + ' .quiz-body-wrap').on('click', 'a', function(){
			return false;
		});

		//a:hover
		$(PhQuiz.page + ' .quiz-body-wrap').on('mouseover', 'a', function(){
			var cx = $(this).parent().width();
			var hoverdata = $(this).data("hover");
			hoverdata = hoverdata ? hoverdata : '';
			var hoveritem = $('<div style="max-width:' + cx + 'px">').addClass('hover-popup-link')
				.html("<p class='link-in-hover'>" + this.href + "</p><p class='hover-info'>" + hoverdata + "</p>");
			$(this).append(hoveritem);
			$(this).data("popup", hoveritem);
		});
		$(PhQuiz.page + ' .quiz-body-wrap').on('mouseout', 'a', function(){
			$(this).data("popup").remove();
		});
		
		//next - go to the next email
		$(PhQuiz.page + ' .quiz-tools .bot-mail-buttons button.but-next').click(function()
		{
			$(PhQuiz.page + ' .quiz-tools .bot-text').css('display', 'block');
			$(PhQuiz.page + ' .quiz-tools .bot-result').css('display', 'none');

			PhQuiz.scrollQuizTop();

			if(PhQuiz.currEmail < (PhQuiz.cnt-1))
			{
				PhQuiz.enableBackEmailBut(true);

				var sect;

				PhQuiz.currEmail++;
				PhQuiz.dispNEmail();
				//go to the next email
				PhQuiz.quizEl.find('section').removeClass('active');
				sect = PhQuiz.quizEl.find('section.mail-'+PhQuiz.currEmail);
				sect.addClass('active');
				
				//if answered then disable 'spam/not-spam' buttons
				if(sect.hasClass('answered'))
				{
					PhQuiz.enableRegPhishMailBut(false);
					PhQuiz.enableSolutionBut(true);
					
					//if answered - enable next mail
					PhQuiz.enableNextEmailBut(true);
				}
				else
				{
					PhQuiz.enableRegPhishMailBut(true);
					PhQuiz.enableSolutionBut(false);

					//if not answered - disable next mail
					PhQuiz.enableNextEmailBut(false);
				}
			}
			else
			{
				//if all emails answered
				if(PhQuiz.isAllAnswered())
				{
					//show end page
					PhQuiz.quizEl.find('section').removeClass('active');
					PhQuiz.quizEl.find('.end-page').addClass('active');
					//change "Test 1 to 5" to "Completed"
					$(PhQuiz.page + ' .results .left .not-completed').hide();
					$(PhQuiz.page + ' .results .left .completed').show();

					//disable 'reg mail' and 'phish mail' buttons
					PhQuiz.enableRegPhishMailBut(false);
					//disable 'hint' and 'solution' buttons
					PhQuiz.enableHintBut(false);
					PhQuiz.enableSolutionBut(false);
					//disable 'back/next email' buttons
					PhQuiz.enableBackEmailBut(false);
					PhQuiz.enableNextEmailBut(false);
					//enable 'next lesson' button
					PhQuiz.enableNextLessonBut(true);

					$(PhQuiz.page + ' .quiz-tools .control-interface').css('display', 'none');
					$(PhQuiz.page + ' .quiz-tools .control-try-again').css('display', 'block');
				}
			}
		});
		
		//back - go to the prev email
		$(PhQuiz.page + ' .quiz-tools .bot-mail-buttons button.but-prev').click(function()
		{
			$(PhQuiz.page + ' .quiz-tools .bot-text').css('display', 'block');
			$(PhQuiz.page + ' .quiz-tools .bot-result').css('display', 'none');

			PhQuiz.scrollQuizTop();

			if(PhQuiz.currEmail > 0)
			{
				var sect;

				PhQuiz.currEmail--;
				PhQuiz.dispNEmail();
				//go to the prev email
				PhQuiz.quizEl.find('section').removeClass('active');
				sect = PhQuiz.quizEl.find('section.mail-'+PhQuiz.currEmail);
				sect.addClass('active');
				
				//if answered then disable 'spam/not-spam' buttons
				if(sect.hasClass('answered'))
				{
					PhQuiz.enableRegPhishMailBut(false);
					PhQuiz.enableSolutionBut(true);

					//if answered - enable next mail
					PhQuiz.enableNextEmailBut(true);
				}
				else
				{
					PhQuiz.enableRegPhishMailBut(true);
					PhQuiz.enableSolutionBut(false);

					//if not answered - disable next mail
					PhQuiz.enableNextEmailBut(false);
				}
			}
			if(PhQuiz.currEmail < 1)
			{
				PhQuiz.enableBackEmailBut(false);
			}
		});
		
		//spam/not-spam buttons
		$(PhQuiz.page + ' .quiz-tools button.not-spam').click(function()
		{
			//disable spam/not-spam buttons
			PhQuiz.enableRegPhishMailBut(false);
		
			var sect = PhQuiz.quizEl.find('section.mail-'+PhQuiz.currEmail);
			sect.addClass('answered');

			if(sect.attr('data-not-spam') == 'true') //correct answer
			{
				window['Lesson' + PhQuiz.nPage].examAnswer(parseInt(PhQuiz.currEmail),true);
					
				//show result (color rect)
				PhQuiz.setPageResult(PhQuiz.currEmail, 1, 0);
			}
			else //wrong answer
			{
				window['Lesson' + PhQuiz.nPage].examAnswer(parseInt(PhQuiz.currEmail),false);

				//show result (color rect)
				PhQuiz.setPageResult(PhQuiz.currEmail, -1, 1);
			}
			
			PhQuiz.enableSolutionBut(true);

			PhQuiz.enableNextEmailBut(true);
		});

		$(PhQuiz.page + ' .quiz-tools button.spam').click(function()
		{
			//disable spam/not-spam buttons
			PhQuiz.enableRegPhishMailBut(false);

			var sect = PhQuiz.quizEl.find('section.mail-'+PhQuiz.currEmail);
			sect.addClass('answered');

			if(sect.attr('data-not-spam') == 'false') //correct answer
			{
				window['Lesson' + PhQuiz.nPage].examAnswer(parseInt(PhQuiz.currEmail),true);
					
				//show result (color rect)
				PhQuiz.setPageResult(PhQuiz.currEmail, 1, 1);
			}
			else //wrong answer
			{
				window['Lesson' + PhQuiz.nPage].examAnswer(parseInt(PhQuiz.currEmail),false);

				//show result (color rect)
				PhQuiz.setPageResult(PhQuiz.currEmail, -1, 0);
			}

			PhQuiz.enableSolutionBut(true);

			PhQuiz.enableNextEmailBut(true);
		});
		
		//Hint button
		$(PhQuiz.page + ' .quiz-tools .bot-mail-buttons button.hint').click(function()
		{
			PhQuiz.showSolution(-1); //hide solution
			PhQuiz.showHint(0); //show/hide hint
			PhQuiz.scrollQuizTop();
		});
		
		//Solution button
		$(PhQuiz.page + ' .quiz-tools .bot-mail-buttons button.solution').click(function()
		{
			PhQuiz.showHint(-1); //hide hint
			PhQuiz.showSolution(0); //show/hide solution
			PhQuiz.scrollQuizTop();
		});

		//Play again
		$(PhQuiz.page + ' .quiz-tools .control-try-again button.but-prev').click(function()
		{
			PhQuiz.quizEl.children('section').removeClass('active answered');

			//correct
			$(PhQuiz.page + ' .quiz-progress .correct span.n').text('0');

			//top rects - gray
			$(PhQuiz.page + ' .quiz-progress .rects span').removeClass('ok bad');
		
			PhQuiz.start();
		});

		//hide hint/solution
		$(PhQuiz.page + ' .quiz-body-wrap').on('click', '.mail-hint, .mail-solution', function(){
			$(this).hide();
		});
	},

	start: function()
	{
		//we want to init the quiz on start...
		PhQuiz.quizEl.find('div.end-page').removeClass('active');
		PhQuiz.quizEl.children('section').removeClass('active answered');
		PhQuiz.quizEl.children('section').first().addClass('active');

		//count of emails
		$(PhQuiz.page + ' .quiz-progress span.cnt').text(PhQuiz.cnt);
		//correct
		$(PhQuiz.page + ' .quiz-tools .quiz-progress .correct span.n').text('0');

		//top rects - gray
		$(PhQuiz.page + ' .quiz-tools .rects span').removeClass('ok bad');
		
		PhQuiz.currEmail = 0;
		PhQuiz.dispNEmail();
		//

		var sect = PhQuiz.quizEl.find('section.mail-'+PhQuiz.currEmail);
		sect.addClass('active');
		PhQuiz.quizEl.find('.mail-hint').hide();
		PhQuiz.quizEl.find('.mail-solution').hide();
			
		//disable 'back email' button
		PhQuiz.enableBackEmailBut(false);
		//disable 'next email' button
		PhQuiz.enableNextEmailBut(false);
		//enable 'hint' button
		PhQuiz.enableHintBut(true);
		//disable 'solution' button
		PhQuiz.enableSolutionBut(false);
		//enable 'reg/phish email' buttons
		PhQuiz.enableRegPhishMailBut(true);
		//disable 'next lesson' button
		PhQuiz.enableNextLessonBut(false);

		//if answered...
		if(sect.hasClass('answered'))
		{
			//enable 'solution' button
			PhQuiz.enableSolutionBut(true);
			//disable 'reg/phish email' buttons
			PhQuiz.enableRegPhishMailBut(false);
			//enable 'next email' button
			PhQuiz.enableNextEmailBut(true);
		}
		
		//disable 'next lesson' button
		if(PhQuiz.isAllAnswered()) PhQuiz.enableNextLessonBut(true);
		else PhQuiz.enableNextLessonBut(false);

		$(PhQuiz.page + ' .quiz-tools .control-interface').css('display', 'block');
		$(PhQuiz.page + ' .quiz-tools .control-try-again').css('display', 'none');

		$(PhQuiz.page + ' .quiz-tools .bot-text').css('display', 'block');
		$(PhQuiz.page + ' .quiz-tools .bot-result').css('display', 'none');

		//change "Completed" to "Test 1 to 5"
		$(PhQuiz.page + ' .results .left .not-completed').show();
		$(PhQuiz.page + ' .results .left .completed').hide();
	},
	
	resize: function()
	{
		//resize .quiz-tools .rects
		var rects = $(PhQuiz.page + ' .quiz-tools .quiz-progress .rects');
		var cx_rects = rects.width()+2; //minus last margin
		var cx = cx_rects / PhQuiz.cnt;
		cx -= 3; //margin-right
		if(cx < 2) rects.children('span').css('width', '0');
		else rects.children('span').css('width', cx+'px');

		//resize .col-block .narrowscr .quiz-progress .rects
		rects = $(PhQuiz.page + ' .col-block .narrowscr .quiz-progress .rects');
		var cx_rects = rects.width()+2; //minus last margin
		var cx = cx_rects / PhQuiz.cnt;
		cx -= 3; //margin-right
		if(cx < 2) rects.children('span').css('width', '0');
		else rects.children('span').css('width', cx+'px');
	},
	
	enableHintBut: function(mode)
	{
		if(mode)
			$(PhQuiz.page + ' .quiz-tools button.hint').prop('disabled',false);
		else
			$(PhQuiz.page + ' .quiz-tools button.hint').prop('disabled',true);
	},

	enableSolutionBut: function(mode)
	{
		if(mode)
			$(PhQuiz.page + ' .quiz-tools button.solution').prop('disabled',false);
		else
			$(PhQuiz.page + ' .quiz-tools button.solution').prop('disabled',true);
	},
	
	enableRegPhishMailBut: function(mode)
	{
		if(mode)
			$(PhQuiz.page + ' .quiz-tools .mail-buttons button.quiz-btn').prop('disabled',false);
		else
			$(PhQuiz.page + ' .quiz-tools .mail-buttons button.quiz-btn').prop('disabled',true);
	},

	enableBackEmailBut: function(mode)
	{
		if(mode)
		{
			$(PhQuiz.page + ' .quiz-tools .control-interface button.but-prev').prop('disabled',false);
		}
		else
		{
			$(PhQuiz.page + ' .quiz-tools .control-interface button.but-prev').prop('disabled',true);
		}
	},
	
	enableNextEmailBut: function(mode)
	{
		if(mode)
		{
			$(PhQuiz.page + ' .quiz-tools .control-interface button.but-next').prop('disabled',false);
		}
		else
		{
			$(PhQuiz.page + ' .quiz-tools .control-interface button.but-next').prop('disabled',true);
		}
	},
	
	enableNextLessonBut: function(mode)
	{
		if(mode)
		{
			$(PhQuiz.page + ' .bot-buttons button.but-next').prop('disabled',false);
		}
		else
		{
			$(PhQuiz.page + ' .bot-buttons button.but-next').prop('disabled',true);
		}
	},

	//If mobile device
	//scroll top
	scrollQuizTop: function()
	{
		//mobile divice?
		var fl = $(PhQuiz.page + ' .quiz-tools').css('float');
		var offs = $(PhQuiz.page + ' .wrap-quiz').offset();

		if(fl == 'none')
			$("html, body").animate({ scrollTop: offs.top+'px' });
	},
	
	//set result for a email-page
	//nPage - # of page (0...PhQuiz.cnt-1)
	//res - 1 - ok, -1 - bad, 0 - no answered
	//spam - 0 - not spam, 1 - spam
	setPageResult: function(nPage, res, spam)
	{
		var rect = $(PhQuiz.page + ' .quiz-progress .rects .rect-' + nPage);
		rect.removeClass('ok bad');
		if(res > 0) rect.addClass('ok');
		if(res < 0) rect.addClass('bad');
		
		//calc count of 'ok' rects
		var n = $(PhQuiz.page + ' .quiz-tools .quiz-progress .rects .ok').length;
		$(PhQuiz.page + ' .quiz-progress .correct span.n').text(n);
		//calc %%
		PhQuiz.result = n / PhQuiz.cnt * 100;

		//set .bot-result
		$(PhQuiz.page + ' .quiz-tools .bot-text').css('display', 'none');
		$(PhQuiz.page + ' .quiz-tools .bot-result').css('display', 'block');
		if(res < 0)
		{
			$(PhQuiz.page + ' .quiz-tools .bot-result .bad').show();
			$(PhQuiz.page + ' .quiz-tools .bot-result .ok').hide();
			if(spam > 0)
			{
				$(PhQuiz.page + ' .quiz-tools .bot-result .phish').show();
				$(PhQuiz.page + ' .quiz-tools .bot-result .regular').hide();
			}
			else
			{
				$(PhQuiz.page + ' .quiz-tools .bot-result .phish').hide();
				$(PhQuiz.page + ' .quiz-tools .bot-result .regular').show();
			}
		}
		else
		{
			$(PhQuiz.page + ' .quiz-tools .bot-result .bad').hide();
			$(PhQuiz.page + ' .quiz-tools .bot-result .ok').show();
			$(PhQuiz.page + ' .quiz-tools .bot-result .regular').hide();
			$(PhQuiz.page + ' .quiz-tools .bot-result .phish').hide();
		}
	},
	
	isAllAnswered: function()
	{
		var r = true;
		var sects = PhQuiz.quizEl.children('section');
		if(sects.length < 1) return false;

		sects.each(function()
		{
			if(!$(this).hasClass('answered')) { r = false; return false; }
		});
		return r;
	},
	
	dispNEmail: function()
	{
		$(PhQuiz.page + ' .results .left span.n').text(parseInt(PhQuiz.currEmail)+1);
	},
	
	//Show/hide hint on current mail
	//mode: 1 - show hint
	//		-1 - hide hint
	//		0 - toggle hint
	showHint: function(mode)
	{
		var sect = PhQuiz.quizEl.find('section.mail-'+PhQuiz.currEmail);
		var hint = sect.find('.mail-hint');
		
		if(mode == 0) //toggle
		{
			if(hint.is(':visible'))
				hint.hide();
			else
				hint.show();
			return;
		}
		if(mode < 0) //hide
			hint.hide();
		else //show
			hint.show();
	},

	//Show/hide solution on current mail
	//mode: 1 - show solution
	//		-1 - hide solution
	//		0 - toggle solution
	showSolution: function(mode)
	{
		var sect = PhQuiz.quizEl.find('section.mail-'+PhQuiz.currEmail);
		var sol = sect.find('.mail-solution');
		
		if(mode == 0) //toggle
		{
			if(sol.is(':visible'))
				sol.hide();
			else
				sol.show();
			return;
		}
		if(mode < 0) //hide
			sol.hide();
		else //show
			sol.show();
	}
};
