var PhishMaster = {
	exam: phishMasterQuest, //see questions.js
	enableLusyAnswer: false,
	page: '#lesson33',
	nPage: 33,
	fSound: 1, //0-No sound
	cnt: 0, //count of questions
	nQuestion: 0, //curr question 0...cnt-1
	nLevelBeginner: 4,
	nLevelIntermed: 7,
	nLevelExpert: 10, //all answers were right
	nCurrLevel: 0,	//current max level (if after this value there were bad answers, then this level does not become lower)
	nResults: 0, //count of correct answers

	ini: function() //one-time!
	{
		PhishMaster.cnt = PhishMaster.exam.length;
		$(PhishMaster.page + ' .quiz-progress .quiz-round span.cnt').html(PhishMaster.cnt);
	
		//rects
		let rects = $(PhishMaster.page + ' .quiz-progress .rects');
		for(let i=0; i<PhishMaster.cnt; i++)
		{
			rects.append('<span class="rect-'+i+'"></span>');
		}
		
		//Listeners
		
		//answer
		$(PhishMaster.page + ' .wrap-quiz .row-answers .answer').click(function()
		{
			let id = $(this).attr('data-id');
			//disable answers
			$(PhishMaster.page + ' .wrap-quiz .row-answers .answer').css('pointer-events', 'none');
			//check answer
			let f_correct;
			let rect = $(PhishMaster.page + ' .quiz-progress .rects span.rect-' + PhishMaster.nQuestion);
			if(PhishMaster.exam[PhishMaster.nQuestion].answer == id)
			{ //right answer
				f_correct = true;
				$(this).addClass('ok');
				PhishMaster.exam[PhishMaster.nQuestion].user_result = 1;
				PhishMaster.startSound('audio.rightsound', false);
				rect.addClass('ok');
			}
			else
			{ //wrong answer
				f_correct = false;
				$(this).addClass('bad');
				PhishMaster.exam[PhishMaster.nQuestion].user_result = -1;
				PhishMaster.startSound('audio.wrongsound', false);
				rect.addClass('bad');
			}

			//save statistics
			PhishMaster.nResults = 0;
			for(let i=0; i<PhishMaster.exam.length; i++)
			{
				if(PhishMaster.exam[i].user_result > 0) 
					PhishMaster.nResults++;
			}
			window['Lesson' + PhishMaster.nPage].examAnswer(parseInt(PhishMaster.nQuestion),f_correct);

			//calc level, show message
			let lev = PhishMaster.calcLevel();
			PhishMaster.showProgress();

			//animation
			setTimeout(function() //pause before message
			{
				switch(parseInt(lev))
				{
					case 0: //wrong answer, show '.msg-bad'
						PhishMaster.showLevelMsg('.msg-bad');
						break;
					case 1: //wrong answer, show '.msg-lev' (beginner)
						PhishMaster.showLevelMsg('.msg-lev');
						break;
					case 2: //wrong answer, show '.msg-lev' (intermed)
						PhishMaster.showLevelMsg('.msg-lev');
						break;
					default: //>2 - right answer
						PhishMaster.nextQuestion();
						break;
				}
			}, 1500);
		});
	},
	
	start: function()
	{
		//init game
		PhishMaster.nQuestion = 0; //current question
		PhishMaster.nCurrLevel = 0;
		PhishMaster.nResults = 0;

		//hide messages
		PhishMaster.hideLevelMsg();

		//reset results
		for(let i=0; i<PhishMaster.exam.length; i++)
		{
			PhishMaster.exam[i].user_result = 0; //not answered yet
		}
		$(PhishMaster.page + ' .quiz-progress .rects span').removeClass('bad ok');
		
		PhishMaster.loadQuestion(); //load 1st question
		
		PhishMaster.resize();
		
		PhishMaster.startSound('audio.background', true);
	},

	loadQuestion: function()
	{
		if(PhishMaster.nQuestion >= PhishMaster.exam.length) return;
		
		//question
		let q = PhishMaster.exam[PhishMaster.nQuestion];
		$(PhishMaster.page + ' .wrap-quiz .question-box').html(q.question);

		//answers
		$(PhishMaster.page + ' .wrap-quiz .answer').removeClass('ok bad');

		let s = PhishMaster.page + ' .wrap-quiz .answer-';
		for(let ians=1; ians<=4; ians++) //4 answers max
		{
			if(q.answers.length >= ians)
			{
				$(s + ians).show();
				$(s + ians + ' .text').html(q.answers[ians-1]);
			}
			else
			{
				$(s + isans).hide();
			}
		}

		//image
		if(typeof q.image != 'undefined')
		{
			let path = pathStatic + '/phish-master/img/' + q.image;
			$(PhishMaster.page + ' .wrap-quiz .col-right div.image img').attr('src', path);
			$(PhishMaster.page + ' .wrap-quiz .col-right').css('display', 'block');
			$(PhishMaster.page + ' .wrap-quiz .col-left').removeClass('width100');
			PhishMaster.resize(); //set the height of the image to the same height as the left block
		}
		else
		{
			$(PhishMaster.page + ' .wrap-quiz .col-right').css('display', 'none');
			$(PhishMaster.page + ' .wrap-quiz .col-left').addClass('width100');
		}

		//enable answers
		$(PhishMaster.page + ' .wrap-quiz .row-answers .answer').css('pointer-events', 'auto');

		//show question # and level
		PhishMaster.showNQuestion();
		PhishMaster.showProgress();
	},
	
	//load next question
	nextQuestion: function()
	{
		PhishMaster.nQuestion++;
		if(PhishMaster.nQuestion >= PhishMaster.exam.length)
		{
			$(PhishMaster.page + ' .wrap-quiz .d-messages .msg-expert span.n-level').html(PhishMaster.nLevelExpert);
			PhishMaster.showLevelMsg('.msg-expert');
			PhishMaster.stopMusic();
			if(PhishMaster.fSound)
			{
				PhishMaster.startSound('audio.congrat', false);
			}
		}
		PhishMaster.loadQuestion();
	},
	
	tryAgain: function()
	{
		PhishMaster.hideLevelMsg();
		if(PhishMaster.nQuestion >= PhishMaster.exam.length)
		{
			$(PhishMaster.page + ' .wrap-quiz .d-messages .msg-expert span.n-level').html(PhishMaster.nLevelExpert);
			PhishMaster.showLevelMsg('.msg-expert');
			return;
		}
		PhishMaster.loadQuestion();
		PhishMaster.clearRects();
	},

	//If the answer was incorrect and the current level is less than "nLevelBeginner",
	//a failure message appears.
	//If the answer was incorrect and the current level is greater than or equal to
	//"nLevelBeginner", then the message "you have reached level xxx" appears.
	//In these cases, the game continues with the question that started the level reached
	//that is, with the question "nLevelBeginner" or "nLevelIntermed".
	//If the answer was correct, the level increases.
	
	calcLevel: function()
	{
		if(PhishMaster.exam[PhishMaster.nQuestion].user_result > 0)
		{ //right answer
			PhishMaster.nCurrLevel++;
			return 10;
		}
		else
		{		
			function clearAnswers()
			{
				for(let i=0; i<PhishMaster.exam.length; i++)
				{
					if(i >= PhishMaster.nQuestion)
						PhishMaster.exam[i].user_result = 0;
				}
			}
		
			if(PhishMaster.nCurrLevel < PhishMaster.nLevelBeginner)
			{
				PhishMaster.nCurrLevel = 0;
				PhishMaster.nQuestion = 0;
				clearAnswers();
				return 0;
			}
			
			if(PhishMaster.nCurrLevel < PhishMaster.nLevelIntermed)
			{
				$(PhishMaster.page + ' .wrap-quiz .d-messages .msg-lev span.n-level').html(PhishMaster.nLevelBeginner);
				PhishMaster.nCurrLevel = PhishMaster.nLevelBeginner;
				PhishMaster.nQuestion = PhishMaster.nLevelBeginner;
				clearAnswers();
				return 1;
			}

			$(PhishMaster.page + ' .wrap-quiz .d-messages .msg-lev span.n-level').html(PhishMaster.nLevelIntermed);
			PhishMaster.nCurrLevel = PhishMaster.nLevelIntermed;
			PhishMaster.nQuestion = PhishMaster.nLevelIntermed;
			clearAnswers();
			return 2;
		}
	},

	showLevelMsg: function(s)
	{
		$(PhishMaster.page + ' .wrap-quiz .d-messages ' + s).css('display','block');
		
		$(PhishMaster.page + ' .wrap-quiz .row-question, ' + PhishMaster.page + ' .wrap-quiz .row-answers').animate({
			opacity: 0
		}, 800);

		$(PhishMaster.page + ' .wrap-quiz .d-messages').animate({
			opacity: 1
		}, 800).css('pointer-events', 'auto');
	},
	
	hideLevelMsg: function()
	{
		$(PhishMaster.page + ' .wrap-quiz .row-question').css('opacity','1');
		$(PhishMaster.page + ' .wrap-quiz .row-answers').css('opacity','1');
		$(PhishMaster.page + ' .wrap-quiz .d-messages').css({'opacity': '0', 'pointer-events': 'none' });
		$(PhishMaster.page + ' .wrap-quiz .d-messages .msg').css('display','none');
	},
	
	clearRects: function()
	{
		$(PhishMaster.page + ' .quiz-progress .rects span').each(function(i)
		{
			if(i >= PhishMaster.nQuestion)
				$(this).removeClass('bad ok');
		});
	},

	showNQuestion: function()
	{
		//current question
		$(PhishMaster.page + ' .quiz-progress .quiz-round span.n').html((PhishMaster.nQuestion+1));
	},

	showProgress: function()
	{
		//level, priz
		let sLevel = 'beginner';
		let sPriz = 'level-0';
		if(PhishMaster.nCurrLevel >= PhishMaster.nLevelBeginner)
		{
			sPriz = 'level-1';
		}
		if(PhishMaster.nCurrLevel >= PhishMaster.nLevelIntermed)
		{
			sLevel = 'intermed';
			sPriz = 'level-2';
		}
		if(PhishMaster.nCurrLevel >= PhishMaster.nLevelExpert)
		{
			sLevel = 'expert';
			sPriz = 'level-3';
		}
		$(PhishMaster.page + ' .quiz-progress .level').removeClass('beginner intermed expert').addClass(sLevel);
		$(PhishMaster.page + ' .quiz-progress .priz').removeClass('level-0 level-1 level-2 level-3').addClass(sPriz);
	},
	
	//Plays a sound via HTML5 through Audio tags on the page
	//el must be the selector of an <audio> tag. (eg: '.background')
	//loop the boolean flag to loop or not loop this sound
	startSound: function(el, loop)
	{
		if(PhishMaster.fSound)
		{
			//stop prev sound
			if(!loop)
			{
				PhishMaster.stopSound('audio.rightsound');
				PhishMaster.stopSound('audio.wrongsound');
			}
		
			soundHandle = $(PhishMaster.page + ' ' + el)[0];
			if(loop) soundHandle.setAttribute('loop', loop);
			soundHandle.play();
		}
	},

	stopSound: function(el)
	{
		if(PhishMaster.fSound)
		{
			soundHandle = $(PhishMaster.page + ' ' + el)[0];
			soundHandle.pause();
			soundHandle.currentTime = 0;
		}
	},

	//stop background music
	stopMusic: function()
	{
		if(PhishMaster.fSound)
		{
			let soundHandle = $(PhishMaster.page + ' audio.background')[0];
			soundHandle.pause();
			soundHandle.currentTime = 0;
		}
	},

	resize: function()
	{
		//resize .rects
		let rects = $(PhishMaster.page + ' .quiz-progress .rects');
		let cx_rects = rects.width()+2; //minus last margin
		let cx = cx_rects / phishMasterQuest.length;
		cx -= 3; //margin-right
		if(cx < 2) rects.children('span').css('width', '0');
		else rects.children('span').css('width', cx+'px');
		
		//resize answer's image
		cx = $(PhishMaster.page).width();
		if(cx > 768)
		{
			let cy = $(PhishMaster.page + ' .wrap-quiz .col-left').height();
			$(PhishMaster.page + ' .wrap-quiz .col-right div.image').css('height', cy + 'px');
		}
		else
		{
			$(PhishMaster.page + ' .wrap-quiz .col-right div.image').css('height', 'auto');
		}
	}
};
