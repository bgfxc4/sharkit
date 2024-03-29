var COMMAND_MODE = {
	modeText: "COMMAND",

	trigger_keys: [':'],

	command: "",
	message: {
		col: undefined,
		text: ""
	},

	keyPressed: function() {
		if (keyCode == ESCAPE) { // change mode back to normal
			switch_mode(MODES.NORMAL, [ESCAPE])
			this.command = ""
			this.message.text = ""
		} else if (keyCode == BACKSPACE) {
			this.message.text = ""
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
				this.message.col = color(255, 40, 40)
				this.message.text = `The command "${splitted[0]}" does not exist!`
				return
			}
			this.commandList[splitted[0]](splitted)
			this.command = ""
		}
	},

	keyTyped: function() {
		this.command += key
		this.message.text = ""
	},

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
		if (this.command == "") {
			fill(this.message.col)
			text(this.message.text, 2 * text_width_all(":"), windowHeight - textAscent(":"))
		}
	},

	run: function(args) {
		this.message.col = color(255)
	},


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
