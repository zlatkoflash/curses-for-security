var Exam = {
	page: '#lesson51',
	nPage: 51,
	nQuestion: 1, //curr question 1...5
	exam: [], //Initial exam - curr_exam = [...]
	curr_exam: [], //curr array
	isFeedback: true, //false - disable feedback
	result: 0, //% result
	isShowResults: true, //show results after exam

	ini: function()
	{
		Exam.enableBack(true);
		Exam.showNextLes(false);
		Exam.showNextQ(false);
		Exam.showSubmit(true);
		$(Exam.page + ' .col-block-exam').css('display','block');
		$(Exam.page + ' .col-block-exam-results').css('display','none');

		Exam.initQ(); //load questions to Exam.curr_exam

		$(Exam.page + ' .block-feedback').css('display','none');

		//start 1st question
		Exam.nQuestion = 1;
		Exam.result = 0;
		Exam.loadQuestion();
	},

	initQ: function()
	{
		if(Exam.exam[0].randQ)
		{
			var i,n;
			for(i=0; i<Exam.exam.length; i++)
			{
				Exam.exam[i].usedQ = 0;
				Exam.exam[i].nQ = parseInt(i)+1;
			}

			Exam.curr_exam = [];
			for(i=0; i<Exam.exam[0].countQ; i++)
			{
				n = Exam.randQ();
				Exam.curr_exam.push(Exam.exam[n]);
			}
			Exam.curr_exam[0].showResults = Exam.exam[0].showResults;
			Exam.curr_exam[0].skipExam = Exam.exam[0].skipExam;
			Exam.curr_exam[0].randQ = Exam.exam[0].randQ;
			Exam.curr_exam[0].countQ = Exam.exam[0].countQ;
		}
		else //all questions
		{
			var i,n;
			for(i=0; i<Exam.exam.length; i++)
			{
				Exam.exam[i].usedQ = 0;
				Exam.exam[i].nQ = parseInt(i)+1;
			}

			Exam.curr_exam = Exam.exam;
		}

		$(Exam.page + ' .top-info span.cnt').html(Exam.curr_exam.length);
	},

	randQ: function()
	{
		var i;
		for(i=0; i<1000; i++)
		{
			var n = Math.floor(Math.random() * Exam.exam.length);
			if(n >= Exam.exam.length) continue;

			if(Exam.exam[n].usedQ == 0)
			{
				Exam.exam[n].usedQ = 1;
				return n;
			}
		}

		return 0;
	},
	
	enableBack: function(mode)
	{
		if(mode)
		{
			$(Exam.page + ' .bot-buttons button.but-prev')
				.prop('disabled',false);
		}
		else
		{
			$(Exam.page + ' .bot-buttons button.but-prev')
				.prop('disabled',true);
		}
	},

	enableSubmit: function(mode)
	{
		if(mode)
		{
			$(Exam.page + ' .bot-buttons button.but-submit')
				.prop('disabled',false);
		}
		else
		{
			$(Exam.page + ' .bot-buttons button.but-submit')
				.prop('disabled',true);
		}
	},

	enableNextQ: function(mode)
	{
		if(mode)
		{
			$(Exam.page + ' .bot-buttons button.but-next-q')
				.prop('disabled',false);
		}
		else
		{
			$(Exam.page + ' .bot-buttons button.but-next-q')
				.prop('disabled',true);
		}
	},

	//show Next Lesson button
	showNextLes: function(mode)
	{
		if(mode)
		{
			$(Exam.page + ' .bot-buttons button.but-next-lesson').css('display', 'inline-block');
		}
		else
		{
			$(Exam.page + ' .bot-buttons button.but-next-lesson').css('display', 'none');
		}
	},

	//show submit button
	showSubmit: function(mode)
	{
		if(mode)
		{
			$(Exam.page + ' .bot-buttons .col-but-submit').show();
			$(Exam.page + ' .bot-buttons button.but-submit').show();
		}
		else
		{
			$(Exam.page + ' .bot-buttons .col-but-submit').hide();
			$(Exam.page + ' .bot-buttons button.but-submit').hide();
		}
	},

	//show next question button
	showNextQ: function(mode)
	{
		if(mode)
		{
			$(Exam.page + ' .bot-buttons .col-but-next-q').show();
			$(Exam.page + ' .bot-buttons button.but-next-q').show();
		}
		else
		{
			$(Exam.page + ' .bot-buttons .col-but-next-q').hide();
			$(Exam.page + ' .bot-buttons button.but-next-q').hide();
		}
	},

	loadQuestion: function()
	{
		Exam.enableSubmit(false); //disable button "Submit answer"
		Exam.showSubmit(true);
		Exam.enableNextQ(false); //disable button "Next Question"
		Exam.showNextQ(false);

		$(Exam.page + ' .block-answers').css('pointer-events','auto');

		var n = Exam.nQuestion-1;
		if(Exam.curr_exam.length <= n) return false; //end of exam

		var q = Exam.curr_exam[n];

		if(q.type == 'check')
		{
			$(Exam.page + ' .block-answers .answer').addClass('type-check').removeClass('type-radio');
		}
		else //'radio'
		{
			$(Exam.page + ' .block-answers .answer').removeClass('type-check').addClass('type-radio');
		}

		$(Exam.page + ' .top-info span.n').html(Exam.nQuestion);

		$(Exam.page + ' .top-info .question').html(q.question);
		$(Exam.page + ' .block-question .question2').html(q.question2);
		
		let sRem = "";
		if(q.remark != "") sRem = '<br>'+q.remark;
		$(Exam.page + ' .block-feedback .feedback-text').html('<br>'+q.remark);
		
		$(Exam.page + ' .block-feedback').css('display','none');

		var s = Exam.page + ' .block-answers';
		var ians;
		$(s + ' .answer').removeClass('last');
		for(ians=1; ians<=6; ians++) //6 answers max
		{
			if(q.answers.length >= ians)
			{
				$(s + ' .answer-' + ians).show();
				$(s + ' .answer-' + ians + ' .answer-text').html(q.answers[ians-1]);
			}
			else
			{
				$(s + ' .answer-' + ians).hide();
			}

			if(ians == q.answers.length) $(s + ' .answer-' + ians).addClass('last');
		}

		//uncheck all answers
		$(s + ' .answer').removeClass('checked answered correct incorrect');
		return true;
	},

	selAnswer: function(nAns) //1...6
	{
		//console.log("selAnswer",nAns);
		var ians;
		var s = Exam.page + ' .block-answers';
		
		var n = Exam.nQuestion-1;
		if(Exam.curr_exam.length <= n) return false; //end of exam

		var q = Exam.curr_exam[n];
		if(q.type == 'radio')
		{
			for(ians=1; ians<=6; ians++)
			{
				if(ians == nAns)
				{
					$(s + ' .answer-' + ians).addClass('checked');
				}
				else
				{
					$(s + ' .answer-' + ians).removeClass('checked');
				}
			}
		}
		else //type = 'checked'
		{
			for(ians=1; ians<=6; ians++)
			{
				if(ians == nAns)
				{
					var ans = $(s + ' .answer-' + ians);
					if(ans.hasClass('checked'))
					{
						ans.removeClass('checked');
					}
					else
					{
						ans.addClass('checked');
					}
				}
			}
		}

		//enable button "SUBMIT"
		Exam.enableSubmit(true);
	},

	submitAnswer: function()
	{
		var n = Exam.nQuestion-1;
		var q = Exam.curr_exam[n];

		var ians;
		var s = Exam.page + ' .block-answers .answer-';

		var mask = 1;
		var code = 0;
		for(ians=1; ians<=6; ians++)
		{
			if($(s + ians).hasClass('checked'))
			{
				code += mask;
			}
			mask <<= 1;
		}
		console.log("answer=",code);

		//disable answers
		$(Exam.page + ' .block-answers').css('pointer-events','none');

		//is correct?
		var userAnswerN = Exam.curr_exam[n].nQ;
		if(Exam.isFeedback)
			$(Exam.page + ' .block-feedback').css('display', 'block');

		if(code == q.answer)
		{
			//call Lesson51.examAnswer
			window['Lesson' + Exam.nPage].examAnswer(userAnswerN,true);

			Exam.curr_exam[n].user_result = 1;
			Exam.setFeedback(true);

			Exam.result += 100/Exam.curr_exam.length;
		}
		else
		{
			//call Lesson51.examAnswer
			window['Lesson' + Exam.nPage].examAnswer(userAnswerN,false);

			Exam.curr_exam[n].user_result = 0;
			Exam.setFeedback(false);
		}

		//set results: correct or incorrect
		//s = '#lesson60 .block-answers .answer-';
		if(Exam.curr_exam[0].showResults) //if display of results is allowed
		{
			var mcode = 0;
			for(ians=1; ians<=6; ians++)
			{
				switch(ians)
				{
					case 1: mcode = 1; break;
					case 2: mcode = 2; break;
					case 3: mcode = 4; break;
					case 4: mcode = 8; break;
					case 5: mcode = 16; break;
					case 6: mcode = 32; break;
				}
				
				if($(s + ians).hasClass('checked')) //answered
				{
					$(s + ians).addClass('answered');
				}

				if(q.answer & mcode) //correct answer
				{
					$(s + ians).addClass('correct');
				}
				else
				{
					$(s + ians).addClass('incorrect');
				}
			}

			//scroll down
			window.scrollTo(0, document.body.scrollHeight);
		}
		else //display of results is not allowed
		{
			Exam.nextQuestion();
		}
	},

	setFeedback: function(mode) //true-correct answer
	{
		//if display of results is not allowed then skip
		if(!Exam.curr_exam[0].showResults) return;

		if(!Exam.isFeedback) return;

		if(mode) //correct answer
		{
			$(Exam.page + ' .block-feedback .feedback-icon img.i-correct').show();
			$(Exam.page + ' .block-feedback .feedback-icon img.i-incorrect').hide();
				
			$(Exam.page + ' .block-feedback .label-correct').show();
			$(Exam.page + ' .block-feedback .label-incorrect').hide();
		}
		else
		{
			$(Exam.page + ' .block-feedback .feedback-icon img.i-correct').hide();
			$(Exam.page + ' .block-feedback .feedback-icon img.i-incorrect').show();

			$(Exam.page + ' .block-feedback .label-correct').hide();
			$(Exam.page + ' .block-feedback .label-incorrect').show();
		}

		Exam.enableSubmit(false);
		Exam.showSubmit(false);
		Exam.enableNextQ(true);
		Exam.showNextQ(true);
	},

	nextQuestion: function()
	{
		Exam.nQuestion++;
		if(!Exam.loadQuestion())
		{
			//end of exam
			//call Lesson51.examEnd
			window['Lesson' + Exam.nPage].examEnd();
			Exam.showResult();
		}
	},

	showResult: function()
	{
		Exam.showNextLes(true);

		if(!Exam.isShowResults) //do not show results
		{
			return;
		}

		if(Exam.curr_exam.length < 1) return false;

		var n;
		var tbl = $(Exam.page + ' .col-block-exam-results table tbody');
		tbl.html("");
		var nresults = 0;

		for(n=0; n<Exam.curr_exam.length; n++)
		{
			var q = Exam.curr_exam[n];

			var tr;
			var nq = parseInt(n)+1;
			//question
			tr = '<tr><td class="q">Q:&nbsp;</td><td class="question"><strong>' + nq + ' '+ q.question + '</strong>:<br>' + q.question2 + '</td></tr>';
			tbl.append(tr);

			//answer
			var ians=0;
			switch(q.answer)
			{
				case 1: ians=0; break;
				case 2: ians=1; break;
				case 4: ians=2; break;
				case 8: ians=3; break;
				case 16: ians=4; break;
			}

			var user_result = "bad";
			if(q.user_result > 0) { user_result = "good"; nresults++; }

			tr = '<tr><td class="a ' + user_result + '">A:&nbsp;</td><td class="answer">' + q.answers[ians] + '</td></tr>';
			tbl.append(tr);

			//comments
			tr = '<tr class="rem"><td></td><td class="rem">' + q.remark + '</td></tr>';
			tbl.append(tr);
		}

		$(Exam.page + ' .col-block-exam-results h3 span.l').html(nresults);
		$(Exam.page + ' .col-block-exam-results h3 span.r').html(Exam.curr_exam.length);

		$(Exam.page + ' .col-block-exam').css('display','none');
		$(Exam.page + ' .col-block-exam-results').css('display','block');
	}
};
