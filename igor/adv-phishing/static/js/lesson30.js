//Games
var Lesson30 = {
	fDisNext: true, //true - "Next page" is disabled until all games are passed
	passPerc: 1, //minimum percentage of lesson 3 at which the "Next" button is allowed

	pre: function()
	{
		//set style for header
		Course.Header.setTitle($('#lesson30 input.stitle').val());
		Course.Header.setDescription($('#lesson30 input.sdescription').val());
		Course.Header.setMode(1,0,0); //menuMode, progressMode, infoMode

		Lesson30.calcPoints();
		Lesson30.disNext();
		$('#lesson30 .row-sect--game1 .progress_31 .perc').css('width', Course.oState.les30_1 + '%');
		$('#lesson30 .row-sect--game1 .progress_31 span').html(parseInt(Course.oState.les30_1) + '%');
		$('#lesson30 .row-sect--game2 .progress_32 .perc').css('width', Course.oState.les30_2 + '%');
		$('#lesson30 .row-sect--game2 .progress_32 span').html(parseInt(Course.oState.les30_2) + '%');
		$('#lesson30 .row-sect--game3 .progress_33 .perc').css('width', Course.oState.les30_3 + '%');
		$('#lesson30 .row-sect--game3 .progress_33 span').html(parseInt(Course.oState.les30_3) + '%');
	}, //pre

	calcPoints: function()
	{
		OCookies.saveVar('les30', Course.oState.les30_1/3 + Course.oState.les30_2/3 + Course.oState.les30_3/3);
		Course.calcPoints(); //calc Course.oState.allPoints
	},

	disNext: function()
	{
		let mode;
		if(Lesson30.fDisNext && (Course.oState.les30 < Lesson30.passPerc)) mode = true;
		else mode = false;
		$('#lesson30 .bot-buttons button.but-next').prop('disabled', mode);
	},

	resize: function()
	{
		$("#lesson30 .row-game-x .vspace").css('height', 0);

		//only for width > 1440px
		var cxLes = $('#lesson30').width();
		if(cxLes > 1440)
		{
			$('#lesson30 .row-game-x').each(function()
			{
				let rimg = $(this).find('.col-block .rimg');
				let cy_rimg = rimg.height();
				let ltxt = $(this).find('.col-block .ltxt');
				let cy_ltxt = ltxt.height();
				if(cy_ltxt < cy_rimg)
				{
					//set vspace height
					ltxt.find('.row-butprog .vspace').css('height', cy_rimg-cy_ltxt + 'px');
				}
			});
		}
	}
};

//Game1 - Spot the phishing scam
var Lesson31 = {
	f_pre: false,
	nCurrAns: 1,

	pre: function()
	{
		if(!Lesson31.f_pre)
		{
			Lesson31.f_pre = true;
			SpotQuiz.page = '#lesson31';
			SpotQuiz.nPage = 31;
			SpotQuiz.nPageExit = 30; //Course.goLesson(30) at the end
			SpotQuiz.ini();
			SpotQuiz.enableLusyAnswer = true; //enable lucyQuizAnswer statistics
		}

		Lesson31.nCurrAns = Course.examOffset.game31; //start question number
		Course.oState.les30_1 = 0; //%
		SpotQuiz.start();
	},

	//is called when user answers (clicks 'Safe' or 'Unsafe' button)
	examAnswer: function(nAns, res)
	{
		console.log("Lesson31.examAnswer", Lesson31.nCurrAns, res);
		
		//calc %
		Course.oState.les30_1 = SpotQuiz.result;

		//save state in cookies or SCORM chunk
		OCookies.saveVar('les30_1', Course.oState.les30_1);

		Lesson30.calcPoints();
		Course.LesProgress.update(); //update progressbar

		if(SpotQuiz.enableLusyAnswer)		
		{
			if(fSCORM)
			{
				saveState();
			}
			else
			{
				lucyQuizAnswer(Lesson31.nCurrAns, res);
			}
		}

		Lesson31.nCurrAns++;
	},

	resize: function()
	{
		SpotQuiz.resize();
	}
};

//Game2 - Phish or real?
var Lesson32 = {
	f_pre: false,
	nCurrAns: 1,

	pre: function()
	{
		if(!Lesson32.f_pre)
		{
			Lesson32.f_pre = true;
			PhQuiz.page = '#lesson32';
			PhQuiz.nPage = 32;
			PhQuiz.ini();
			PhQuiz.enableLusyAnswer = false; //enable lucyQuizAnswer statistics
		}
		Lesson32.nCurrAns = Course.examOffset.game32; //start question number
		Course.oState.les30_2 = 0; //%
		PhQuiz.start();
	},

	//is called when user answers (clicks 'Reg Main' or 'Phish Mail' button)
	examAnswer: function(nAns, res)
	{
		console.log("Lesson32.examAnswer", Lesson32.nCurrAns, res);
		
		//calc %
		if(res) //if that was the correct answer
		{
			Course.oState.les30_2 += 100/PhQuiz.cnt;
		}

		//save state in cookies or SCORM chunk
		OCookies.saveVar('les30_2', Course.oState.les30_2);

		Lesson30.calcPoints();
		Course.LesProgress.update(); //update progressbar

		if(PhQuiz.enableLusyAnswer)
		{
			if(fSCORM)
			{
				saveState();
			}
			else
			{
				lucyQuizAnswer(Lesson32.nCurrAns, res);
			}
		}

		Lesson32.nCurrAns++;
	},

	resize: function()
	{
		PhQuiz.resize();
	}
};

//Game3 - Phish Master
var Lesson33 = {
	f_pre: false,

	pre: function()
	{
		if(!Lesson33.f_pre)
		{
			Lesson33.f_pre = true;
			PhishMaster.page = '#lesson33';
			PhishMaster.nPage = 33;
			PhishMaster.exam = phishMasterQuest; //see questions.js
			PhishMaster.ini();
			PhishMaster.enableLusyAnswer = false; //enable lucyQuizAnswer statistics
		}
		Course.oState.les30_3 = 0; //%
		PhishMaster.start();
	},

	//is called when user answers
	examAnswer: function(nAns, res)
	{
		nAns += Course.examOffset.game33;
		console.log("Lesson33.examAnswer", nAns, res);
		
		//calc %
		Course.oState.les30_3 = 100*PhishMaster.nResults/PhishMaster.cnt;
		//save state in cookies or SCORM chunk
		OCookies.saveVar('les30_3', Course.oState.les30_3);

		Lesson30.calcPoints();
		Course.LesProgress.update(); //update progressbar

		if(PhishMaster.enableLusyAnswer)
		{
			if(fSCORM)
			{
				saveState();
			}
			else
			{
				lucyQuizAnswer(Lesson33.nAns, res);
			}
		}
	},

	resize: function()
	{
		PhishMaster.resize();
	}
};

