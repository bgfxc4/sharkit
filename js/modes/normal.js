var NORMAL_MODE = {
	modeText: "NORMAL",
	
	keyPressed: function() {
		if (keyCode == LEFT_ARROW) { // move cursor
			if (cursor_pos.x > 0) cursor_pos.x--
		} else if (keyCode == RIGHT_ARROW) {
			if (rendered_text_storage[cursor_pos.y][cursor_pos.x + 1] != undefined) cursor_pos.x++
		} else if (keyCode == DOWN_ARROW) {
			if (rendered_text_storage[cursor_pos.y + 1] != undefined) {
				if (rendered_text_storage[cursor_pos.y + 1][cursor_pos.x] == undefined) {
					cursor_pos.x = rendered_text_storage[cursor_pos.y + 1].length - 1
					if (cursor_pos.x < 0) {
						cursor_pos.x = 0
					}
				}
				cursor_pos.y++
			}
		} else if (keyCode == UP_ARROW) {
			if (cursor_pos.y > 0) {
				if (rendered_text_storage[cursor_pos.y - 1][cursor_pos.x] == undefined) {
					cursor_pos.x = rendered_text_storage[cursor_pos.y - 1].length - 1
					if (cursor_pos.x < 0) {
						cursor_pos.x = 0
					}
				}

				cursor_pos.y--
			}
		}

		else if (key === 'i') { // set modes
			switch_mode(MODES.INSERT)
		} else if (key === 'r') { // set modes
			switch_mode(MODES.REPLACE)
		} else if (key === ':') {
			switch_mode(MODES.COMMAND)
		}
	},

	keyTyped: function() {

	},

	mousePressed: function(clicked_x, clicked_y) {
		cursor_pos.y = clicked_y
		cursor_pos.x = (clicked_x == -1) ? rendered_text_storage[clicked_y].length - 1 : clicked_x
	}, 

	render_cursor: function () {
		fill(255)
		if (cursor_pos.x > 0) {
		rect(textWidth(rendered_text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + left_bar_size, 
			cursor_pos.y * text_size + 0.2 * text_size,
			textWidth(rendered_text_storage[cursor_pos.y][cursor_pos.x]), text_size)
		} else {
			rect(left_bar_size,
			cursor_pos.y * text_size + 0.2 * text_size,
			textWidth("A"), text_size)
		}
		fill(0)
		text(rendered_text_storage[cursor_pos.y][cursor_pos.x], textWidth(rendered_text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + left_bar_size, cursor_pos.y * text_size + text_size)
	},
}
