var OPEN_LINE_MODE = {
	modeText: "OPEN LINE",

	trigger_keys: ['o', 'O'],
	
	keyPressed: function() {},

	keyTyped: function() {},

	mousePressed: function(clicked_x, clicked_y) {},

	render_cursor: function () {},

	mouseWheel: function (event) {},

	draw: function() {},

	run: function(args) {
		var real_pos = rendered_to_real_pos(cursor_pos.x, cursor_pos.y + scroll_offset)
		if (keyIsDown(SHIFT)) {
			text_storage.splice(real_pos.y, 0, "")
			render_text()
			while (real_pos.y == rendered_to_real_pos(cursor_pos.x, cursor_pos.y - 1 + scroll_offset).y) {
				cursor_pos.y--
			}
			cursor_pos.x = 0
		} else {
			text_storage.splice(real_pos.y + 1, 0, "")
			render_text()
			while (real_pos.y == rendered_to_real_pos(cursor_pos.x, cursor_pos.y + scroll_offset).y) {
				cursor_pos.y++
			}
			cursor_pos.x = 0
		}
		switch_mode(MODES.INSERT, [""])
	},
}
