fin_exam1 = [
	{
		showResults: 1,
		skipExam: 0,
		randQ: 1,
		countQ: 5,

		//1
		question: "Phishing",
		question2: "What is phishing?",
		answer: 1, //1-first, 2-second, 4-third, 8-fourth
		type: 'radio',
		answers:
		[
			"Phishing is a fraudulent attempt, usually made through email, to steal your personal information.",
			"Phishing is the act of catching fish in a variety of ways.",
			"Phishing is used methodology used by the police to profile offenders.",
			"Phishing is an Asian martial art technique."
		],
		remark:
			"Phishing is a cybercrime in which one or more targets are contacted via email, "+
			"telephone, or text message by someone posing as a legitimate institution. Their purpose is to lure "+ 
			"individuals into providing sensitive data such as personally identifiable "+ 
			"information, banking and credit card details, and passwords."
	},

	{
		//2
		question: "Malware",
		question2: "You receive an email that notifies you about a pending invoice. Attached is an executable file (invoice.exe). What will you do?",
		answer: 2,
		type: 'radio',
		answers:
		[
			"I will open the file to check if the invoice is really overdue.",
			"Opening a file with that extension is probably a phishing scam – so I delete the message.",
			"It might be a legitimate invoice, but to be on the safe side, I scan the file with my antivirus before opening.",
			"I send back an email with my credit card number so they can pay the invoice directly.",
		],
		remark:
			"An .exe file is potentially dangerous because it's a program that "+ 
			"can do anything (within the limits of Windows' User Account Control "+ 
			"feature). If you open a file with a potentially harmful extension, your "+
			"computer could, without your continued permission, run one or more "+
			"operations programmed into that file. Media files, like .JPEG (images) and "+ 
			".MP3 (music), are not dangerous because they can't contain code. (There "+ 
			"have been some cases where a maliciously crafted image or other media file " +
			"can exploit a vulnerability in a viewer application, but these issues are rare and are patched quickly.)"
	},

	{
		//3
		question: "Dangerous File Types",
		question2: "The following File Types can be considered safe to open from an untrusted location if you are using patched (up-to-date) applications:",
		answer: 8,
		type: 'radio',
		answers:
		[
			"doc (Word Doc) & exe (Executable)",
			"txt (Text File), jpg (Image), pdf (Portable Document Format)",
			"docm (Word Doc with Macro)",
			"None of the above",
		],
		remark: 
			"You can tell if a file type is safe by assessing its file " +
			"extension – the three or four letters that follow the period at " +
			"the end of the file name. Microsoft has classified several types of " +
			"dangerous extensions; among the few considered safe are GIF, JPG or JPEG, "+
			"TIF or TIFF, TXT, PDF, MPG or MPEG, MP3, and WAV. These extensions represent " +
			"different file types and comprise the formats that the majority of Internet users "+ 
			"tend to send as email attachments. When it comes to security, the PDF file format "+ 
			"offers a wide range of benefits over the standard Word Processing formats. " +
			"For instance, an attacker can link a dangerous file within a PDF, but the user must "+ 
			"open it manually for it to become a threat."
	},

	{
		//4
		question: "Surfing via public network",
		question2: "You log into your trusted bank website using a public Wi-Fi. You notice an SSL error warning in your browser that notifies you that the issuer cannot be trusted. What might be the cause? An SSL error warning displays in your browser, notifying you that the issuer cannot be trusted. What might be the cause?",
		answer: 4,
		type: 'radio',
		answers:
		[
			"This is normal as SSL error warnings happen all the time when surfing the Internet.",
			"The SSL warning in the browser indicates that the company uses a secure connection, but my browser version is probably outdated.",
			"This warning might be an indication that an attacker has started a man-in-the-middle attack and is intercepting my connection to my bank’s website.",
			"The SSL warning means that my PC is not trustworthy.",
		],
		remark: 
			"A man-in-the-middle attack occurs when a hacker intercepts the connection "+ 
			"between a website server and a user’s browser, impersonating each of them " +
			"when communicating with the other. Thus, although the browser 'thinks' it has " +
			"established an encrypted connection with the server, both systems are actually " + 
			"communicating with the attacker. However, since the attacker cannot decrypt the " +
			"data, the end user will see a certificate error."
	},
/*
	{
		//5
		question: "Passwords",
		question2: "You are asked to choose a secure password. Which one can be considered as secure?",
		answer: 8,
		type: 'radio',
		answers:
		[
			"Formula1000",
			"JunApp2018",
			"1234567890",
			"G&s2Pb3x!14"
		],
		remark: "For almost every account that you make online, you are " +
			"required to make a secure password. Don't use a word or phrase of special " +
			"importance to you like a birthday or family member. That's the kind of " +
			"information that can be discovered by someone doing a little digging. It " +
			"should be at least eight-to-10 characters long and use at least one capital " +
			"letter and one lowercase letter.<br>" +
			"Tip: Create a sentence or phrase as the " +
			"basis for your password. Example: If your children are Jessie, Cassey, " +
			"Michael and Jenny, your base word might be &quot;jecamije&quot; - the first " +
			"two letters of each name combined. If your first house was on Spooner Street, " +
			"a base word might be &quot;houseonspooner&quot;. So you could add an underscore " +
			"(or other random punctuation) and numbers to create &quot;jecamije_&quot;. Or " +
			"you can add a symbol to the word to make &quot;houseonspooner#1500&quot;"
	},
*/
	{
		//6
		question: "Share sensitive information",
		question2: "It's okay to share passwords with:",
		answer: 8,
		type: 'radio',
		answers:
		[
			"Your boss",
			"The hotel manager",
			"Your coworker",
			"None of the above",
		],
		remark:
			"If you share your password with anyone, not only is it a "+ 
			"policy violation, but you also expose yourself and the company to "+ 
			"significant risk. Think of your password as you would your signature. Sharing it "+ 
			"with someone is like giving that person authority to sign your " +
			"name, implying you approve of everything they do in your name.<br/> "+
			"You are the only person responsible for all activities performed with your "+ 
			"password."

	},

/*
	{
		//7
		question: "Traveling",
		question2: "How can you help protect data when you're on the road?",
		answer: 8,
		type: 'radio',
		answers:
		[
			"Lock your laptop and mobile phone with strong passwords and PINs.",
			"Encrypt sensitive data on all smartphones, laptops, flash drives, and other portable devices.",
			"Make sure the public Wi-Fi connection encrypts data.",
			"All of the above.",
		],
		remark: "The new working professional is always connected, and " +
			"increasingly, the office is Starbucks, an airport, or home. With new " +
			"flexibility comes new IT security risks for businesses. Basic defenses like " +
			"antivirus are important, but not enough to keep corporate data from the " +
			"increasingly sophisticated hacker. As mobile devices extend the boundary of " +
			"the corporate network, ensuring confidentiality, integrity and availability " +
			"of the data that the devices access, process and store is a constant " +
			"challenge."
	},
*/
	{
		//8
		question: "Updates",
		question2: "If you've installed all the security updates required by your system administrator and have an active antivirus software running, do you still have to worry about viruses when you click links or open attachments in messages or downloads?",
		answer: 4,
		type: 'radio',
		answers:
		[
			"No, the antivirus protects me.",
			"It depends on the quality of the antivirus software.",
			"Yes, because an antivirus software cannot catch all malicious files.",
			"As long as I don’t install any software, there is no risk in opening attachments.",
		],
		remark: 
			"Antivirus programs protect you from classic dangers like known "+
			"viruses, Trojans, and worms – 'known' being the operative word here. Without "+
			"a signature database for detection, an antivirus will not be able to protect "+ 
			"your system against threats. Also, most antivirus programs are reactive. In "+ 
			"fact, a study by Panda Research has found that a typical antivirus will stop "+ 
			"only 30–50% of new malware when it first appears."
	},

	{
		//9
		question: "Human interaction",
		question2: "A woman claiming to be calling from the information technology help desk tells you that there is a problem with your system access. She asks for your username and password. What type of attempted fraud is this?",
		answer: 1,
		type: 'radio',
		answers:
		[
			"Social engineering",
			"Shoulder surfing",
			"Unauthorized physical access",
			"Eavesdropping",
		],
		remark: "At its simplest, social engineering means getting " +
			"someone to do something you want, or give you information you want, often " +
			"without the person considering the negative consequences of the action.<br>" +
			"Since humans interact with computers and since humans can be " +
			"manipulated they are often a company or organization's weak link."
	},

	{
		//10
		question: "Incidents",
		question2: "What should you do if you witness a situation that compromises the security of sensitive information?",
		answer: 2,
		type: 'radio',
		answers:
		[
			"Confront the person involved to find out their intentions.",
			"Report the situation using our incident reporting procedures.",
			"Nothing. It's not your responsibility.",
			"Check on the situation in a few days to make sure it's actually an incident before doing anything.",
		],
		remark:
			"A computer security incident is any attempted or successful " +
			"unauthorized access, disclosure, or misuse of computing systems, data, or " + 
			"networks, including hacking and theft. Immediately report suspected security " +
			"incidents and breaches to your supervisor and the Support Center. Be sure to " +
			"indicate whether sensitive information may be at risk. A quickly reported " +
			"incident can allow specialized staff to stop and resolve an on-going " +
			"data breach before consequences escalate."
	}
];


