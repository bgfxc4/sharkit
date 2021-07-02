function render_text() {
	fill(255)
	for (var i in text_storage) {
		text(text_storage[i], text_size, i * text_size + text_size)
	}
}

function render_cursor() {
	if (mode == MODES.NORMAL) {
		fill(255)
		if (cursor_pos.x > 0) {
		rect(textWidth(text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + text_size, 
			cursor_pos.y * text_size + 0.2 * text_size,
			textWidth(text_storage[cursor_pos.y][cursor_pos.x]), text_size)
		} else {
			rect(text_size,
			cursor_pos.y * text_size + 0.2 * text_size,
			textWidth("A"), text_size)
		}
		fill(0)
		text(text_storage[cursor_pos.y][cursor_pos.x], textWidth(text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + text_size, cursor_pos.y * text_size + text_size)
	} else if (mode == MODES.INSERT) {
		fill(255)
		rect(textWidth(text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + text_size, 
			cursor_pos.y * text_size + 0.2 * text_size,
			2, text_size)
	}
}

function render_mode() {
	var mode_text ="Mode: "
	if (mode == MODES.NORMAL) mode_text += "NORMAL"
	else if (mode == MODES.INSERT) mode_text += "INSERT"
	fill(170)
	text(mode_text, windowWidth - textWidth(mode_text) - textWidth("A"), windowHeight - textAscent(mode_text))
}

function insert_char(char, index_y, index_x) {
	text_storage[index_y] = text_storage[index_y].slice(0, index_x) + char 
	+ text_storage[index_y].slice(index_x)
}
