//Phishing URLs
var Lesson40 = {
	pre: function()
	{
		//set style for header
		Course.Header.setTitle($('#lesson10 input.stitle').val());
		Course.Header.setDescription($('#lesson10 input.sdescription').val());
		Course.Header.setMode(1,0,0); //menuMode, progressMode, infoMode
	}, //pre

	butNext: function()
	{
		Course.oState.les40 = 100;
		OCookies.saveVar('les40', 100);
		Course.LesProgress.update(); //update progressbar
	}
};
