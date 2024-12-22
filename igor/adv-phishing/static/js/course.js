(typeof window.lucyQuizStart === 'undefined') && (window.lucyQuizStart = function() {
	console.log("lucyQuizStart");
});

(typeof window.lucyDispatchEvent === 'undefined') && (window.lucyDispatchEvent = function (a) {
	console.log("lucyDispatchEvent", a);
});

(typeof window.lucyQuizAnswer === 'undefined') && (window.lucyQuizAnswer = function (a, b)
{
	console.log("lucyQuizAnswer(", a, ",", b, ")");
});

(typeof window.lucyQuizEnd === 'undefined') && (window.lucyQuizEnd = function ()
{
	console.log("lucyQuizEnd");
});

$(window).on("load", function() 
{
	//load additional HTMLs
	loadFiles_obj.nAll = Course.pages.length;
	loadFiles_obj.loadFiles(Course.pages, function()
	{
		//all HTMLs loaded
		//...
		console.log("all HTMLs loaded");

		//We don't know how many tips there are so we have to count
		Lesson10.calcCountTips(); //Lesson10.lenTips = count tips

		loadState(); //load state from SCORM or cookies

		Course.goLesson(0);
		$('body>.page-wrap').addClass('sections-loading-completed');
		$('body').removeClass('disable-scroll');
	});
});

$(window).resize(function()
{
	Course.resizeLesson();
});