fin_exam2 = [
/*
	{
		//1
		file: "ph1.html",
		page: ".quiz-ph1", //class for the page
		question: "The following screen shows an e-mail Max received at his e-mail address max@sample.com.",
		question2: "Which part of this email clearly characterizes it as a phishing message?",
		answer: 2,
		answers:
		[
			"Logo",
			"Destination address of the «View notifications» link",
			"E-mail address of the sender",
			"E-mail address of the recipient"
		],
	},

	{
		//2
		file: "ph2.html",
		page: ".quiz-ph2",
		question: "Max has ended up on the website shown below.",
		question2: "Based on which characteristics can he determine that he is not actually on an official website of a company called PostFinance?",
		answer: 5,
		answers:
		[
			"The web address (URL) in the address line.",
			"Because financial sites don’t usually require logging in.", //"PostFinance Logo",
			//"Missing «https://» in the address line.",
			"Missing lock symbol in the address bar.",
			"The design and colors appear to be made by a hacker." //"Colour scheme"
		],
	},

	{
		//3
		file: "ph3.html",
		page: ".quiz-ph3",
		question:
			"The following image shows an e-mail received by Erika Meier at her " +
			"e-mail address erika.meier@company.com. However, " +
			"Erica Meier does not know Wendy Perez and has not requested any documents from this person.",
		question2: "Is it safe to open the attachment to this e-mail?",
		answer: 2,
		answers:
		[
			"Yes",
			"No"
		],
		remark: "Don’t trust unsolicited e-mails and never click any attachments if an e-mail looks suspicious! They often contain malware such as viruses, worms, or Trojans."
	},

	{
		//4
		file: "ph4.html",
		page: ".quiz-ph4",
		question: "The image shows an e-mail Max received at his e-mail address max@company.com.",
		question2: "Which characteristics expose this e-mail as a phishing message?",
		answer: 4,
		answers:
		[
			"Personal form of address",
			"Spelling and grammar",
			"Destination address of the link and email sender domain"
		],
	},

	{
		//5
		file: "ph5.html",
		page: ".quiz-ph5",
		question: 'While web surfing, Erika Meier came across the website in the image below. UBS is an international bank with the domain "ubs.com".',
		question2: "Do you think this image shows the original UBS log-in page?",
		answer: 1,
		answers:
		[
			"Yes",
			"No",
		],
	},

	{
		//6
		file: "ph6.html",
		page: ".quiz-ph6",
		question: "The following image shows an e-mail Erika Meier received at her e-mail address Erika.meier@company.com.",
		question2: "Which parts of this email characterize it as a phishing message?",
		answer: 9,
		answers:
		[
			"Missing personal salutation",
			"Spelling and grammar",
			"Pressure exerted/threat to recipient",
			"Destination address of the «Tracking Procedure» link"
		],
	},
*/
	{
		//7
		file: "ph7.html",
		page: ".quiz-ph7",
		question: "The following image shows an e-mail Max received at his e-mail address max@company.com.",
		question2: "Which characteristics clearly identify this e-mail as coming from «Secure eBanking team»?",
		answer: 2,
		answers:
		[
			"E-mail address of the sender",
			"Digital signature",
			"File attached"
		],
		remark: "Find out from our info sheets how you can check the digital signature in Outlook, Windows Live Mail and Thunderbird."
	}
];


