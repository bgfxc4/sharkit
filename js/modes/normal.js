var NORMAL_MODE = {
	modeText: "NORMAL",

	trigger_keys: [],

	keyPressed: function() {
		if (keyCode == LEFT_ARROW) { // move cursor
			if (cursor_pos.x > 0) cursor_pos.x--
		} else if (keyCode == RIGHT_ARROW) {
			if (rendered_text_storage[cursor_pos.y + scroll_offset][cursor_pos.x + 1] != undefined) cursor_pos.x++
		} else if (keyCode == DOWN_ARROW) {
			this.move_cursor_down()
		} else if (keyCode == UP_ARROW) {
			this.move_cursor_up()
		}

		for (var mode_val of Object.values(MODES)) {
			for (var c of MODE_OBJECTS[mode_val].trigger_keys) {
				if (key === c) {
					switch_mode(mode_val, [c])
					return
				}
			}
		}
	},

	mousePressed: function(clicked_x, clicked_y) {
		cursor_pos.y = clicked_y
		cursor_pos.x = (clicked_x == -1) ? rendered_text_storage[clicked_y].length - 1 : clicked_x
	}, 

	render_cursor: function () {
		fill(255)
		if (cursor_pos.x > 0) {
		rect(text_width_all(rendered_text_storage[cursor_pos.y + scroll_offset].substring(0, cursor_pos.x)) + left_bar_size, 
			cursor_pos.y * text_size + 0.2 * text_size,
			text_width_all(rendered_text_storage[cursor_pos.y + scroll_offset][cursor_pos.x]), text_size)
		} else {
			rect(left_bar_size,
			cursor_pos.y * text_size + 0.2 * text_size,
			text_width_all("A"), text_size)
		}
		fill(0)
		text(rendered_text_storage[cursor_pos.y + scroll_offset][cursor_pos.x], text_width_all(rendered_text_storage[cursor_pos.y + scroll_offset].substring(0, cursor_pos.x)) + left_bar_size, cursor_pos.y * text_size + text_size)
	},

	mouseWheel: function (event) {
		if (keyIsDown(CONTROL)) {
			(event.delta <= 0)? text_size++ : text_size--
		} else {
			if (scroll_offset < rendered_text_storage.length && event.delta > 0) {
				scroll_down()
				if (scroll_offset < rendered_text_storage.length) scroll_down()
			} else if (scroll_offset > 0 && event.delta < 0) {
				scroll_up()
				if (scroll_offset > 0) scroll_up()
			}
		}
	},

	mouseDragged: function (start_pos, current_pos) {
		if (start_pos.x != current_pos.x || start_pos.y != current_pos.y) {
			switch_mode(MODES.SELECT, [""])
		}	
	},


	// own functions, not required
	move_cursor_down: function() {
		if (rendered_text_storage[cursor_pos.y + scroll_offset + 1] != undefined) {
			if (rendered_text_storage[cursor_pos.y + scroll_offset + 1][cursor_pos.x] == undefined) {
				cursor_pos.x = rendered_text_storage[cursor_pos.y + scroll_offset + 1].length - 1
				if (cursor_pos.x < 0) {
					cursor_pos.x = 0
				}
			}
			if (((cursor_pos.y + 2) * text_size) > windowHeight - textAscent("A")) {
				scroll_down()
			} else {
				cursor_pos.y++
			}
		}
	},

	move_cursor_up: function() {
		if (cursor_pos.y > 0) {
			if (rendered_text_storage[cursor_pos.y + scroll_offset - 1][cursor_pos.x] == undefined) {
				cursor_pos.x = rendered_text_storage[cursor_pos.y + scroll_offset - 1].length - 1
				if (cursor_pos.x < 0) {
					cursor_pos.x = 0
				}
			}
			cursor_pos.y--
		} else if (scroll_offset > 0) {
			scroll_up()
		}
	}
}
