CLiCk, Speak.js
===============

This is a hack of Charles L. Chen's old text-to-speech Firefox add-on: CLiCk, Speak. It incorporates libraries and components for both ML-FireVox (a multi-language fork FireVox maintained by Filippo Battaglia) and a JavaScript text-to-speech engine Speak.js (which is in turn based on eSpeak). All TTS engines except for Speak.js have been removed, so it should work on all platforms.

Related URLs
------------

* http://clickspeak.clcworld.net/
* http://visilab.unime.it/~filippo/MLFireVox/MLFireVox.htm
* https://github.com/kn/speak.js
* http://espeak.sourceforge.net/

Usage
-----

To create this add-on and install it, follow these instructions:

* Create a ZIP file.
* Copy the contents of this project into the ZIP file.
* Change the extension of the ZIP file to "XPI".
* Drag-drop your XPI into Mozilla Firefox. A dialog box will appear prompting you to install the add-on.
* Click "Install Now".
* Restart Mozilla Firefox when prompted.

Known Bugs
----------

* Because the extension uses speak.js, it inherits all of its bugs.
* Since the extension is an evolution of CLiCK, Speak, issues with the auto-reading mode have been similarly inherited.
* Due to my currently limited understanding of eSpeak and Emscripten, languages are for now limited to English.

Long-Term Goals
---------------

* Update the version of eSpeak that Speak.js is generated from and change the output to use asm.js to improve performance.
* Multi-language support, possibly by using code from meSpeak.js (modulary enhanced speak.js).
* Allow different voices and add support for true female voices.
* General speech improvements.
