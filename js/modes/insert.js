var INSERT_MODE = {
	modeText: "INSERT",

	keyPressed: function() {
		var real_cursor_pos = rendered_to_real_pos(cursor_pos.x, cursor_pos.y + scroll_offset)
		
		if (keyCode == ESCAPE) { // change mode back to normal
			switch_mode(MODES.NORMAL)
			if (rendered_text_storage[cursor_pos.y + scroll_offset][cursor_pos.x] == undefined) cursor_pos.x = rendered_text_storage[cursor_pos.y + scroll_offset].length - 1
		}

		if (keyCode == LEFT_ARROW) { // move cursor
			if (cursor_pos.x > 0) cursor_pos.x--
		} else if (keyCode == RIGHT_ARROW) {
			if (rendered_text_storage[cursor_pos.y + scroll_offset][cursor_pos.x] != undefined) cursor_pos.x++
		} else if (keyCode == DOWN_ARROW) {
			this.move_cursor_down()
		} else if (keyCode == UP_ARROW) {
			this.move_cursor_up()
		} else if (keyCode == BACKSPACE) { // delete char
			if (real_cursor_pos.x > 0) {
				remove_char_rendered(cursor_pos.y + scroll_offset, cursor_pos.x)
				cursor_pos.x--
			} else if (real_cursor_pos.y > 0) { // remove line break
				console.log(cursor_pos, real_cursor_pos)
				text_storage[real_cursor_pos.y - 1] += text_storage[real_cursor_pos.y]
				text_storage.splice(real_cursor_pos.y, 1)
				
				cursor_pos.x = rendered_text_storage[cursor_pos.y + scroll_offset - 1].length
				if (cursor_pos.y <= 0) {
					scroll_up()
				} else {
					cursor_pos.y--
				}
			} 
			if (cursor_pos.x < 0) { // remove rendered_line_break
				if (cursor_pos.y <= 0) {
					scroll_up()
				} else {
					cursor_pos.y--
				}
				cursor_pos.x = rendered_text_storage[cursor_pos.y + scroll_offset].length
			}
		} else if (keyCode == ENTER) { // new line break
			text_storage.splice(real_cursor_pos.y + 1, 0, text_storage[real_cursor_pos.y].substring(real_cursor_pos.x))
			text_storage[real_cursor_pos.y] = text_storage[real_cursor_pos.y].substring(0, real_cursor_pos.x)
			cursor_pos.x = 0
			if (((cursor_pos.y + 2) * text_size) > windowHeight - textAscent("A")) {
				scroll_down()
			} else {
				cursor_pos.y++
			}
		} else if (keyCode == TAB) {
			insert_char_rendered("\t", cursor_pos.y + scroll_offset, cursor_pos.x)
			cursor_pos.x++
			render_text()
			if (cursor_pos.x > rendered_text_storage[cursor_pos.y + scroll_offset].length) {
				cursor_pos.y ++;
				cursor_pos.x = 1
			}
		}
	},

	keyTyped: function() {
		insert_char_rendered(key, cursor_pos.y + scroll_offset, cursor_pos.x)
		cursor_pos.x++
		render_text()
		if (cursor_pos.x > rendered_text_storage[cursor_pos.y + scroll_offset].length) {
			cursor_pos.y ++;
			cursor_pos.x = 1
		}
	},

	mousePressed: function(clicked_x, clicked_y) {
		cursor_pos.y = clicked_y
		cursor_pos.x = (clicked_x == -1) ? rendered_text_storage[clicked_y].length : clicked_x
	},

	render_cursor: function () {
		fill(255)
		rect(text_width_all(rendered_text_storage[cursor_pos.y + scroll_offset].substring(0, cursor_pos.x)) + left_bar_size, 
			cursor_pos.y * text_size + 0.2 * text_size,
			2, text_size)
	},

	mouseWheel: function (event) {
		if (keyIsDown(CONTROL)) {
			(event.delta <= 0)? text_size++ : text_size--
		} else {
			if (scroll_offset < rendered_text_storage.length && event.delta > 0) {
				scroll_down()
				console.log(scroll_offset, rendered_text_storage.length)
			} else if (scroll_offset > 0 && event.delta < 0) {
				scroll_up()
			}
		}
	},


	// own functions
	move_cursor_down: function() {
		if (rendered_text_storage[cursor_pos.y + scroll_offset + 1] != undefined) {
			if (rendered_text_storage[cursor_pos.y + scroll_offset + 1][cursor_pos.x] == undefined) cursor_pos.x = rendered_text_storage[cursor_pos.y + scroll_offset + 1].length
			if (((cursor_pos.y + 2) * text_size) > windowHeight - textAscent("A")) {
				scroll_down()
			} else {
				cursor_pos.y++
			}
		} 
	},

	move_cursor_up: function() {
		if (cursor_pos.y > 0) {
			if (rendered_text_storage[cursor_pos.y + scroll_offset - 1][cursor_pos.x] == undefined) cursor_pos.x = rendered_text_storage[cursor_pos.y + scroll_offset - 1].length
			cursor_pos.y--
		} else if (scroll_offset > 0) {
			scroll_up()
		}
	}
}
