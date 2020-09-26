/*
* Experows - Demo of some JavaScript APIs
* Written in 2020 by Keian Rao <keian.rao@gmail.com>
* 
* To the extent possible under law, the author has dedicated 
* all copyright and related and neighboring rights to this software to
* the public domain worldwide. 
* 
* This software is distributed without any warranty.
* 
* You should have received a copy of the CC0 Public Domain Dedication
* along with this software. If not,
* see <http://creativecommons.org/publicdomain/zero/1.0/>.
*/

const rows = document.getElementsByClassName("row");
const inpageConsole = document.getElementById("inpage-console");

inpageConsole.innerText = "JavaScript now running on this page.\n"
inpageConsole.println = (line) => inpageConsole.innerText += line + "\n";

enableRow1().catch(error => inpageConsole.println(error));
enableRow2().catch(error => inpageConsole.println(error));


//  \\  //  \\  //  \\  //  \\  //  \\  //  \\  //  \\


async function enableRow1() {
	const goodButton = document.getElementById("1-good");
	const errorButton = document.getElementById("1-error");
	const rowConsole = document.getElementById("1-console");
	rowConsole.innerText = "Setting up..";

	goodButton.onclick = function () {
		Promise.resolve("Good button!")
			.then(value => rowConsole.innerText = "Success: " + value)
			.catch(error => rowConsole.innerText = "Error: " + error);
	};
	errorButton.onclick = function () {
		Promise.reject("Error button!")
			.then(value => rowConsole.innerText = "Success: " + value)
			.catch(error => rowConsole.innerText = "Error: " + error);
	};

	rowConsole.innerText += " Done.\n";
}


async function enableRow2() {
	/*
	* Canonical image link:
	* "https://commons.wikimedia.org/wiki/File:AD2009Sep20_Amanita_muscaria_02.jpg"
	* 'Amanita muscaria', 'fly agaric', a poisonous mushroom. 
	* Picture by Bernie Kohl.
	*/
	const IMAGE_URL = 
		"https://upload.wikimedia.org/wikipedia/commons/" +
		"thumb/8/8c/AD2009Sep20_Amanita_muscaria_02.jpg/" +
		"320px-AD2009Sep20_Amanita_muscaria_02.jpg";
	const IMAGE_ALT =
		"Picture of a mushroom, with a white stem \n" +
		"and a white-spotted orange cap. Surrounding \n" +
		"it and to the background are forest foliage.\n";
	const rowConsole = document.getElementById("2-console");
	const imageReq = new XMLHttpRequest();

	rowConsole.innerText = "Preparing XMLHttpRequest.\n";
	
	// Set request properties..
	imageReq.timeout = 30000;
	rowConsole.innerText += "Timeout set to " + imageReq.timeout + " milliseconds.\n";
	imageReq.responseType = "blob";

	// Add listeners for responses..
	rowConsole.innerText += "Installing listeners..\n";
	imageReq.onload = function () {
		// Validate and report on the response.
		if (imageReq.response == null) {
			rowConsole.innerText += "Response came back, with no image data..\n";
			return;
		}
		rowConsole.innerText += "Received image data from request.\n";
		if (!(imageReq.response instanceof Blob)) {
			rowConsole.innerText += "..Which was not of the correct data type.\n";
			return;
		}

		// Try to paint the response on the canvas.
		createImageBitmap(imageReq.response)
			.then(function (imageBitmap) {
				const canvas = document.getElementById("2-output");
				const canvasAlt = document.getElementById("2-output-alt");
				rowConsole.innerText += "Drawing image..";
				const paintContext2D = canvas.getContext('2d');
				paintContext2D.drawImage(imageBitmap, 0, 0);
				canvasAlt.innerText = IMAGE_ALT;
				rowConsole.innerText += " Done.\n";
				canvas.style.setProperty("border-style", "solid");
			})
			.catch(function (error) {
				rowConsole.innerText += 
					"Failed to create drawable bitmap from image data.\n";
				return;
			});
	};
	imageReq.ontimeout = function () {
		rowConsole.innerText += "Request timed out.";
	};

	// Send the request.
	rowConsole.innerText += "Sending request..";
	imageReq.open("GET", IMAGE_URL);
	/*
	* Considering we are in an async function, my *guess* is that it would be okay to
	* use a synchronous XMLHttpRequest (set third argument to #open as 'true').
	* Even though MDN says you should only do so within a Web Worker.
	* I'm not going to perform an experiment about that here, let's just be safe.
	* Use async.
	*/
	imageReq.send();
	rowConsole.innerText += " Done.\n\n";
}

