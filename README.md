# sharkit (short for shark edit)
Online Editor for maximum productivity

If you are lucky, a example is hosted at https://bgfxc4.de/sharkit

## add a new Mode

You can easily create modes and load them to customize the editor.

To get started, copy the file `js/modes/mode_template.js` and give it the name of your mode.

In the first line, change the `COMMAND_MODE` to `[your mode name]_MODE` and change the `mode_text: "",` to `mode_text: "[your command name]"` (this is what gets displayed in the bottom left corner)

Now you have to the the editor, what keys should trigger your mode from the normal mode. You can do this by changing the line `trigger_keys: [],` to `trigger_keys: ['key1', 'key2', ["..."]]` (only one key/char!). If no keys should trigger your mode and it only gets triggered from code, leave the line as it is.

To "register" your mode, you have to go into the file `js/main.js`, and at the top, to the object `MODES` add an key-value pair looking like the following: `[your mode name]: [previous number + 1]`. In the next object `MODE_OBJECTS` you have to add an element to the array. The element should be the name, that you wrote in you mode file in the first line (`[your mode name]_MODE`).

To add functionality to your mode, you can implement the following functions in your mode object. The  functions should already be declared, but empty (if not, you can have a look at `js/modes/mode_template.js`).



### keyPressed()

Gets triggered everytime a key is pressed. Try to use it only for special keys (i.e. Arrowkeys, ctrl, shift, etc.) or key combinations.
You can get the pressed key in the variable `keyCode`. You can look into other mode files to see what you have to check for, or just simply look it up on the [p5js.org reference](https://p5js.org/reference).


### keyTyped()

Also gets triggered everytime a key is pressed. You only should use this one for text input. It does not get triggered when a special key (i.e. ctrl, enter, etc.) gets hit. You can get the key that triggered the function in the variable `key`.


### mousePressed(clicked_x, clicked_y)

Gets triggered, when a left click with the mouse happens. You et the coordinates the user clicked as parameters passed. They tell you, what character on the screen got clicked (in rendered coordinates, not real).


### render_cursor()

Gets called once every draw. Use it to render your cursor if you want one.


### mouseWheel(event)

Gets triggered every time the mousewheel gets moved. Tho get the distance and direction, you can use `event.delta`.


### draw()

Gets called every draw tick. Has no specified purpose. Use it for whatever you need it, i.e. rendering stuff that is not the cursor.


### run(args)

Gets called when the editor switched to your mode. The variable `args` gets passed as an argument. It is an array of strings. `args[0]` is the key that triggered your mode, the rest of the array can be used to transfer data between modes.


### own functions

If you want to create own functions, please **do not make this globally**, but keep them in the mode object.
