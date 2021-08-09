var SELECT_MODE = {
	modeText: "SELECT",

	trigger_keys: [""],

	selected_storage: [],

	keyPressed: function() {
		if (keyCode == ESCAPE) {
			switch_mode(MODES.NORMAL, [ESCAPE])
		}
	},

	mouseDragged: function(start_pos, current_pos) {
		if (current_pos.x > start_pos.x) current_pos.x += 1
		this.selected_storage = []
		var down = current_pos.y >= start_pos.y
		for (var i = down ? start_pos.y : current_pos.y; i < (down ? current_pos.y : start_pos.y) + 1 && i < rendered_text_storage.length; i++) {
			this.selected_storage[i] = {
				before: 0,
				length: rendered_text_storage[i + scroll_offset].length
			}

			if (i == start_pos.y || i == current_pos.y) {
				if (i == start_pos.y && i == current_pos.y) {
					this.selected_storage[i].before = Math.min(start_pos.x, current_pos.x)
					this.selected_storage[i].length = Math.max(1, Math.abs(start_pos.x - current_pos.x))
				} else if ((i == start_pos.y && down) || (i == current_pos.y && !down)) {
					this.selected_storage[i].before = (i == current_pos.y) ? current_pos.x : start_pos.x
					this.selected_storage[i].length = rendered_text_storage[i + scroll_offset].length - ((i == current_pos.y) ? current_pos.x : start_pos.x)
				} else if ((i == current_pos.y && down) || (i == start_pos.y && !down)) {
					this.selected_storage[i].before = 0
					this.selected_storage[i].length = (i == current_pos.y) ? current_pos.x : start_pos.x
				}
			}

			if (current_pos.x < start_pos.x)
				this.selected_storage[i].length++
		}
	},

	render_cursor: function() {
		for (var i = scroll_offset; i < rendered_text_storage.length && ((i - scroll_offset - (-1)) * text_size) < windowHeight - textAscent("A"); i++) {
			if (this.selected_storage[i - scroll_offset] == undefined) continue
			fill(255)
			if (rendered_text_storage[i] == "") {
				rect(left_bar_size, (i - scroll_offset) * text_size + 0.2 * text_size, text_width_all(" "), text_size)
			} else {
				rect(text_width_all(rendered_text_storage[i].substring(0, this.selected_storage[i - scroll_offset].before)) + left_bar_size, 
					(i - scroll_offset) * text_size + 0.2 * text_size,
					text_width_all(rendered_text_storage[i].substr(this.selected_storage[i - scroll_offset].before, 
					this.selected_storage[i - scroll_offset].length)), text_size)
			}

			fill(0)
			text(rendered_text_storage[i].substr(this.selected_storage[i - scroll_offset].before, this.selected_storage[i - scroll_offset].length), 
				left_bar_size + text_width_all(rendered_text_storage[i].substring(0, this.selected_storage[i - scroll_offset].before)), (i - scroll_offset - (-1)) * text_size)
		}
	},

	mousePressed: function() {
		this.selected_storage = []
	},

	run: function(args) {
		this.selected_storage = []
	},
}
