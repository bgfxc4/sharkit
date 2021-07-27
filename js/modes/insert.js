var INSERT_MODE = {
	modeText: "INSERT",

	keyPressed: function() {
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
		} else if (keyCode == BACKSPACE) { // delete char
			if (cursor_pos.x > 0) {
				remove_char(cursor_pos.y, cursor_pos.x)
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
	},

	keyTyped: function() {
		insert_char(key, cursor_pos.y, cursor_pos.x)
		cursor_pos.x++
	},

	mousePressed: function(clicked_x, clicked_y) {
		cursor_pos.y = clicked_y
		cursor_pos.x = (clicked_x == -1) ? text_storage[clicked_y].length : clicked_x
	},

	render_cursor: function () {
		fill(255)
		rect(textWidth(text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + text_size, 
			cursor_pos.y * text_size + 0.2 * text_size,
			2, text_size)
	},
}
