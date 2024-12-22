/*
	Customization:
	replace '#lesson35' to desired name
*/
var Tips2 = {
	lessonId: '#lesson35',
	cntTips: 8,
	afterChange: null,

	pre: function()
	{
		//Count of tips
		Tips2.cntTips = $(Tips2.lessonId + ' .tips-slider .tip').length;
		$(Tips2.lessonId + ' .top-fr .col-sequence span.cnt').text(Tips2.cntTips);

		//Generate col-tipsn
		$(Tips2.lessonId + ' .col-tipsn > div').remove();

		let sn = $(Tips2.lessonId + ' .col-tipsn').attr('data-txt');
		let i;
		for(i=1; i<=Tips2.cntTips; i++)
		{
			let div = '<div class="tipn tipn' + i + '" data-id="' + (i-1) +'">' + 
				'<span class="snfull">' + sn + i + '</span>' +
				'<span class="sn">' + i + '</span>' +
				'</div>';
			$(Tips2.lessonId + ' .col-tipsn').append(div);
		}

		//already initialized?
		var slider = $(Tips2.lessonId + ' .tips-slider');
		if(!slider.hasClass('slick-slider')) //not yet initialized
		{
			Tips2.init();
		}
		//else skip init because the slick object already exists

		//create slick object for Tips2.lessonId
		//and create handlers for it
		Tips2.init2();
	},
	
	init: function()
	{
		//see help: https://github.com/kenwheeler/slick#methods
		$(Tips2.lessonId + ' .tips-slider').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: false,
			cssEase: 'ease',
			autoplaySpeed: 4000,
			fade: false,
			pauseOnHover: true,
			speed: 100,
			infinite: false,
			dots: false
		})
		.on('afterChange', function (event, slick, currentSlide) {
			currentSlide++;

			//set # (Tip 1 out of 8)
			$(Tips2.lessonId + ' .top-fr .col-sequence span.n').text(currentSlide);

			//the curr tip is viewed, add class 'curr ok'
			$(Tips2.lessonId + ' .col-tipsn .tipn').removeClass('curr');
			$(Tips2.lessonId + ' .col-tipsn .tipn' + currentSlide).addClass('curr ok');

			//if the 1st tip
			if(currentSlide == 1)
				$(Tips2.lessonId + ' .top-fr button.but-prev').prop('disabled',true);
			else
				$(Tips2.lessonId + ' .top-fr button.but-prev').prop('disabled',false);
				
			//if the last tip
			if(currentSlide == Tips2.cntTips)
				$(Tips2.lessonId + ' .top-fr button.but-next').prop('disabled',true);
			else
				$(Tips2.lessonId + ' .top-fr button.but-next').prop('disabled',false);

			if(Tips2.afterChange) Tips2.afterChange(currentSlide-1);
		});
		
		//Back, Next buttons
		$(Tips2.lessonId + ' .top-fr button.but-prev').click(function()
		{
			$(Tips2.lessonId + ' .tips-slider').slick('slickPrev');
		});

		$(Tips2.lessonId + ' .top-fr button.but-next').click(function()
		{
			$(Tips2.lessonId + ' .tips-slider').slick('slickNext');
		});
		
		//Tip# click
		$(Tips2.lessonId + ' .col-tipsn .tipn').click(function()
		{
			let id = $(this).attr('data-id');
			$(Tips2.lessonId + ' .tips-slider').slick('slickGoTo', id);
		});
	},
	
	init2: function()
	{
		var slick = $(Tips2.lessonId + ' .tips-slider');
		slick.css('opacity',0);
		slick.animate({
			'opacity': 1
		}, 500);
		slick.slick('slickSetOption', 'speed', 10, true);  //set fast speed for redraw
		slick.slick('slickGoTo', 0);                       //redraw slick window
		slick.slick('slickSetOption', 'speed', 500, true); //set normal speed
	},
};
