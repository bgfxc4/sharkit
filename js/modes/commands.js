var COMMAND_MODE = {
	modeText: "COMMAND",
	
	command: "",

	commandList: {
		open: function() { 
			open_file() 
			switch_mode(MODES.NORMAL)
		}
	},

	keyPressed: function() {
		if (keyCode == ESCAPE) { // change mode back to normal
			switch_mode(MODES.NORMAL)
			this.command = ""
		} else if (keyCode == BACKSPACE) {
			this.command = this.command.slice(0, -1)
		} else if (keyCode == ENTER) {
			if (this.commandList[this.command] == undefined) {
				return
			}
			this.commandList[this.command]()
		}
	},

	keyTyped: function() {
		this.command += key
	},

	mousePressed: function(clicked_x, clicked_y) {},

	render_cursor: function () {
		fill(120)
		if (cursor_pos.x > 0) {
		rect(textWidth(rendered_text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + left_bar_size, 
			cursor_pos.y * text_size + 0.2 * text_size,
			textWidth(rendered_text_storage[cursor_pos.y][cursor_pos.x]), text_size)
		} else {
			rect(left_bar_size,
			cursor_pos.y * text_size + 0.2 * text_size,
			textWidth("A"), text_size)
		}
		fill(30)
		text(rendered_text_storage[cursor_pos.y][cursor_pos.x], textWidth(rendered_text_storage[cursor_pos.y].substring(0, cursor_pos.x)) + left_bar_size, cursor_pos.y * text_size + text_size)

		fill(170) // render entered command
		text(":" + this.command, textWidth(":"), windowHeight - textAscent(":"))
	},
}
