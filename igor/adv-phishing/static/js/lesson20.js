//Phishing techniques

jQuery.fn.animateAuto = function(prop, speed, callback){
	var elem, height, width;
	return this.each(function(i, el){
		el = jQuery(el), elem = el.clone().css({"height":"auto","width":"auto"}).appendTo("body");
		height = elem.css("height"),
		width = elem.css("width"),
		elem.remove();
		
		if(prop === "height")
			el.animate({"height":height}, speed, callback);
		else if(prop === "width")
			el.animate({"width":width}, speed, callback);  
		else if(prop === "both")
			el.animate({"width":width,"height":height}, speed, callback);
	});  
}


var Lesson20 = {
	f_pre: false,
	fDisNext: true, //true - "Next page" is disabled until all items are viewed
	lenAcc: 1, //number of accordion items

	pre: function()
	{
		//set style for header
		Course.Header.setTitle($('#lesson20 input.stitle').val());
		Course.Header.setDescription($('#lesson20 input.sdescription').val());
		Course.Header.setMode(1,0,0); //menuMode, progressMode, infoMode

		if(!Lesson20.f_pre)
		{
			Lesson20.f_pre = true;

			Lesson20.lenAcc = $('#lesson20 .accordion > h3').length;

			//init accordion
			
			//set 'viewed' for 1st header
			//please comment if you want to close 1st header on start
			$('#lesson20 .accordion > h3.l20-acc-1').attr('data-act',1);
			
			$('#lesson20 .accordion').accordion({
				collapsible: true,
				heightStyle: "content",
				//active: false, //1st closed on start. Comment if you want to close 1st on start
				activate: function(event, ui) {
					ui.newHeader.attr('data-act',1);

					Lesson20.setPercent();
                  	$('#lesson20 .pop-msg').fadeOut(500);
                  	$('#lesson20 .pop-msg').css('display','none');
					
					Lesson20.hideAllPop();
					Lesson20.disNext();
				}
			});
		}

		//disable "Next" button
		Lesson20.disNext(true);
	}, //pre

	//If all accordion elements have been viewed, enable the "Next" button
	disNext: function()
	{
		let mode;
		if(Lesson20.fDisNext && (Course.oState.les20 < 100)) mode = true;
		else mode = false;

		$('#lesson20 .bot-buttons button.but-next').prop('disabled', mode);
	},
	
	setPercent:function()
	{
		let n = 0;
		$('#lesson20 .accordion > h3').each(function()
		{
			if($(this).attr('data-act') > 0) n++;
		});
		
		OCookies.saveVar('les20', n / Lesson20.lenAcc * 100);
		Course.LesProgress.update(); //update progressbar
	},

	showPop: function(n)
	{
		let pop = $('#lesson20 .pop'+n);
		let examp = pop.parents('.examp');
		examp.find('button.but-show').css('display','none');
		pop.addClass('active');
		pop.animateAuto('height', 1000, function()
		{
			pop.css('height', 'auto');
		});
	},

	hidePop: function(n)
	{
		let pop = $('#lesson20 .pop'+n);
		let examp = pop.parents('.examp');
		pop.animate({
			height: 0
		}, 1000, function()
		{
			pop.removeClass('active');
		});
		examp.find('button.but-show').css('display','inline-block');

		$("html, body").animate({
			scrollTop: examp.offset().top
		}, 1000);
	},
	
	hideAllPop: function()
	{
		$('#lesson20 .expand').css('height',0);
		$('#lesson20 .examp button.but-show').css('display','inline-block');
	}
};
