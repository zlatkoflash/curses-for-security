var OCookies =
{
	nTimeCookie: 31536000, //1 year

	getCookieVal: function(offset)
	{
		var endstr = document.cookie.indexOf(";", offset);
		if(endstr == -1)
		{
			endstr = document.cookie.length;
		}
		return unescape(document.cookie.substring(offset, endstr));
	},

	getCookie: function(name)
	{
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		while(i < clen)
		{
			var j = i + alen;
			if(document.cookie.substring(i, j) == arg)
			{
				return OCookies.getCookieVal(j);
			}
			i = document.cookie.indexOf(" ", i) + 1;
			if(i == 0)
			{
				break;
			}
		}
		return 0;
	},

	//name - cookie name
	//value - cookie val (string)
	//options - obj with additional properties:
	//		expires - time of exp.
	//			number - seconds.
	//			Date obj - date.
	//		if expires in past - cookie will be deleted.
	//		if expires = 0 (or miss), cookie will be set as session.
	setCookie: function(name, value, options)
	{
		//console.log("setCookie", name, value, options);
		options = options || { expires: OCookies.nTimeCookie };
		var expires = options.expires;
		if(typeof expires == "number" && expires)
		{
			var d = new Date();
			d.setTime(d.getTime() + expires*1000);
			expires = options.expires = d;
		}

		if(expires && expires.toUTCString)
		{
			options.expires = expires.toUTCString();
		}

		value = encodeURIComponent(value);
		var updatedCookie = name + "=" + value;

		for(var propName in options)
		{
			updatedCookie += "; " + propName;
			var propValue = options[propName];   
			if(propValue !== true)
			{
				updatedCookie += "=" + propValue;
			}
		}
		document.cookie = updatedCookie;
	},
/*
	//attr: "passed", "time", ...etc
	setLessonAttr: function(nLesson, attr, val)
	{
		if(val == undefined) val = "0";
		OCookies.setCookie("les"+nLesson +"_"+attr, val);
	},

	//remove cookie
	resLessonAttr: function(nLesson, attr)
	{
		OCookies.setCookie("les"+nLesson +"_"+attr, "0", -3600);
	}
*/

	//varName - name of variable, eg: 'les10'
	saveVar: function(varName, val)
	{
		Course.oState[varName] = val;

		if(fSCORM)
		{
			var s = JSON.stringify(Course.oState);
			SCORMDriver.SetDataChunk(s);
			SCORMDriver.CommitData();
		}
		else
		{
			OCookies.setCookie(varName, val);
		}
	},

	//varName - name of array, eg: 'les10_tips'
	//ind - index of array. Eg: ('les10_tips', 5, 1) - Course.oState.les10_tips[5] = val; and save
	saveVarArr: function(varName, ind, val)
	{
		Course.oState[varName][ind] = val;

		if(fSCORM)
		{
			var s = JSON.stringify(Course.oState);
			SCORMDriver.SetDataChunk(s);
			SCORMDriver.CommitData();
		}
		else
		{
			OCookies.setCookie(varName + ind, val);
		}
	},

	readVar: function(varName)
	{
		if(!fSCORM)
		{
			let v = parseInt(OCookies.getCookie(varName))
			if(v !== v) v = 0;
			Course.oState[varName] = v;
		}

		return Course.oState[varName];
	},

	readVarArr: function(varName, ind)
	{
		if(!fSCORM)
		{
			let v = parseInt(OCookies.getCookie(varName + ind));
			if(v !== v) v = 0;
			Course.oState[varName][ind] = v;
		}

		return Course.oState[varName][ind];
	}
};
