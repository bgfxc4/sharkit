var text_size = 32

var cursor_pos = {
	x: 0,
	y: 0
}

const MODES = {
	NORMAL: 1,
	INSERT: 2
}

var mode = MODES.NORMAL

var text_storage = [
	"1. line",
	"2.line",
	"asdasd"
]

function setup() {
	createCanvas(windowWidth, windowHeight)
	frameRate(60)
}

function windowResized() {
	createCanvas(windowWidth, windowHeight)
}

function draw() {
	background(0)
	textSize(text_size)
	textFont("monospace")
	
	render_text()
	render_cursor()
}

function render_text() {
	fill(255)
	for (var i in text_storage) {
		text(text_storage[i], text_size, i * text_size + text_size)
	}
}

function render_cursor() {
	if (mode == MODES.NORMAL) {
		fill(255)
		rect(textWidth(text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + text_size, cursor_pos.y * text_size, textWidth(text_storage[cursor_pos.y][cursor_pos.x]), text_size * 1.15)
		fill(0)
		text(text_storage[cursor_pos.y][cursor_pos.x], textWidth(text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + text_size, cursor_pos.y * text_size + text_size)
	}
}


function keyPressed() {
	if (mode == MODES.NORMAL) {
		if (keyIsDown(LEFT_ARROW)) { // move cursor
			if (cursor_pos.x > 0) cursor_pos.x--
		} else if (keyIsDown(RIGHT_ARROW)) {
			if (text_storage[cursor_pos.y][cursor_pos.x + 1] != undefined) cursor_pos.x++
		} else if (keyIsDown(DOWN_ARROW)) {
			if (text_storage[cursor_pos.y + 1] != undefined) {
				if (text_storage[cursor_pos.y + 1][cursor_pos.x] == undefined) cursor_pos.x = text_storage[cursor_pos.y + 1].length - 1
				cursor_pos.y++
			}
		} else if (keyIsDown(UP_ARROW)) {
			if (cursor_pos.y > 0) cursor_pos.y--
		}
	}
}
