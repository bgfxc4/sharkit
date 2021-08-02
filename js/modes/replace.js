var REPLACE_MODE = {
	modeText: "REPLACE",
	
	keyPressed: function() {
		if (keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW || keyCode == UP_ARROW || keyCode == DOWN_ARROW || keyCode == ESCAPE) {
			switch_mode(MODES.NORMAL)
		}
	},

	keyTyped: function() {
		remove_char_rendered(cursor_pos.y + scroll_offset, cursor_pos.x + 1)
		insert_char_rendered(key, cursor_pos.y + scroll_offset, cursor_pos.x)
		switch_mode(MODES.NORMAL)
	},

	mousePressed: function(clicked_x, clicked_y) {
		switch_mode(MODES.NORMAL)
	},

	render_cursor: function () {
		if (cursor_pos.x > 0) {
		rect(textWidth(rendered_text_storage[cursor_pos.y + scroll_offset].substring(0, cursor_pos.x)) + left_bar_size, 
			cursor_pos.y * text_size + 1.1 * text_size,
			textWidth(rendered_text_storage[cursor_pos.y + scroll_offset][cursor_pos.x]), 0.1 * text_size)
		} else {
			rect(left_bar_size,
			cursor_pos.y * text_size + 1.1 * text_size,
			textWidth("A"), 0.1 * text_size)
		}
	},

	mouseWheel: function (event) {
		switch_mode(MODES.NORMAL)
	},
}
