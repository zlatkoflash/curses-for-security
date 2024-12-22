//statistics
var Lesson300 = {
	f_pre: false,

	pre: function()
	{
		if(!Lesson0.f_pre)
		{
			Lesson0.f_pre = true;
		}

		//set style for header
		Course.Header.setTitle($('#lesson300 input.stitle').val());
		Course.Header.setDescription($('#lesson300 input.sdescription').val());
		Course.Header.setMode(1,0,0); //menuMode, progressMode, infoMode

		Lesson300.resize();

		//set progresses
		//Lesson1
		Lesson300.setProgress1('.les1', 'les10');
		Lesson300.setProgress2('.les1', 'les10_1', '.part-1');
		Lesson300.setProgress2('.les1', 'les10_2', '.part-2');

		//Lesson2
		Lesson300.setProgress1('.les2', 'les20');
		Lesson300.setProgress2('.les2', 'les20', '.part-1');

		//Lesson3
		Lesson300.setProgress1('.les3', 'les30');
		Lesson300.setProgress2('.les3', 'les30_1', '.part-1');
		Lesson300.setProgress2('.les3', 'les30_2', '.part-2');
		Lesson300.setProgress2('.les3', 'les30_3', '.part-3');

		//Lesson4
		Lesson300.setProgress1('.les4', 'les40');
		Lesson300.setProgress2('.les4', 'les40', '.part-1');

		//Lesson5
		Lesson300.setProgress1('.les5', 'les50');
		Lesson300.setProgress2('.les5', 'les50_1', '.part-1');
		Lesson300.setProgress2('.les5', 'les50_2', '.part-2');
		Lesson300.setProgress2('.les5', 'les50_3', '.part-3');
	},

	setProgress1: function(lesN, lesState)
	{
		let perc = parseInt(Course.oState[lesState]);
		$('.lesson.stat ' + lesN + ' .col-progress .line').width(Course.oState[lesState] + '%');
		$('.lesson.stat ' + lesN + ' .col-progress .perc').html(perc + '%');

		if(Course.oState[lesState] > 99) $('.lesson.stat ' + lesN).addClass('active');
		else $('.lesson.stat ' + lesN).removeClass('active');
	},

	setProgress2: function(lesN, lesState, partN)
	{
		$('.lesson.stat ' + lesN + ' .col-progress2 ' + partN + ' .line').width(Course.oState[lesState] + '%');
	},

	resize: function()
	{
		//for progress2
		$('.lesson.stat .col-progress2 .part').each(function()
		{
			var cx = $(this).width();
			var divWhite = $(this).find('div.white');
			divWhite.css('width', cx + 'px');
		});
	}
};