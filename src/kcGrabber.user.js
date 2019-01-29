// ==UserScript==
// @name					Kimcartoon Link Grabber
// @namespace			http://thorou.bitballoon.com/
// @version				1.1.2
// @description		gets openload links from kimcartoon.to | based on my kissanime script, check it out!
// @author				Thorou
// @homepageURL		https://github.com/thorio/kcGrabber/
// @updateURL			https://github.com/thorio/kcGrabber/raw/master/kcGrabber.user.js
// @downloadURL		https://github.com/thorio/kcGrabber/raw/master/kcGrabber.user.js
// @match					https://kimcartoon.to/*
// @match					https://oload.club/embed/*
// @noframes
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
		if (window.location.host == "kimcartoon.to" && window.location.pathname.substr(0, 9) == "/Cartoon/"  && $(".title-list").length > 0) {
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
	var optsHTML = `[[[[grabberOpts.html]]]]`

	//initially hidden HTML that is revealed and filled in by the grabber script
	var linkListHTML = `[[[[linkList.html]]]]`

	//js injected into the page, this gets the links
	var grabberScript = `[[[[kcGrabber.js]]]]`

	inject();
})();
