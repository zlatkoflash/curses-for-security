//start page (chapters)
var Lesson0 = {
	f_pre: false,
	cyVSpace: 0,

	pre: function()
	{
		Lesson0.resize();

		if(!Lesson0.f_pre)
		{
			Lesson0.f_pre = true;

			//run lesson
			$('#lesson0 .chapter').click(function()
			{
				var lesN = $(this).attr('data-id');
				Course.goLesson(parseInt(lesN));
			});
		}

		//fill in the result of completing the lessons
		//Course.oState.les10 ... Course.oState.les50
		Lesson0.setProgress('.chapter1', 'les10');
		Lesson0.setProgress('.chapter2', 'les20');
		Lesson0.setProgress('.chapter3', 'les30');
		Lesson0.setProgress('.chapter4', 'les40');
		Lesson0.setProgress('.chapter5', 'les50');
	},

	setProgress: function(chapterN, lesState)
	{
		let perc = parseInt(Course.oState[lesState]);
		$('#lesson0 ' + chapterN + ' .title-progress span').html(perc + '%');
		$('#lesson0 ' + chapterN + ' .title-progress .bar .perc').width(Course.oState[lesState] + '%');
	},

	resize: function()
	{
		if(!Lesson0.f_pre)
		{
			Course.Header.init();

			//get cy .vspace
			Lesson0.cyVSpace = $("#lesson0 .chapter:first-child .vspace").height();
		}
		else Course.Header.reset();

		$("#lesson0 .chapter .vspace").css('height', Lesson0.cyVSpace+'px');

		//only for width > 600px
		var cxLes = $('#lesson0').width();
		if(cxLes > 600)
		{
			//calc max chapter height (cyChapterMax)
			var cyChapterMax = 0;
			$("#lesson0 .chapter").each(function () {
				let cy = $(this).height();
				if(cy > cyChapterMax) cyChapterMax = cy;
			});

			//set new value of cyVSpace for each chapter
			$("#lesson0 .chapter").each(function () {
				let cy = $(this).height();
				let cyVSpaceNew = Lesson0.cyVSpace + (cyChapterMax - cy);
				$(this).find('.vspace').height(cyVSpaceNew);
			});
		}
	}
};