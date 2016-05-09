CLiCk, Speak.js
===============

This is a hack of Charles L. Chen's old text-to-speech Firefox add-on: CLiCk, Speak. It incorporates libraries and components for both ML-FireVox (a multi-language fork FireVox maintained by Filippo Battaglia) and a JavaScript text-to-speech engine Speak.js (which is in turn based on eSpeak).

Related URLs
------------

* http://clickspeak.clcworld.net/
* http://visilab.unime.it/~filippo/MLFireVox/MLFireVox.htm
* https://github.com/logue/speak.js
* http://espeak.sourceforge.net/

What's New
----------

* CLiCk, Speak.js is now a Bootstrapped Extension. That means you no longer have to restart the browser after installing/uninstalling the extension.
* Web Speech API is now used for speech synthesis whenever the feature is enabled in Firefox. The speak.js TTS engine is now only used when this feature is disabled.


Usage
-----

To create this add-on and install it, follow these instructions:

* Create a ZIP file.
* Copy the contents of this project into the ZIP file.
* Change the extension of the ZIP file to "XPI".
* Drag-drop your XPI into Mozilla Firefox. A dialog box will appear prompting you to install the add-on.
* Click "Install Now".

Known Bugs
----------

* On some pages, the auto-reading mode ignores the cursor position and just reads from the top of the page.
* If you change the Web Speech API setting in the options dialog, this change won't take effect until you click Save.
* This extension uses a precompiled, unmodified copy of speak.js. Because of this, speech synthesis using speak.js inherits all of its bugs and only supports the English language.

Long-Term Goals
---------------

* Australis-themed buttons.
* Improve support for languages other than English.
* Allow different voices and add support for true female voices.
* General speech improvements.

