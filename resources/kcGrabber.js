//thorou
var katable = {};
var identifier = "kimcartoon.me_DownloadData";

function KAsavetable() {
	window.name = JSON.stringify(katable);
}

function KAloadtable() {
	try { //check if string is valid JSON object
		JSON.parse(window.name);
	} catch (e) {
		return false;
	}
	katable = JSON.parse(window.name);
	if (katable.identifier === identifier) { //check if data is from this script (incase another script is using window.name)
		return true;
	}
	katable = {}; //not a JSON, abort
	return false;
}

function KAstart(startnum, endnum) {
	if (window.location.hostname != "kimcartoon.me") {
		return false;
	}
	katable = {};
	if (startnum === undefined) {
		katable.position = 0;
	} else {
		katable.position = startnum - 1;
	}
	if (endnum === undefined) {
		katable.endnum = 999;
	} else {
		katable.endnum = endnum;
	}
	katable.identifier = identifier; //not get confused with potential other data in window.name
	katable.episodeListObject = document.getElementsByClassName("listing")[0].children[0].children; //html collection of all episode list objects
	katable.linklist = []; //list for all episode links
	katable.originalpage = window.location.href; //page to return to when finished
	katable.status = "getlink"; //status string to indicate current task
	//katable.position = 0; //position in the episode selection
	//katable.endnum = 999; //array number to end at
	katable.finishedlist = []; //list of all extracted links
	for (var i = 2; i < katable.episodeListObject.length; i++) {
		katable.linklist.push(katable.episodeListObject[i].children[1].children[1].href + "&s=openload");
	}
	katable.linklist.reverse(); //kimcartoon lists episodes newest first, this reverses the list
	KAsavetable();
	window.location.href = katable.linklist[katable.position]; //goto link selection
}

function KAgetLink() {
	if (document.getElementsByClassName("title-list").length > 0 && document.getElementsByClassName("title-list")[0].innerText == "ARE YOU HUMAN?") {
		return false; // stop, execution will pick back up when captcha is solved
	}
	var re = new RegExp('"https://openload.co/embed/(.*?)"');
	var currentLink = document.body.innerHTML.match(re)[0];
	katable.finishedlist.push(currentLink.split('"')[1]);
	katable.status = "getlink";
	katable.position++;
	if (katable.position >= katable.linklist.length || katable.position >= katable.endnum) {
		katable.status = "finished";
		KAsavetable();
		window.location.href = katable.originalpage;
	} else {
		KAsavetable();
		window.location.href = katable.linklist[katable.position];
	}
}


function KAprintLinks() {
	var string = "";
	for (var i = 0; i < katable.finishedlist.length; i++) { //string together all the links, seperated by spaces
		string += katable.finishedlist[i] + " ";
	}
	console.log(string);
	string = "";
	for (var i = 0; i < katable.finishedlist.length; i++) { //string together all the links, seperated by newlines
		string += katable.finishedlist[i] + String.fromCharCode(10);
	}
	var grabberLinkDisplay = document.getElementById("grabberLinkDisplay");
	grabberLinkDisplay.innerText = string; //push the links to the display element
	if (katable.streamlinklist) {
		string = "<div id='grabberStreamLinks'>";
		for (var i = 0; i < katable.streamlinklist.length; i++) {
			string += "<a href='" + katable.streamlinklist[i] + "' download>" + katable.streamlinklist[i] + "</a><br>";
		}
		grabberLinkDisplay.innerHTML += "<hr style='border-color: #ecbe35;'><div class='bigChar'>Stream Links</div>" + string + "</div><br>";
		document.getElementById("grabberGetStreamLinks").hidden = true;
		document.getElementById("grabberDownloadAll").hidden = false;
	}
	document.getElementById("grabberLinkContainer").style.display = "block"; //make the display visible
	window.name = "";
}

function KAgetStreamLink() {
	var ev = new MouseEvent("click");
	var el = document.elementFromPoint(20, 20);
	el.dispatchEvent(ev); //simulate click
	var re = new RegExp('"/stream/(.*?)"');
	var streamLink = document.body.innerHTML.match(re)[0]; //get stream link
	streamLink = streamLink.split('"')[1]; //remove quotes
	streamLink = "https://openload.co" + streamLink;
	if (streamLink.slice(-10) == "?mime=true") {
		streamLink = streamLink.substr(0, streamLink.length - 10);
	}
	katable.streamlinklist.push(streamLink);
	katable.position++;

	if (katable.position >= katable.finishedlist.length) {
		katable.status = "finished";
		KAsavetable();
		window.location.href = katable.originalpage;
	} else {
		KAsavetable();
		window.location.href = katable.finishedlist[katable.position];
	}
}

function KAstartStreamLinks() {
	katable.streamlinklist = [];
	katable.position = 0;
	katable.status = "getstreamlink";
	KAsavetable();
	window.location = katable.finishedlist[katable.position];
}

function KAshortenLinks() {
	katable.finishedlistbackup = katable.finishedlist.slice(0);
	for (var i in katable.finishedlist) {
		katable.finishedlist[i] = katable.finishedlist[i].substr(0, 38);
	}
	KAprintLinks();
}

function KAdownloadAll(delay) {
	links = document.getElementById("grabberStreamLinks");
	for (var i = 0; i < links.children.length; i++) {
		if (links.children[i].click) {
			setTimeout(i => document.getElementById("grabberStreamLinks").children[i].click(), i * delay, i);
		}
	}
}

function KAsiteload() {
	if (KAloadtable()) { //check if data can be retrieved from window.name
		if (katable.status == "getlink") { //check which state the script is supposed to be in and call the appropriate function
			KAgetLink();
		} else if (katable.status == "getstreamlink") {
			KAgetStreamLink();
		} else if (katable.status == "finished") {
			KAprintLinks();
		}
	}
}

if (window.name !== "") {
	KAsiteload();
}