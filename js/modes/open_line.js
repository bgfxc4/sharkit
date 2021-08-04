var OPEN_LINE_MODE = {
	modeText: "OPEN LINE",
	
	keyPressed: function() {},

	keyTyped: function() {},

	mousePressed: function(clicked_x, clicked_y) {},

	render_cursor: function () {},

	mouseWheel: function (event) {},

	draw: function() {
		var real_pos = rendered_to_real_pos(cursor_pos.x, cursor_pos.y)
		if (keyIsDown(SHIFT)) {
			text_storage.splice(real_pos.y, 0, "")
			while (real_pos.y == rendered_to_real_pos(cursor_pos.x, cursor_pos.y - 1).y) {
				cursor_pos.y--
			}
			cursor_pos.x = 0
		} else {	
			text_storage.splice(real_pos.y + 1, 0, "")	
			do {
				cursor_pos.y++
			} while (real_pos.y == rendered_to_real_pos(cursor_pos.x, cursor_pos.y).y)
			cursor_pos.x = 0
		}
		switch_mode(MODES.INSERT)
	},
}
