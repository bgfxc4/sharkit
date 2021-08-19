var text_size = 32

var cursor_pos = {
	x: 0,
	y: 0
}

var mouse_drag_start_pos = {
	x: -1,
	y: -1
}

var scroll_offset = 0

const MODES = {
	NORMAL: 0,
	INSERT: 1,
	REPLACE: 2,
	COMMAND: 3,
	OPEN_LINE: 4,
	SELECT: 5,
}

var MODE_OBJECTS = [
	NORMAL_MODE,
	INSERT_MODE,
	REPLACE_MODE,
	COMMAND_MODE,
	OPEN_LINE_MODE,
	SELECT_MODE
]

var mode = MODES.NORMAL
var is_first_press_after_mode_switch = false;

var text_storage = [
	"1. line",
	"2.line",
	"asdasd"
]

var rendered_text_storage = []
var rendered_text_storage_line = [] // mapping to the real line the rendered line is corresponding to
var rts_idx = 0

var left_bar_size = text_size * 2

var last_pressed_key = {
	keyCode: undefined,
	key: undefined
}
var held_down_time

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

	render_line_numbers()
	render_text()
	render_cursor()
	render_mode()
	
	if (typeof(MODE_OBJECTS[mode].draw) == 'function')
		MODE_OBJECTS[mode].draw()

	if (keyIsDown(last_pressed_key.keyCode)) {
		if (held_down_time < 20) {
			console.log(held_down_time)
			held_down_time++
		} else {
			if ([BACKSPACE, DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) {
				keyPressed()
			} else {
				keyTyped()
			}
		}
	} else {
		last_pressed_key.keyCode = undefined
		last_pressed_key.key = undefined
		held_down_time = 0
	}
}

function remove_char(index_y, index_x) {
	text_storage[index_y] = text_storage[index_y].slice(0, index_x - 1) + 
		text_storage[index_y].slice(index_x, text_storage[index_y].length)
}

function remove_char_rendered(index_y, index_x) {
	var real_pos = rendered_to_real_pos(index_x, index_y)
	remove_char(real_pos.y, real_pos.x)
}

function insert_char(char, index_y, index_x) {
	text_storage[index_y] = text_storage[index_y].slice(0, index_x) + char 
	+ text_storage[index_y].slice(index_x)
}

function insert_char_rendered(key, index_y, index_x) {
	var real_pos = rendered_to_real_pos(index_x, index_y)
	insert_char(key, real_pos.y, real_pos.x)
}

function switch_mode(mode_to_switch_to, args = []) { // args[0] is the key that triggered the mode switch. if none, then ""
	mode = mode_to_switch_to
	is_first_press_after_mode_switch = true
	if (typeof(MODE_OBJECTS[mode].run) == 'function')
		MODE_OBJECTS[mode].run(args)
}

function rendered_to_real_pos(x, y) {
	var real_pos = {
		x: 0,
		y: rendered_text_storage_line[y] - 0
	}

	if (Number.isNaN(real_pos.y)) {
		real_pos.y = rendered_text_storage_line[y-1] - 0
	}

	for (var i = y - 1; i >= 0; i --) {
		if (rendered_text_storage_line[i] == real_pos.y) {
			real_pos.x += rendered_text_storage[i].length
		} else {
			break
		}
	}
	real_pos.x += x
	return real_pos
}

function open_file() {
	var i = document.createElement("input")
	i.setAttribute("type", "file")
	i.addEventListener('change', read_file, false)
	i.click()
}

function read_file(e) {
	var file = e.target.files[0];
	if (!file) {
		return;
	}
	var reader = new FileReader();
	reader.onload = function(e) {
		var contents = e.target.result;
		console.log(contents)
		parse_file_into_text_storage(contents)
	};
	reader.readAsText(file);
}

