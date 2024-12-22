var SCORMDriver = window.parent;
var fSCORM = false;

function loadState()
{
	if(typeof SCORMDriver.SetScore === 'undefined')
	{
		//load state from cookies
		OCookies.readVar('les10');   //lesson1 %
		OCookies.readVar('les10_1');
		OCookies.readVar('les10_2');
		for(let i = 0; i<Course.oState.les10_tips.length; i++)
		{
			OCookies.readVarArr('les10_tips', i);
		}

		OCookies.readVar('les20'); //lesson2 %

		OCookies.readVar('les30'); //lesson3 %
		OCookies.readVar('les30_1');
		OCookies.readVar('les30_2');
		OCookies.readVar('les30_3');

		OCookies.readVar('les40'); //lesson4 %

		OCookies.readVar('les50'); //lesson5 %
		OCookies.readVar('les50_1');
		OCookies.readVar('les50_2');
		OCookies.readVar('les50_3');

		console.log("no SCORM", Course.oState);
	}
	else
	{
		fSCORM = true;

		//load state
		var sState = SCORMDriver.GetDataChunk();
		if(sState && sState.length > 5)
		{
			Course.oState = JSON.parse(sState);
		}

		console.log("SCORM", Course.oState);
	}

	Course.calcPoints(); //calc Course.oState.allPoints
}

//save state
function saveState()
{
	if(fSCORM)
	{
		let sState = JSON.stringify(Course.oState);
		SCORMDriver.SetDataChunk(sState);

		SCORMDriver.SetScore(Course.oState.allPoints, 100, 0);
		if(Course.oState.allPoints >= Course.minPoints)
			SCORMDriver.SetPassed();

		SCORMDriver.CommitData();
	}

	console.log("saveState", Course.oState.allPoints);
}
