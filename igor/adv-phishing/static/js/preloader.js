//preloader
loadFiles_obj = {
	scontent: "body > div.content .lessons",
	curr_n: 0, //number of current file name
	pages: [],
	end_fu: null,
	nimg: 0, //# images: preload_objects() ... objs
	nAll: 0, //number of preloaded files (htmls+imgs)
	progress_el: null,

	loadFiles: function(pages, fu)
	{
		loadFiles_obj.end_fu = fu;
		loadFiles_obj.pages = pages;
		loadFiles_obj.curr_n = 0;

		loadFiles_obj.mergeFile();
	},

	mergeFile: function()
	{
		if(loadFiles_obj.curr_n >= loadFiles_obj.pages.length)
		{
			//all lessons are downloaded
			//$('div.contentwrap div.progress').css('display', 'none');

			//init fragments
			loadFiles_obj.end_fu();
			return;
		}

		//if you want to use html file in the static/htm folder:
		//fname = pathStatic + '/htm/' + loadFiles_obj.pages[loadFiles_obj.curr_n];
		//else
		while(loadFiles_obj.curr_n < loadFiles_obj.pages.length)
		{
			page = loadFiles_obj.pages[loadFiles_obj.curr_n];
			if(page.file == "") loadFiles_obj.curr_n++;
			else break;
		}
		console.log("mergeFile",page);

		$.ajax(
		{
			type: 'GET',
			cache: false,
			dataType: 'html',
			success: function(res)
			{
				//if you want to use html file in the static/htm folder:
				//$(loadFiles_obj.scontent).append(res.replace(/static/g, pathStatic));
				//else
				$(loadFiles_obj.scontent).append(res);

				loadFiles_obj.curr_n++;

				//uncomment if there is a progressbar
				//loadFiles_obj.progress();

				loadFiles_obj.mergeFile();
			}, 

			error: function (jqXHR, exception)
			{
	        	var msg = '';
    		    if (jqXHR.status === 0) {
    	    	    msg = 'Not connect.\n Verify Network.';
		        } else if (jqXHR.status == 404) {
    	    	    msg = 'Requested page not found. [404]';
        		} else if (jqXHR.status == 500) {
    		        msg = 'Internal Server Error [500].';
		        } else if (exception === 'parsererror') {
        		   msg = 'Requested JSON parse failed.';
	    	    } else if (exception === 'timeout') {
    		        msg = 'Time out error.';
		        } else if (exception === 'abort') {
    	        msg = 'Ajax request aborted.';
        		} else {
	    	        msg = 'Uncaught Error.\n' + jqXHR.responseText;
    		    }
	        	$('#post').html(msg);
			},
			url: page.file
		});
	},

	progress: function()
	{
		var cxmax = loadFiles_obj.progress_el.width();
		var cx = loadFiles_obj.curr_n * cxmax / loadFiles_obj.nAll;
		cx = cx.toFixed(1);
		loadFiles_obj.progress_el.find('.line').css('width', cx+'px');
	}
};