var Course = {
	pages: [
		//lesson #, file
		//Please do not use "-" symbols in file names.
		//For example, this name will not be accepted by Lucy: "10-intro.html"
		{ n: 0, file: "" },				//start page
		{ n: 10, file: "10intro.html" },	//Lesson1: Introduction - What is phishing?
		{ n: 20, file: "20phtech.html" },   //Lesson2: Phishing techniques
		{ n: 30, file: "30games.html" },	//Lesson3: Game1-game3
		{ n: 31, file: "31game1.html" },	//Game1
		{ n: 32, file: "32game2.html" },	//Game2
		{ n: 33, file: "33game3.html" },	//Game3
		{ n: 40, file: "40urls.html" },		//Lesson4: Phishing URLs
		{ n: 50, file: "50exam.html" },		//Lesson5: Exam1-exam3
		{ n: 51, file: "51exam1.html" },	//Exam1
		{ n: 52, file: "52exam2.html" },	//Exam2
		{ n: 53, file: "53exam3.html" },	//Exam3
		{ n: 300, file: "300stat.html" }	//statistics
	],

	examOffset: {
		exam51: 1,	//The 1st exam has question numbers from 1 to 5.
		exam52: 6,	//The 2nd exam has question numbers from 6 to 12.
		exam53: 13,	//The 3rd exam has question numbers from 13 to 18.
		game31: 19,	//The 1st game has question numbers from 19 to 38.
		game32: 39,	//The 2nd game has question numbers from 39 to 43
		game33: 44	//The 3rd game has question numbers from 44 to 53
	},

	oState: { //for saving results
		allPoints: 0.0, //all points: result for exams + quizes
		les10: 0, //lesson1 %
		les10_1: 0, //video %
		les10_2: 0, //tips %
		les10_lenTips: 0, //count of Tips
		les10_tips: [], //tips

		les20: 0, //lesson2 %

		les30: 0, //lesson3 %
		les30_1: 0, //game1 %
		les30_2: 0, //game2 %
		les30_3: 0, //game3 %

		les40: 0, //lesson4 %

		les50: 0, //lesson5 %
		les50_1: 0, //exam1 %
		les50_2: 0, //exam2 %
		les50_3: 0, //exam3 %
	},
	minPoints: 60, //minimal points
	expertPoints: 90, //expert
	Player: null,
	currLessonN: '0',

	//Calculates allPoints
	//We have 3 games and 3 exams, so:
	//allPoints = ((points_of_game1...3) + (point_of_exam1...3)) / 6
	//Any logic can be implemented here according to customer requirements.
	calcPoints: function()
	{
		let nTests = 3;

		//exams
		Course.oState.allPoints =
			parseInt(Course.oState.les50_1) + parseInt(Course.oState.les50_2) + parseInt(Course.oState.les50_3);

		if(SpotQuiz.enableLusyAnswer)
		{
			nTests++;
			Course.oState.allPoints += parseInt(Course.oState.les30_1);
		}
		if(PhQuiz.enableLusyAnswer)
		{
			nTests++;
			Course.oState.allPoints += parseInt(Course.oState.les30_2);
		}
		if(PhishMaster.enableLusyAnswer)
		{
			nTests++;
			Course.oState.allPoints += parseInt(Course.oState.les30_3);
		}

		Course.oState.allPoints /= nTests;

		//If we turn off statistics for one or more quizzes (see xxx.enableLusyAnswer),
		//then we must call the lucyQuizEnd function after passing all quizzes!

		//Have all quizzes been completed by the user?
		if((Lesson31.nCurrAns > Course.examOffset.game31) && //there was an attempt to pass the quiz1
		   (Lesson32.nCurrAns > Course.examOffset.game32) && //there was an attempt to pass the quiz2
		   (Lesson33.nCurrAns > Course.examOffset.game33))   //there was an attempt to pass the quiz3
		{
			lucyQuizEnd();
		}

		console.log("calcPoints", Course.oState.allPoints);
	},

	//Returns % result for lesson nLes
	//nLes = 10, 20, 30 ...
	getLesResult: function(nLes)
	{
		var n = parseInt(nLes);
		switch(n)
		{
			case 10: return Course.oState.les10;
			case 20: return Course.oState.les20;
			case 30: return Course.oState.les30;
			case 40: return Course.oState.les40;
			case 50: return Course.oState.les50;
		}
		return 0;
	},

	goLesson: function(nLes)
	{
		//pause the current video if exists
		if(Course.Player)
		{
			Course.Player.pause();
		}

		//stop music (Phish-Master)
		PhishMaster.stopMusic();

		switch(nLes)
		{
			case 0:
				Course.showLesson(0);
				Lesson0.pre();

				//init aQuestions[]
				for(let i=0; i<Course.nQuestions; i++) Course.aQuestions.push(0);

				//these pages contain the "LesProgress" component, which shows the percentage of lessons
				//viewed/completed. When initializing, we need to copy the component's html code to all pages.
				Course.LesProgress.copyToLes(10);
				Course.LesProgress.copyToLes(20);

				Course.LesProgress.copyToLes(30);
				Course.LesProgress.copyToLes(31);
				Course.LesProgress.copyToLes(32);
				Course.LesProgress.copyToLes(33);

				Course.LesProgress.copyToLes(40);

				Course.LesProgress.copyToLes(50);
				Course.LesProgress.copyToLes(51);
				Course.LesProgress.copyToLes(52);
				Course.LesProgress.copyToLes(53);

				lucyQuizStart();
				break;

			case 10:
				Lesson10.pre();
				Course.showLesson(10);
				break;

			case 20:
				Lesson20.pre();
				Course.showLesson(20);
				break;

			case 30: //game1-game3
				Lesson30.pre();
				Course.showLesson(30);
				break;
			case 31: //game1
				Lesson31.pre();
				Course.showLesson(31);
				break;
			case 32: //game2
				Lesson32.pre();
				Course.showLesson(32);
				break;
			case 33: //game3
				Lesson33.pre();
				Course.showLesson(33);
				break;

			case 40:
				Lesson40.pre();
				Course.showLesson(40);
				break;

			case 50: //exam1-exam3
				Lesson50.pre();
				Course.showLesson(50);
				break;
			case 51: //exam1
				Lesson51.pre();
				Course.showLesson(51);
				break;
			case 52: //exam2
				Lesson52.pre();
				Course.showLesson(52);
				break;
			case 53: //exam3
				Lesson53.pre();
				Course.showLesson(53);
				break;

			case 300: //statistics
				Course.showLesson(300);
				Lesson300.pre();
				break;
		}

		Course.resizeLesson();
		Course.LesProgress.update();
	},

	showLesson: function(nLesson)
	{
		for(let i=0; i<Course.pages.length; i++)
		{
			var pg = Course.pages[i].n;
			if(pg == nLesson)
			{
				$('#lesson'+pg).css('display','block').addClass('active');
				$("html, body").animate({ scrollTop: 0 });

				if(pg == 0)
				{
					$('html, body').addClass('page0');
				}
				else
				{
					$('html, body').removeClass('page0');
				}
			}
			else
				$('#lesson'+pg).css('display','none').removeClass('active');
		}

		Course.currLessonN = nLesson;
	},

	resizeLesson()
	{
		if(typeof window['Lesson' + Course.currLessonN].resize !== 'undefined')
		{
			window['Lesson' + Course.currLessonN].resize();
		}

		Course.LesProgress.resize(Course.currLessonN);
	},

	Header: {
		title: "",
		description: "",
		menuMode: 1, //0-hide, 1-full menu, 2-My Courses
		progressMode: 0, //0-hide, 1-show
		infoMode: 1, //0-hide, 1-show

		init: function()
		{
			this.title = $('.header .title h1').html();
			this.description = $('.header .title p').html();
			this.menuMode = 1;
			this.progressMode = 0;
			this.infoMode = 1;
		},

		//set header for the start page (restore default)
		reset: function()
		{
			$('.header .title h1').html(this.title);
			$('.header .title p').html(this.description);
			this.menuMode = 1;
			this.progressMode = 0;
			this.infoMode = 1;
			this.update();
		},

		setTitle: function(s)
		{
			$('.header .title h1').html(s);
		},

		setDescription: function(s)
		{
			$('.header .title p').html(s);
		},

		setMode: function(menuMode, progressMode, infoMode)
		{
			this.menuMode = menuMode;
			this.progressMode = progressMode;
			this.infoMode = infoMode;
			this.update();
		},

		//show/hide menu, progress, info
		update: function()
		{
			$('.header .menu .nav > ul > li').css('display', 'none');
			$('.header .menu .nav > ul > li.menu-mode' + this.menuMode).css('display', 'list-item');

			if(this.progressMode) $('.header .progress').removeClass('not-show');
			else $('.header .progress').addClass('not-show');

			if(this.infoMode)
			{
				$('.header .info').removeClass('not-show');
				$('.header .title').addClass('col-7');
			}
			else
			{
				$('.header .info').addClass('not-show');
				$('.header .title').removeClass('col-7');
			}

			if($('.header .title h1').html() != "" && $('.header .title p').html() != "")
			{
				$('.header .title').removeClass('empty');
				return;
			}

			//if title and description are empty
			$('.header .title').addClass('empty');
		},
	}, //Header

	//The "LesProgress" component shows the percentage of lessons viewed/completed.
	//When you need to update the data, call update(lesson_number)
	LesProgress: {
		//If the screen width is less than 768 pixels, shortened headings (data-short) are used
		minWidthFull: 768,

		//set %%
		update: function()
		{
			var allperc;
			var cntLessons;

			$('.lessons .lesson .LesProgress').each(function()
			{
				var progress = $(this);
				allperc = 0;
				cntLessons = 0;
				progress.find('.part').each(function(i)
				{
					//# of lesson (10. 20, 30...)
					var lesN = $(this).attr('data-lesn');
					//percentage of the lesson lesN
					var lesPerc = Course.getLesResult(lesN);
					//console.log(progress, i, $(this), lesN, lesPerc);

					$(this).find('.line').css('width', lesPerc + '%');
					allperc += lesPerc;
					cntLessons++;
				});
			});

			//Total percentage of lessons viewed
			$('.lessons .lesson .LesProgress .perc').html(parseInt(allperc/cntLessons) + '%');
		},

		//resize and fill component with text
		resize: function(lesN)
		{
			var p = Course.LesProgress;
			var el = $('#lesson' + lesN + ' .LesProgress');
			if(el.length < 1) return; //the lesson does not have LesProgress

			var cxLes = $('#lesson' + lesN).width();

			//set title and width for each part
			el.find('.part').each(function()
			{
				//set part title
				var s;
				var elBlack = $(this).find('.black');
				var elWhite = $(this).find('.white');

				if(cxLes < p.minWidthFull) s = elBlack.attr('data-short');
				else s = elBlack.attr('data-full');

				elBlack.html(s);
				elWhite.html(s);

				//set part width
				var cx = $(this).width();
				elWhite.css('width', cx + 'px');
			});
		},

		//copy html into lesson code (Initialization).
		copyToLes: function(lesN)
		{
			var el = $('.html-components .LesProgress');
			var partcx = el.attr('data-partcx');

			var elLes = $('#lesson' + lesN + ' .LesProgress');
			elLes.html(el.html());

			//set width of parts
			elLes.find('.part').each(function()
			{
				$(this).css('width', partcx);
			});
		},
	}, //LesProgress
};
