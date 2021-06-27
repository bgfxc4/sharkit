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
var is_first_press_after_mode_switch = false;

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
		rect(textWidth(text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + text_size, 
			cursor_pos.y * text_size + 0.2 * text_size,
			textWidth(text_storage[cursor_pos.y][cursor_pos.x]), text_size)
		fill(0)
		text(text_storage[cursor_pos.y][cursor_pos.x], textWidth(text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + text_size, cursor_pos.y * text_size + text_size)
	} else if (mode == MODES.INSERT) {
		fill(255)
		rect(textWidth(text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + text_size, 
			cursor_pos.y * text_size + 0.2 * text_size,
			2, text_size)
	}
}

function switch_mode(mode_to_switch_to) {
	mode = mode_to_switch_to
	is_first_press_after_mode_switch = true
}

function keyPressed() {
	if (mode == MODES.NORMAL) {
		if (keyCode == LEFT_ARROW) { // move cursor
			if (cursor_pos.x > 0) cursor_pos.x--
		} else if (keyCode == RIGHT_ARROW) {
			if (text_storage[cursor_pos.y][cursor_pos.x + 1] != undefined) cursor_pos.x++
		} else if (keyCode == DOWN_ARROW) {
			if (text_storage[cursor_pos.y + 1] != undefined) {
				if (text_storage[cursor_pos.y + 1][cursor_pos.x] == undefined) cursor_pos.x = text_storage[cursor_pos.y + 1].length - 1
				cursor_pos.y++
			}
		} else if (keyCode == UP_ARROW) {
			if (cursor_pos.y > 0) {
				if (text_storage[cursor_pos.y - 1][cursor_pos.x] == undefined) cursor_pos.x = text_storage[cursor_pos.y - 1].length - 1
				cursor_pos.y--
			}
		}

		else if (key === 'i') { // set modes
			switch_mode(MODES.INSERT)
		}
	} else if (mode == MODES.INSERT) {
		if (keyCode == ESCAPE) { // change mode back to normal
			switch_mode(MODES.NORMAL)
			if (text_storage[cursor_pos.y][cursor_pos.x] == undefined) cursor_pos.x = text_storage[cursor_pos.y].length - 1
		}

		if (keyCode == LEFT_ARROW) { // move cursor
			if (cursor_pos.x > 0) cursor_pos.x--
		} else if (keyCode == RIGHT_ARROW) {
			if (text_storage[cursor_pos.y][cursor_pos.x] != undefined) cursor_pos.x++
		} else if (keyCode == DOWN_ARROW) {
			if (text_storage[cursor_pos.y + 1] != undefined) {
				if (text_storage[cursor_pos.y + 1][cursor_pos.x] == undefined) cursor_pos.x = text_storage[cursor_pos.y + 1].length
				cursor_pos.y++
			}
		} else if (keyCode == UP_ARROW) {
			if (cursor_pos.y > 0) {
				if (text_storage[cursor_pos.y - 1][cursor_pos.x] == undefined) cursor_pos.x = text_storage[cursor_pos.y - 1].length
				cursor_pos.y--
			}
		}

		else if (keyCode == BACKSPACE) { // delete char
			if (cursor_pos.x > 0) {
				text_storage[cursor_pos.y] = text_storage[cursor_pos.y].slice(0, cursor_pos.x - 1) + 
					text_storage[cursor_pos.y].slice(cursor_pos.x, text_storage[cursor_pos.y].length)
				cursor_pos.x--
			} else if (cursor_pos.y > 0) {
				cursor_pos.x = text_storage[cursor_pos.y - 1].length // remove line break
				text_storage[cursor_pos.y - 1] += text_storage[cursor_pos.y]
				text_storage.splice(cursor_pos.y, 1)
				cursor_pos.y--
			}
		} else if (keyCode == ENTER) { // new line break
			text_storage.splice(cursor_pos.y + 1, 0, text_storage[cursor_pos.y].substring(cursor_pos.x))
			text_storage[cursor_pos.y] = text_storage[cursor_pos.y].substring(0, cursor_pos.x)
			cursor_pos.y++
			cursor_pos.x = 0
		}
	}
}

function keyTyped() { // using different function for text input, bc it does not react to special keys
	if (is_first_press_after_mode_switch) {
		is_first_press_after_mode_switch = false
		return
	}
	
	if (key == "Enter") return

	if (mode == MODES.INSERT) {
		text_storage[cursor_pos.y] = text_storage[cursor_pos.y].slice(0, cursor_pos.x) + key 
			+ text_storage[cursor_pos.y].slice(cursor_pos.x)
		cursor_pos.x++
	}
}
