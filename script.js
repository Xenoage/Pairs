//(c) 2014 Andreas Wenger, Xenoage Software
//released under the GPL license
//www.xenoage.com

//cards: all unknown at the beginning
var vals = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var opened = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var openedCard1X = -1;
var openedCard1Y = -1;
var openedCard2X = -1;
var openedCard2Y = -1;
var lastRoundSuccessful = false;
var solvedCount = 0;
//fixed order to discover. -x and +x belong together. 8/-8 is the last to discover.
var order = [1, 2, 3, -2, 4, 5, -4, -1, -5, 6, 7, -6, -3, -7, 8, -8];
var next = 0;

$(function() {

	//random rotation for cards
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			rotateCard($('#card' + x + y));
		}
	}
	
	//listen for clicks
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			$('#card' + x + y).click(function(event) {
				clicked(parseInt(event.target.id.charAt(4)), parseInt(event.target.id.charAt(5)));
			});
		}
	}
});

function clicked(x, y) {
	//if two cards where opened, close them
	if (openedCard2X != -1) {
		if (false == lastRoundSuccessful) {
			hideCard(openedCard1X, openedCard1Y);
			hideCard(openedCard2X, openedCard2Y);
		}
		hideGlow(openedCard1X, openedCard1Y);
		hideGlow(openedCard2X, openedCard2Y);
		openedCard1X = openedCard1Y = openedCard2X = openedCard2Y = -1;
	}
	//if card is not opened yet, open it
	else if (opened[x][y] == 0) {
		opened[x][y] = 1;
		var card = $('#card' + x + y);
		//card still unknown? then get next value
		if (vals[x][y] == 0) {
			vals[x][y] = order[next];
			next++;
		}
		card.css("background-image", "url('img/card" + vals[x][y] + ".png')");
		rotateCard(card);
		card.addClass("glow");
		//opened first or second card?
		if (openedCard1X == -1) {
			openedCard1X = x;
			openedCard1Y = y;
		}
		else {
			openedCard2X = x;
			openedCard2Y = y;
			//cards belong together? then leave them open
			if (vals[openedCard1X][openedCard1Y] + vals[openedCard2X][openedCard2Y] == 0) {
				solvedCount++;
				lastRoundSuccessful = true;
				//sound: success
				//new Audio("sound/win" + (rand(2) + 1) + ".mp3").play();
			}
			else {
				lastRoundSuccessful = false;
				//sound: fail
				//new Audio("sound/fail" + (rand(6) + 1) + ".mp3").play();
			}
		}
	}
}

function rotateCard(card) {
	var rotate = ["rotateM5", "rotateM2", "", "rotate2", "rotate5"];
	rotate.forEach(function(r) {
		card.removeClass(r);
	});
	card.addClass(rotate[rand(rotate.length)]);
}

function hideCard(x, y) {
	opened[x][y] = 0;
	var card = $('#card' + x + y);
	card.css("background-image", "url('img/card-back.png')");
	rotateCard(card);
}

function hideGlow(x, y) {
	var card = $('#card' + x + y);
	card.removeClass("glow");
}

function rand(count) {
	return Math.floor(Math.random() * count);
}