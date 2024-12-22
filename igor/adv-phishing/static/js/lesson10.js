//Introduction - What is phishing?
var Lesson10 = {
	fDisNext: true, //true - "Next page" is disabled until the video and tips are viewed
	videoLength: 1,
	videoPercentOld: 0,
	videoPlayer: null,
	tips: [],
	lenTips: 0,

	calcCountTips: function()
	{
		Lesson10.lenTips = $('#lesson10 .tips-slider .tip').length;
		//init tips state array
		let i;
		for(i=0; i<Lesson10.lenTips; i++) Course.oState.les10_tips.push(0);
	},

	pre: function()
	{
		//set style for header
		Course.Header.setTitle($('#lesson10 input.stitle').val());
		Course.Header.setDescription($('#lesson10 input.sdescription').val());
		Course.Header.setMode(1,0,0); //menuMode, progressMode, infoMode

		//init video
		//-------------------------------------------

		//called when the user has fully watched the video
		function videoFinished(opt) {
			lucyDispatchEvent("video-finish");
			console.log("video-finish");
			OCookies.saveVar('les10_1', 100);
			Lesson10.videoPercentOld = 100;
			OCookies.saveVar('les10', Course.oState.les10_1/2 + Course.oState.les10_2/2);
			Course.LesProgress.update(); //update progressbar

			if(Course.oState.les10 > 99) Lesson10.disNext(false);
		}

		//called periodically while watching a video
		function timeUpdate(opt) {
			let t = opt.player.currentTime();

			if (Lesson10.videoLength > 0) {
				opt.playedPercent = Math.floor(Math.ceil(100 * t / Lesson10.videoLength) / 5) * 5;

				if (opt.playedPercent > Lesson10.videoPercentOld) //every 5%
				{
					Lesson10.videoPercentOld = opt.playedPercent;
    	          	lucyDispatchEvent("Viewed:" + opt.playedPercent + "%");

					console.log(opt.playedPercent, Lesson10.videoLength);

					OCookies.saveVar('les10_1', opt.playedPercent);
					OCookies.saveVar('les10', Course.oState.les10_1/2 + Course.oState.les10_2/2);
					Course.LesProgress.update(); //update progressbar

					if(Course.oState.les10 > 99) Lesson10.disNext(false);
				}
			}
		}

		// Function to pause video if more than 50% of the video is out of the viewport
		function pauseVideoOnEdge(opt) {
		  const videoElement = document.getElementById(opt.id);
	  
		  function checkVideoPosition() {
			const rect = videoElement.getBoundingClientRect();
			const videoHeight = rect.height;
	  
			// Calculate how much of the video is visible in the viewport
			const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

			// Pause the video if more than 50% of the video is out of the viewport
			if (visibleHeight < videoHeight / 2) {
			  opt.player.pause(); // Pause the video
			  console.log("Video paused");
			}
		  }
	  
		  // Listen for scroll events to track video position
		  window.addEventListener("scroll", checkVideoPosition);
		}

		function loadJSON(callback) {
			// Use fetch for simplicity and readability
			console.log("fetch:", pathStatic + '/video/video-config.js');
			fetch(pathStatic + '/video/video-config.js')
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response error!');
					}
					return response.json();
				})
				.then(data => {
					// Check if the callback is a valid function before calling it
					if (typeof callback === 'function') {
						callback(data);
					} else {
						console.error("Callback is not a function!");
					}
				})
				.catch(error => {
					console.error("Error:", error);
				})
		}

		window.HELP_IMPROVE_VIDEOJS = false;

		//load video-config.json
		loadJSON(function (opt) {
			console.log(opt);


			// Player options
			let options = {
				playbackRates: opt.playbackRates,
				//aspectRatio: opt.playerAspectRatio,
				preload: opt.playerPreload,
				fluid: opt.playerIsFluid,
				controls: opt.playerEnableControls,
				controlBar: {
					playToggle: {
						replay: opt.playerEnableReplay,
					},
					volumePanel: opt.playerIsVolumePanelInline
				},
				//poster: pathStatic + '/video/poster/' + opt.playerPoster,
				//sources: [videoSrc]
			};

			if(!Lesson10.videoPlayer) //player is not initialized yet
			{
				Lesson10.videoLength = 1; //init (must not be 0)
				Lesson10.videoPercentOld = 0;
				opt.playedPercent = 0;

				let player = videojs(opt.id, options, function onPlayerReady() {
					opt.player = player;

					if (opt.disableProgress === true)
						this.controlBar.progressControl.disable(); //disable progress

					this.on("loadedmetadata", function () {
						console.log("duration", this.duration());
						Lesson10.videoLength = this.duration();
              
						document.getElementById('Phishing').classList.add('visible');

						// Disable right click on video
						if (opt.disableContextMenu) {
							this.on('contextmenu', function (e) {
								e.preventDefault();
							})
						}
					});

					this.on('playerresize', function () {
						//playerResize(opt);
					});

					this.on('ended', function () {
						videoFinished(opt);
					});

					this.on('timeupdate', function () {
						timeUpdate(opt);
					});

					// Call the function to pause video when it touches the viewport edge
					pauseVideoOnEdge(opt);
				});

				Course.Player = player;
				Lesson10.videoPlayer = player;
			} //if
		}); //loadJSON
		//-------------------------------------------

		//init tips
		//-------------------------------------------
		Tips2.lessonId = '#lesson10';
		Tips2.afterChange = Lesson10.tipsAfterChange;
		Tips2.pre();

		//set 'ok' for viewed tips
		for(let i=0; i<Tips2.cntTips; i++)
		{
			if(Course.oState.les10_tips[i] > 0)
			{
				$('#lesson10 .col-tipsn .tipn' + (parseInt(i)+1)).addClass('ok');
			}
		}
		//-------------------------------------------

		//disable "Next" button
		if(Lesson10.fDisNext && (Course.oState.les10 < 100))
		{
			Lesson10.disNext(true);
		}
	}, //pre

	disNext: function(mode)
	{
		$('#lesson10 .bot-buttons button.but-next').prop('disabled', mode);
	},

	//After slide change callback
	tipsAfterChange: function(currTip)
	{
		//console.log("Lesson10.tipsAfterChange",currTip);
		//calc %%
		let n_ok = $(Tips2.lessonId + ' .col-tipsn .tipn.ok').length;
		OCookies.saveVar('les10_2', n_ok / Tips2.cntTips * 100); //% of viewed tips

		OCookies.saveVarArr('les10_tips', currTip, 1); //curr tip is viewed
		OCookies.saveVar('les10', Course.oState.les10_1/2 + Course.oState.les10_2/2);
		Course.LesProgress.update(); //update progressbar

		console.log("Lesson10.tipsAfterChange", Course.oState.les10_1, Course.oState.les10_2, Course.oState.les10);
		if(Course.oState.les10 > 99) Lesson10.disNext(false);
	}
};