fin_exam3 = [
	{
		showResults: 1,
		skipExam: 0,
		randQ: 0,
		countQ: 6,

		//1
		question: "What is the domain in this URL?",
		question2: "http://h.paypal.de-checking.net/de/ID.php?u=LhsdoOKJfsjdsdvg",
		type: "radio",
		answer: 4,
		answers:
		[
			"paypal.de",
			"checking.net",
			"de-checking.net",
			"h.paypal"
		],
		remark: ""
	},

	{
		//2
		question: "What is the domain in this URL?",
		question2: "https://paypal.secure.server.de",
		type: "radio",
		answer: 2,
		answers:
		[
			"paypal.secure",
			"server.de",
			"secure.server"
		],
		remark: ""
	},

	{
		//3
		question: "What is the domain in this URL?",
		question2: "http://paypal.de@secure-server.de/secure-environment",
		type: "radio",
		answer: 8,
		answers:
		[
			"paypal.de",
			"server.de",
			"secure-environment",
			"secure-server.de"
		],
		remark: ""
	},

	{
		//4
		question: "What is the domain in this URL?",
		question2: "http://signin.paypal.com@10.19.32.4/o",
		type: "radio",
		answer: 4,
		answers:
		[
			"paypal.com",
			"signin.paypal",
			"10.19.32.4",
			"19.32.4/o"
		],
		remark: ""
	},

	{
		//5
		question: "What is the domain in this URL?",
		question2: "http://63.17.167.23/pc/verification.htm?=https://www.paypal.com/",
		type: "radio",
		answer: 8,
		answers:
		[
			"www.paypal.com",
			"https://www.paypal.com",
			"verification.htm",
			"63.17.167.23"
		],
		remark: ""
	},

	{
		//6
		question: "What is the domain in this URL?",
		question2: "http://paypal.com.de.cgi-bin.webscr.cmd-login-submit.dispatch.secure.su/cgi-bin/",
		type: "radio",
		answer: 4,
		answers:
		[
			"paypal.com",
			"dispatch.secure",
			"secure.su",
			"cgi-bin.webscr",
			"paypal.com.de"
		],
		remark: ""
	}
];
