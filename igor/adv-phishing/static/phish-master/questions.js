var phishMasterQuest = [
	{
		question: "What is phishing?",
		answers: [
			"Phishing is a fraudulent attempt, usually made through email, to steal your personal information.",
			"Phishing is the act of catching fish in a variety of ways.",
			"Phishing is used methodology used by the police to profile offenders.",
			"Phishing is an Asian martial art technique."
 
		],
		answer: 0	//0-1st ans, 1-2nd...
	},
	{
		question: "The most common method(s) for a phishing attempt would be by ...?",
		answers: [
			"Book",
			"E-mail",
			"Mp3 File",
			"Neighbor"
		],
		answer: 1
	},
	{
		question: "What is the best way to prevent the success of a phishing attack?",
		answers: [
			"Ignore the phishing message (e.g. email).",
			"Report the phishing scam to the police.",
			"Destroy your computer.",
			"Only open attachments rather than exposing personal data."
		],
		answer: 0
	},
	{
		question: "Do criminals manage to send phishing emails to you?",
		answers: [
			"No – the company mail account is secure and phishing emails are filtered by our Anti-SPAM solution.",
			"Yes – occasionally phishing emails don’t get filtered.",
			"Yes – but it doesn’t matter as my antivirus would block the phishing attack anyway.",
			"No – because they do not know my email address."
		],
		answer: 1
	},
	{
		question: "You receive an email that notifies you about a pending invoice. Attached is an executable file (invoice.exe). What will you do?",
		answers: [
			"I will open the file to check if the invoice is really overdue.",
			"Opening a file with that extension is probably a phishing scam – so I delete the message.",
			"It might be a legitimate invoice, but to be on the safe side, I scan the file with my antivirus before opening.",
			"I send back an email with my credit card number so they can pay the invoice directly."
		],
		answer: 1
	},
	{
		answer: 0,
		answers: [
			"I don’t click on the link. Instead, I manually type in the company’s website and log in with my credentials to update the data.",
			"All emails that ask users to update some information are a scam.",
			"I click on the link as I already know the company.",
			"I open the link on my mobile phone to be on the safe side."
		],
		question: "A trusted company asks you to update your account information by clicking on a link. What will you do?"
	},
	{
		answer: 3,
		answers: [
			"doc (Word Doc) & exe (Executable)",
			"txt (Text File), jpg (Image), pdf (Portable Document Format) ",
			"docm (Word Doc with Macro)",
			"None of the above"
		],
		question: "The following email attachments can be considered safe if you are using patched (up-to-date) applications:"
	},
	{
		answer: 1,
		answers: [
			"Yes – if the sender email is exactly the same as the person I know.",
			"Maybe – but there is also a chance that someone spoofed (impersonated) the sender address.",
			"No – because word documents always contain a macro virus.",
			"None of the above."
		],
		question: "You receive an email from a person you know asking you to open a word document. Is this safe?"
	},
	{
		answer: 2,
		answers: [
			"My username & password might get stolen.",
			"If a clicked on a file, the attacker might now have access to my computer.",
			"Both A and B.",
			"The criminal knows my email address."
		],
		question: "What is the worst that might happen when a criminal performs a successful phishing attack?"
	},
	{
		answer: 2,
		answers: [
			"This is normal as SSL error warnings happen all the time when surfing the Internet.",
			"The SSL warning indicates that the company uses a secure connection, but my browser version is probably outdated.",
			"This warning might be an indication that an attacker has created a phishing website to lure me into exposing my login credentials.",
			"The SSL warning means that my PC is not trustworthy."
		],
		question: "You log into your bank website using a link provided in an email. An SSL error warning displays in your browser, notifying you that the issuer cannot be trusted. What might be the cause?",
		image: "ssl-secure.png"
	}
];
