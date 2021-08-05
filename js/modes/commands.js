var COMMAND_MODE = {
	modeText: "COMMAND",

	trigger_keys: [':'],

	command: "",

	keyPressed: function() {
		if (keyCode == ESCAPE) { // change mode back to normal
			switch_mode(MODES.NORMAL, [ESCAPE])
			this.command = ""
		} else if (keyCode == BACKSPACE) {
			if (this.command == "") {
				switch_mode(MODES.NORMAL, [BACKSPACE])
				return 
			}
			this.command = this.command.slice(0, -1)
		} else if (keyCode == ENTER) {
			var splitted = this.command.split(" ").filter(a => {
				return a != ""
			})
			if (this.commandList[splitted[0]] == undefined) {
				this.command = ""
				switch_mode(MODES.NORMAL, [""])
				return
			}
			this.commandList[splitted[0]](splitted)
			this.command = ""
		}
	},

	keyTyped: function() {
		this.command += key
	},

	mousePressed: function(clicked_x, clicked_y) {},

	render_cursor: function () {
		fill(120)
		if (cursor_pos.x > 0) {
		rect(text_width_all(rendered_text_storage[cursor_pos.y - scroll_offset].substring(0, cursor_pos.x)) + left_bar_size, 
			(cursor_pos.y - scroll_offset) * text_size + 0.2 * text_size,
			text_width_all(rendered_text_storage[cursor_pos.y - scroll_offset][cursor_pos.x]), text_size)
		} else {
			rect(left_bar_size,
			(cursor_pos.y - scroll_offset) * text_size + 0.2 * text_size,
			text_width_all("A"), text_size)
		}
		fill(30)
		text(rendered_text_storage[cursor_pos.y - scroll_offset][cursor_pos.x], text_width_all(rendered_text_storage[cursor_pos.y - scroll_offset].substring(0, cursor_pos.x)) + left_bar_size, (cursor_pos.y - scroll_offset) * text_size + text_size)

		fill(170) // render entered command
		text(":" + this.command, text_width_all(":"), windowHeight - textAscent(":"))
	},

	mouseWheel: function (event) {},

	draw: function() {},

	run: function(args) {},


	// own functions
	commandList: {
		open: function(args) { 
			open_file() 
			switch_mode(MODES.NORMAL, [""])
		},
		save: function(args) {
			if (args[1] != undefined) { // only supports filenames without spaces, dont use spaces in your filenames
				save_file(args[1])
			} else {
				save_file()
			}
			switch_mode(MODES.NORMAL, [""])
		}
	},
}
