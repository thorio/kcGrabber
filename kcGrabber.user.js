// ==UserScript==
// @name					Kimcartoon Link Grabber
// @namespace			http://thorou.bitballoon.com/
// @version				1.0
// @description		gets openload links from kimcartoon.to | based on my kissanime script, check it out!
// @author				Thorou
// @homepageURL		https://github.com/thorio/kcGrabber/
// @updateURL			https://github.com/thorio/kcGrabber/raw/master/kcGrabber.user.js
// @downloadURL		https://github.com/thorio/kcGrabber/raw/master/kcGrabber.user.js
// @match					http://kimcartoon.to/*
// @match					https://openload.co/embed/*
// ==/UserScript==
//
//Copyright 2018 Leon Timm
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function() {
	'use strict';

	function inject() {
		//add UI elements
		if (window.location.href.substring(0, 29) == "http://kimcartoon.to/Cartoon/" && document.getElementsByClassName("bigBarContainer").length > 1) {
			//grabber widget
			var grabberUIBox = document.createElement("div");
			grabberUIBox.id = "grabberUIBox";
			grabberUIBox.innerHTML = optsHTML; //HTML below; grabber widget
			var rightside = document.getElementById("rightside");
			rightside.insertBefore(grabberUIBox, rightside.children[4]); //insert grabber widget into rightside container
			var episodeCount = document.getElementsByClassName("listing")[0].children[0].children.length - 2;
			document.getElementById("grabberTo").value = episodeCount; //set min and max for the episode selectors
			document.getElementById("grabberTo").max = episodeCount;
			document.getElementById("grabberFrom").max = episodeCount;

			//link display
			var grabberList = document.createElement("div");
			grabberList.innerHTML = linkListHTML; //HTML below; link output
			document.getElementById("leftside").prepend(grabberList);

			//individual grab button for each individual episode
			var listingTable = document.getElementsByClassName("listing")[0].children[0];
			var tableNum = document.createElement("th");
			tableNum.width = "3%";
			tableNum.innerText = "#";
			listingTable.children[0].prepend(tableNum);
			for (var i = 2; i < listingTable.children.length; i++) { //first two items aren't actually episodes
				var tableNum2 = document.createElement("td");
				tableNum2.innerHTML = (episodeCount - i + 2) + "&nbsp;";
				tableNum2.style.textAlign = "right";
				listingTable.children[i].prepend(tableNum2);
				var currentItem = listingTable.children[i].children[1];
				var currentEpisodeName = currentItem.children[0].innerText;
				var addedHTML = '<input type="button" value="grab" style="background-color: #ecbe35; color: #000; border: none; cursor: pointer;" onclick="KAstart(' + (episodeCount - i + 2) + ',' + (episodeCount - i + 2) + ')">&nbsp;'
				currentItem.innerHTML = addedHTML + currentItem.innerHTML;
			}
		}
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.innerHTML = grabberScript; //JS below; grabber script
		document.getElementsByTagName("head")[0].appendChild(script);
	}

	//HTML and JS pasted here because Tampermonkey apparently doesn't allow resources to be updated
	//if you have a solution for including extra files that are updated when the script is reinstalled please let me know through GitHub

	//the grabber widget injected into the page
	var optsHTML = `<span class="title-list icon">Batch Grabber</span>
	<div class="clear2">
	</div>
	<div class="rightBox">
	<div class="barContent">
		from
		<input type="number" id="grabberFrom" value=1 min=1 style="width: 40px; border: 1px solid #666666; background: #393939; padding: 3px; color: #ffffff;"> to
		<input type="number" id="grabberTo" value=1 min=1 style="width: 40px; border: 1px solid #666666; background: #393939; padding: 3px; color: #ffffff;">
		<br>
		<br>
		<div style="height: 28px;">
			<input type="button" value="Grab All" style="background-color: #ecbe35; color: #000; border: none; padding: 5px; padding-left: 12px; padding-right: 12px; margin: 3px; font-size: 15px; float: left" onclick="KAstart()">
			<input type="button" value="Grab Range" style="background-color: #ecbe35; color: #000; border: none; padding: 5px; padding-left: 12px; padding-right: 12px; margin: 3px; font-size: 15px; float: left" onclick="KAstart(document.getElementById('grabberFrom').value,document.getElementById('grabberTo').value)">
		</div>
	</div>
</div>
<div class="clear2">
</div>`

	//initially hidden HTML that is revealed and filled in by the grabber script
	var linkListHTML = `<div class="bigBarContainer" id="grabberLinkContainer" style="display: none;">
	<div class="barContent">
	<div class="bigChar">
		Extracted Links
	</div>
		<div id="grabberLinkDisplay"></div>
		<div style="height: 28px;">
			<input id="grabberGetStreamLinks" type="button" value="Get Stream Links" style="background-color: #ecbe35; color: #000; border: none; padding: 5px; padding-left: 12px; padding-right: 12px; margin: 3px; font-size: 15px; float: left" onclick="KAstartStreamLinks()">
			<input id="grabberShortenLinks" type="button" value="Shorten Links" style="background-color: #ecbe35; color: #000; border: none; padding: 5px; padding-left: 12px; padding-right: 12px; font-size: 15px; margin: 3px; float: left" onclick="KAshortenLinks()">
			<input id="grabberDownloadAll" type="button" value="Download All" style="background-color: #ecbe35; color: #000; border: none; padding: 5px; padding-left: 12px; padding-right: 12px; font-size: 15px; margin: 3px; float: left" onclick="KAdownloadAll(1000)" hidden>
		</div>
	</div>
</div>`

	//js injected into the page, this gets the links
	var grabberScript = `//thorou
var katable = {};
var identifier = "kimcartoon.to_DownloadData";

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
}`

	inject();
})();
