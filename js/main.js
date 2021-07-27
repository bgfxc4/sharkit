var text_size = 32

var cursor_pos = {
	x: 0,
	y: 0
}

const MODES = {
	NORMAL: 0,
	INSERT: 1,
	REPLACE: 2
}

var MODE_OBJECTS = [
	NORMAL_MODE,
	INSERT_MODE,
	REPLACE_MODE
]

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
	render_mode()
}

function remove_char(index_y, index_x) {
	text_storage[index_y] = text_storage[index_y].slice(0, index_x - 1) + 
		text_storage[index_y].slice(index_x, text_storage[index_y].length)
}

function insert_char(char, index_y, index_x) {
	text_storage[index_y] = text_storage[index_y].slice(0, index_x) + char 
	+ text_storage[index_y].slice(index_x)
}

function switch_mode(mode_to_switch_to) {
	mode = mode_to_switch_to
	is_first_press_after_mode_switch = true
}

function keyPressed() {
	MODE_OBJECTS[mode].keyPressed()
}

function keyTyped() { // using different function for text input, bc it does not react to special keys
	if (is_first_press_after_mode_switch) {
		is_first_press_after_mode_switch = false
		return
	}
	
	if (key == "Enter") return // Enter is already covered in "keyPressed"
	
	MODE_OBJECTS[mode].keyTyped()
}

function mousePressed() {
	var clicked_y = -1
	var clicked_x = -1

	for (var i = text_storage.length; i > 0; i--) {
		if (mouseY < i * text_size) clicked_y = i - 1
	}
	
	if (clicked_y == -1) {
		clicked_y = text_storage.length - 1
		clicked_x = text_storage[clicked_y].length - 1
	} else {
		for (var i = text_storage[clicked_y].length + 1; i >= 0; i--) {
			if (mouseX < textWidth(text_storage[clicked_y].substring(0, i )) + text_size) clicked_x = i - 1
		}
	}

	MODE_OBJECTS[mode].mousePressed(clicked_x, clicked_y)
}

function render_text() {
	fill(255)
	for (var i in text_storage) {
		text(text_storage[i], text_size, i * text_size + text_size)
	}
}

function render_cursor() {
	MODE_OBJECTS[mode].render_cursor()
}

function render_mode() {
	var mode_text ="Mode: " + MODE_OBJECTS[mode].modeText
	fill(170)
	text(mode_text, windowWidth - textWidth(mode_text) - textWidth("A"), windowHeight - textAscent(mode_text))
}