function save_file(filename = "yourDocument.txt") {
	var data = text_storage.join('\n')
	var file = new Blob([data], {type: "text"});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
		url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function scroll_up() {
	scroll_offset--
	if (((cursor_pos.y + 2) * text_size) <= windowHeight - textAscent("A")){
		cursor_pos.y++
	}

	if (rendered_text_storage[cursor_pos.y + scroll_offset].length >= cursor_pos.x) {
		cursor_pos.x = rendered_text_storage[cursor_pos.y + scroll_offset].length - 1
	}
}

function scroll_down() {
	if (scroll_offset >= rendered_text_storage.length - 1) {
		return
	}

	if (cursor_pos.y > 0) {
		cursor_pos.y--
	}

	scroll_offset++

	if (rendered_text_storage[cursor_pos.y + scroll_offset].length >= cursor_pos.x) {
		cursor_pos.x = rendered_text_storage[cursor_pos.y + scroll_offset].length - 1
	}
}

function parse_file_into_text_storage(contents) {
	cursor_pos.x = 0
	cursor_pos.y = 0
	scroll_offset = 0
	text_storage = contents.split('\n')
}

function keyPressed() {
	held_down_time = (keyCode == last_pressed_key.keyCode) ? 17 : 0
	last_pressed_key.keyCode = keyCode
	last_pressed_key.key = undefined

	if (typeof(MODE_OBJECTS[mode].keyPressed) == 'function')
		MODE_OBJECTS[mode].keyPressed()
}

function keyTyped() { // using different function for text input, bc it does not react to special keys
	if (is_first_press_after_mode_switch) {
		is_first_press_after_mode_switch = false
		return
	}

	if (key == "Enter") return // Enter is already covered in "keyPressed"

	held_down_time = (key == last_pressed_key.key) ? 17 : 0
	last_pressed_key.keyCode = keyCode
	last_pressed_key.key = key

	if (typeof(MODE_OBJECTS[mode].keyTyped) == 'function')
		MODE_OBJECTS[mode].keyTyped()
}

function mouseWheel(event) {
	if (typeof(MODE_OBJECTS[mode].mouseWheel) == 'function')
		MODE_OBJECTS[mode].mouseWheel(event)
}

function mouseDragged(event) {
	var mouse_pos = get_mouse_coords()
	if (typeof(MODE_OBJECTS[mode].mouseDragged) == 'function')
		MODE_OBJECTS[mode].mouseDragged(mouse_drag_start_pos, mouse_pos)
}

function mousePressed() {
	var mouse_pos = get_mouse_coords()
	mouse_drag_start_pos = mouse_pos
	if (typeof(MODE_OBJECTS[mode].mousePressed) == 'function')
		MODE_OBJECTS[mode].mousePressed(mouse_pos.x, mouse_pos.y)
}

function get_mouse_coords() {
	var pos = {
		x: -1,
		y: -1
	}

	for (var i = rendered_text_storage.length - scroll_offset; i > 0; i--) {
		if (mouseY < i * text_size) pos.y = i - 1
	}

	if (pos.y == -1) {
		pos.y = rendered_text_storage.length - 1 - scroll_offset
		pos.x = rendered_text_storage[pos.y + scroll_offset].length - 1
	} else {
		for (var i = rendered_text_storage[pos.y + scroll_offset].length + 1; i >= 0; i--) {
			if (mouseX < text_width_all(rendered_text_storage[pos.y + scroll_offset].substring(0, i )) + left_bar_size) pos.x = i - 1
		}
	}
	return pos
}

function text_width_all(s) {
	s += ""
	if (s.includes("\t")) {
		var count = (s.match(/\t/g) || []).length
		return textWidth(s) - (count * textWidth("\t")) + 2 * count * textWidth(" ")
	}
	return textWidth(s)
}

function render_text() {
	fill(255)
	rendered_text_storage = []
	rendered_text_storage_line = []
	rts_idx = 0

	for (var i in text_storage) {
		if (text_width_all(text_storage[i]) + left_bar_size > windowWidth) {
			render_text_too_long(text_storage[i], i)
		} else {
			rendered_text_storage[rts_idx] = text_storage[i]
			rendered_text_storage_line[rts_idx++] = i
		}
	}

	if (rendered_text_storage[cursor_pos.y + scroll_offset] == undefined) {
		rendered_text_storage[cursor_pos.y + scroll_offset] = ""
		rendered_text_storage_line[cursor_pos.y + scroll_offset] = text_storage.length - 1
	}

	for (var i = scroll_offset; i < rendered_text_storage.length && ((i - scroll_offset - (-1)) * text_size) < windowHeight - textAscent("A"); i++) {
		text(rendered_text_storage[i], left_bar_size, (i - scroll_offset - (-1)) * text_size)
	}
}

function render_text_too_long(to_render, i) {
	fill(255)
	var s = ""
	while (text_width_all(to_render) + left_bar_size > windowWidth) {
		s = to_render.slice(-1) + s
		to_render = to_render.slice(0, -1)
	}
	rendered_text_storage[rts_idx] = to_render
	rendered_text_storage_line[rts_idx++] = i

	if(text_width_all(s) + left_bar_size > windowWidth) {
		render_text_too_long(s, i)
	} else {
		rendered_text_storage[rts_idx] = s
		rendered_text_storage_line[rts_idx++] = i
	}
}

function render_line_numbers() {
	left_bar_size = text_width_all("" + (rendered_text_storage.length)) + (text_size / 3)
	fill(150)
	for (var i = scroll_offset; i < rendered_text_storage_line.length && ((i - scroll_offset - (-1)) * text_size) < windowHeight - textAscent("A"); i++) {
		if (rendered_text_storage_line[i] != rendered_text_storage_line[i - 1]) {
			text((rendered_text_storage_line[i] - (-1)), left_bar_size - text_size / 4 - text_width_all(rendered_text_storage_line[i] - (-1)), (i - scroll_offset - (-1)) * text_size)
		}
	}
}

function render_cursor() {
	if (typeof(MODE_OBJECTS[mode].render_cursor) == 'function')
		MODE_OBJECTS[mode].render_cursor()
}

function render_mode() {
	var mode_text ="Mode: " + MODE_OBJECTS[mode].modeText
	fill(170)
	text(mode_text, windowWidth - text_width_all(mode_text) - text_width_all("A"), windowHeight - textAscent(mode_text))
}

document.addEventListener("wheel", e => {
	e.preventDefault()
}, {passive: false})

document.addEventListener("keydown", e => {
	if (e.key == "Tab") {
		e.preventDefault()
	}
})
