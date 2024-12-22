//Exam1-exam3
var Lesson50 = {
	fDisNext: true, //true - "Next page" is disabled until all games are passed
	passPerc: 1, //minimum percentage of lesson 5 at which the "Next" button is allowed

	pre: function()
	{
		//set style for header
		Course.Header.setTitle($('#lesson50 input.stitle').val());
		Course.Header.setDescription($('#lesson50 input.sdescription').val());
		Course.Header.setMode(1,0,0); //menuMode, progressMode, infoMode

		Lesson50.calcPoints();
		Lesson50.disNext();
		$('#lesson50 .row-sect--exam1 .progress_51 .perc').css('width', Course.oState.les50_1 + '%');
		$('#lesson50 .row-sect--exam1 .progress_51 span').html(parseInt(Course.oState.les50_1) + '%');
		$('#lesson50 .row-sect--exam2 .progress_52 .perc').css('width', Course.oState.les50_2 + '%');
		$('#lesson50 .row-sect--exam2 .progress_52 span').html(parseInt(Course.oState.les50_2) + '%');
		$('#lesson50 .row-sect--exam3 .progress_53 .perc').css('width', Course.oState.les50_3 + '%');
		$('#lesson50 .row-sect--exam3 .progress_53 span').html(parseInt(Course.oState.les50_3) + '%');
	}, //pre

	calcPoints: function()
	{
		OCookies.saveVar('les50', Course.oState.les50_1/3 + Course.oState.les50_2/3 + Course.oState.les50_3/3);
		Course.calcPoints(); //calc Course.oState.allPoints
	},

	disNext: function()
	{
		let mode;
		if(Lesson50.fDisNext && (Course.oState.les50 < Lesson50.passPerc)) mode = true;
		else mode = false;
		$('#lesson50 .bot-buttons button.but-next').prop('disabled', mode);
	},
};

//Exam1
var Lesson51 = {
	nCurrAns: 1,

	pre: function()
	{
		Lesson51.nCurrAns = Course.examOffset.exam51; //start question number
		Course.oState.les50_1 = 0; //%

		Exam.nPage = 51;
		Exam.page = '#lesson51';
		Exam.exam = fin_exam1;
		Exam.ini();
	},

	examAnswer: function(nAns, res)
	{
		console.log("Lesson51.examAnswer", Lesson51.nCurrAns, res);
		
		//calc %
		if(res) //if that was the correct answer
		{
			if(Exam.exam[0].randQ > 0) //rand questions
				Course.oState.les50_1 += 100/Exam.exam[0].countQ;
			else //all questions
				Course.oState.les50_1 += 100/Exam.exam.length;
		}

		//save state in cookies or SCRORM chunk
		OCookies.saveVar('les50_1', Course.oState.les50_1);
		Lesson50.calcPoints();
		Course.LesProgress.update(); //update progressbar

		if(fSCORM)
		{
			saveState();
		}
		else
		{
			lucyQuizAnswer(Lesson51.nCurrAns, res);
		}

		Lesson51.nCurrAns++;
	},

	examEnd: function()
	{
		console.log("Lesson51.examEnd");
	}
};

//Exam2 - Phish Pages
var Lesson52 = {
	pre: function()
	{
		Course.oState.les50_2 = 0; //%

		PhishPages.nPage = 52;
		PhishPages.page = '#lesson52';
		PhishPages.exam = fin_exam2;
		PhishPages.nPageExit = 50;
		PhishPages.ini();
	},

	examAnswer: function(nAns, res)
	{
		nAns += Course.examOffset.exam52; //plus start question number
		console.log("Lesson52.examAnswer", nAns, res);
		
		//calc %
		Course.oState.les50_2 = 100*PhishPages.nResults/PhishPages.cnt;
		//save state in cookies or SCORM chunk
		OCookies.saveVar('les50_2', Course.oState.les50_2);

		Lesson50.calcPoints();
		Course.LesProgress.update(); //update progressbar

		if(fSCORM)
		{
			saveState();
		}
		else
		{
			lucyQuizAnswer(nAns, res);
		}
	},

	resize: function()
	{
		PhishPages.resize();
	}
};

//Exam3 (the same exam structure as exam 1)
var Lesson53 = {
	nCurrAns: 13,

	pre: function()
	{
		Lesson53.nCurrAns = Course.examOffset.exam53; //start question number
		Course.oState.les50_3 = 0; //%

		Exam.nPage = 53;
		Exam.page = '#lesson53';
		Exam.exam = fin_exam3;
		Exam.ini();
	},

	examAnswer: function(nAns, res)
	{
		console.log("Lesson53.examAnswer", Lesson53.nCurrAns, res);
		
		//calc %
		if(res) //if that was the correct answer
		{
			if(Exam.exam[0].randQ > 0) //rand questions
				Course.oState.les50_3 += 100/Exam.exam[0].countQ;
			else //all questions
				Course.oState.les50_3 += 100/Exam.exam.length;
		}

		//save state in cookies or SCRORM chunk
		OCookies.saveVar('les50_3', Course.oState.les50_3);
		Lesson50.calcPoints();
		Course.LesProgress.update(); //update progressbar

		if(fSCORM)
		{
			saveState();
		}
		else
		{
			lucyQuizAnswer(Lesson53.nCurrAns, res);
		}

		Lesson53.nCurrAns++;
	},

	examEnd: function()
	{
		console.log("Lesson53.examEnd");
	}
};
