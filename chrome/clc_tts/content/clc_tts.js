//Copyright (C) 2008 Google Inc.
//CLC-4-TTS Firefox Extension:
//Core Library Components for Text-To-Speech for Firefox
//by Charles L. Chen
//Modified by Matthew Raymond
 
//This program is free software; you can redistribute it
//and/or modify it under the terms of the GNU General Public
//License as published by the Free Software Foundation;
//either version 2.1 of the License, or (at your option) any
//later version.  This program is distributed in the hope
//that it will be useful, but WITHOUT ANY WARRANTY; without
//even the implied warranty of MERCHANTABILITY or FITNESS FOR
//A PARTICULAR PURPOSE. See the GNU General Public License for
//more details.  You should have received a copy of the GNU
//General Public License along with this program; if not, look
//on the web at on the web at http://www.gnu.org/copyleft/gpl.html
//or write to the Free Software Foundation, Inc., 59 Temple Place,
//Suite 330, Boston, MA 02111-1307, USA.
 

//Last Modified Date 3/12/2015



//------------------------------------------

//Globals used by CLC-4-TTS
//These variables MUST NOT be touched by anyone using this library!
var CLC_TTS_ENGINE = 0;
var CLC_LANG = "en/en-us";
var CLC_SPEAKJS_OBJ;
var CLC_TTS_HISTORY_BUFFER;
var CLC_TTS_HISTORY_BUFFER_MAXSIZE;

var CLC_SPEAKJS_DefaultMiddle = 50;
var CLC_SPEAKJS_DefaultRate = 175;
var CLC_SPEAKJS_DefaultVolume = 100;


//------------------------------------------

//The Text-To-Speech engine that will be used is determined by "engine."
//Currently, the following values are valid for "engine":
//   0 = No engine selected
//   1 = Speak.js
//
//
//Returns true if initialized successfully; otherwise false.
//
function CLC_Init(engine) {
   // Questa parte è stata modificata. Se è operativo un engine, questo deve essere
   // disattivato. Sarà poi la routine di inizializzazione a provvedere ad attivare
   // un altro engine, ove questo sia possibile sulla data piattaforma
   
   if (CLC_TTS_ENGINE > 0)
   {
   	CLC_Interrupt();	// Ferma istantaneamente la riproduzione nell'engine in uso
   }
   
   // In questo momento non c'è nessun engine operativo
   
   CLC_TTS_ENGINE = 0;
   
   // Prova ad attivare l'engine che è stato richiesto
      
   if (engine == 1) {
      try {
         CLC_SPEAKJS_OBJ = new AudioContext;
         CLC_SPEAKJS_OBJ.Waiting = false;
         CLC_SPEAKJS_OBJ.playing = false;
         CLC_SPEAKJS_OBJ.source = null;

         // * Create history buffer.
         CLC_Make_TTS_History_Buffer(20);

         // * Set the engine flag.
         CLC_TTS_ENGINE = 1;

         return true;
      } catch(err) { }
   }

   return false;
}


//------------------------------------------

//Shuts down the speech engine.
//This function is a NOOP; deallocation is automatically handled
//by Firefox so developers do NOT actually need to free any memory 
//themselves. In fact, manual deallocation can be dangerous since
//it may deallocate it when some other extension still needs it.
//
function CLC_Shutdown() {
   CLC_Interrupt();
   return;
}

//------------------------------------------

//Allocates the space needed for the history buffer
//that stores the most recently read content objects.
//The default history buffer can store the 20 most
//recently read objects. 
//Calling this function will clear the buffer and the
//new size of the buffer will be "maxsize."
//
function CLC_Make_TTS_History_Buffer(maxsize) {
   CLC_TTS_HISTORY_BUFFER_MAXSIZE = maxsize;
   CLC_TTS_HISTORY_BUFFER = new Array(CLC_TTS_HISTORY_BUFFER_MAXSIZE);
}

//------------------------------------------

//Queries the speech engine to see if it is ready to speak.
//True == Ready to speak 
//False == Not ready to speak/Busy
//
function CLC_Ready() {
   var retVal = false;

   if (CLC_TTS_ENGINE == 1) {
      retVal = CLC_SPEAKJS_OBJ.playing == false && CLC_SPEAKJS_OBJ.Waiting == false;
   }

   return retVal;
}

//------------------------------------------

//Interrupts the speech engine so that it stops speaking.
//
function CLC_Interrupt() {
   if (CLC_TTS_ENGINE == 1) {
      if (CLC_SPEAKJS_OBJ.playing) {
        CLC_SPEAKJS_OBJ.source.stop();
        CLC_SPEAKJS_OBJ.source = null;
      }

      CLC_SPEAKJS_OBJ.playing = false;
      CLC_SPEAKJS_OBJ.Waiting = false;
   }

   return;
}


//------------------------------------------

//function WriteToConsole(message) {
//  myclass = Components.classes['@mozilla.org/consoleservice;1'];
//  myservice = myclass.getService(Components.interfaces.nsIConsoleService);
//  myservice.logStringMessage(message);
//}


//------------------------------------------

//This function is intended to allow developers to
//make the speech engine say a message. Possible uses
//include (but are definitely not limited to) announcing
//events to the user and echoing back hotkey commands.
//
//Makes the speech engine say the "messagestring" 
//using the specified "pitch."
//
//"messagestring" is a text string.
//"pitch" can be any one of the following integer values:
//   -2 = very low
//   -1 = low
//    0 = normal
//    1 = high
//    2 = very high
//
//CLC_Say will NOT interrupt the currently spoken string.
//
function CLC_Say(messagestring, pitch) {
   if (CLC_TTS_ENGINE == 0){
      return;
   }

   if ((pitch > 2) || (pitch < -2)) {
      alert("Invalid pitch");
      return;
   }

   if (CLC_TTS_ENGINE == 1) {
      pitch = (pitch * 25) + CLC_SPEAKJS_DefaultMiddle;
      
      // * TODO: Fix message text.

      CLC_SPEAKJS_Speak(
        messagestring,
        CLC_SPEAKJS_OBJ,
        {
          amplitude: CLC_SPEAKJS_DefaultVolume,
          pitch: pitch,
          speed: CLC_SPEAKJS_DefaultRate
        } //, voice: CLC_LANG }
      );
   }
}


//------------------------------------------

function CLC_Say_Direct(messagestring, args) {
   if (CLC_TTS_ENGINE == 0) {
      return;
   }

   if (CLC_TTS_ENGINE == 1) {
      CLC_SPEAKJS_Speak(messagestring, CLC_SPEAKJS_OBJ, args);

      return;
   }
}


//------------------------------------------

//This function is intended to allow developers to
//make the speech engine read content displayed within the 
//browser. The object that generated the string is stored
//to allow users to go back to the last object that was read.
//
//Makes the speech engine read the "contentstring" 
//using the specified "pitch." It also stores the "contentobject"
//in a history buffer of the most recently read objects.
//
//"messagestring" is a text string.
//"pitch" can be any one of the following integer values:
//   -2 = very low
//   -1 = low
//    0 = normal
//    1 = high
//    2 = very high
//"contentobject" should be the object on the page that generated the "contentstring"
//
//CLC_Read will NOT interrupt the currently spoken string.
//
function CLC_Read(contentobject, contentstring, pitch) {
   if (CLC_TTS_ENGINE == 0) {
      return;
   }

   if (pitch > 2 || pitch < -2) {
      alert("Invalid pitch");
      return;
   }

   if (CLC_TTS_ENGINE == 1) {
      pitch = (pitch * 25) + CLC_SPEAKJS_DefaultMiddle;
      
      // * TODO: Fix message text.

      CLC_SPEAKJS_Speak(
         messagestring,
         CLC_SPEAKJS_OBJ,
         { amplitude: CLC_SPEAKJS_DefaultVolume, pitch: pitch, speed: CLC_SPEAKJS_DefaultRate } //, voice: CLC_LANG }
      );
   }

   for(var i = CLC_TTS_HISTORY_BUFFER_MAXSIZE; i > 1; i--) {
      CLC_TTS_HISTORY_BUFFER[i-1] = CLC_TTS_HISTORY_BUFFER[i - 2];
   }

   CLC_TTS_HISTORY_BUFFER[0] = contentobject;
}

//------------------------------------------

//Retrieves the ("i"+1)th content object that was most recently read
//
//Example: CLC_Recently_Read(0) will return the last object 
//         that was read while CLC_Recently_Read(1) will 
//         return the next to the last object that was read.
//
function CLC_Recently_Read(i){
   if ((i < 0) || (i > CLC_TTS_HISTORY_BUFFER_MAXSIZE - 1)) {
      alert("Out of bounds of the Read History Buffer.");
      return null;
   }

   return CLC_TTS_HISTORY_BUFFER[i];
}

//------------------------------------------

//This function is intended to allow developers to
//make the speech engine spell out a message. Possible uses
//include (but are definitely not limited to) clarifying
//a specific word if it is unclear when spoken normally and 
//for spelling out abbreivations
//
//Makes the speech engine spell the "messagestring" 
//using the specified "pitch."
//
//"messagestring" is a text string.
//"pitch" can be any one of the following integer values:
//   -2 = very low
//   -1 = low
//    0 = normal
//    1 = high
//    2 = very high
//
//CLC_Spell will NOT interrupt the currently spoken string.
//
function CLC_Spell(messagestring, pitch) {
   if (CLC_TTS_ENGINE == 0) {
      return;
   }

   if ((pitch > 2) || (pitch < -2)) {
      alert("Invalid pitch");
      return;
   }

   if (CLC_TTS_ENGINE == 1) {
      pitch = (pitch * 25) + CLC_SPEAKJS_DefaultMiddle;
      
      // * TODO: Fix message text.
      // * TODO: Space out letters.

      CLC_SPEAKJS_Speak(
         messagestring,
         CLC_SPEAKJS_OBJ,
         { amplitude: CLC_SPEAKJS_DefaultVolume, pitch: pitch, speed: CLC_SPEAKJS_DefaultRate } //, voice: CLC_LANG }
      );
   }
}


//------------------------------------------
//This function is intended to allow developers to
//make the speech engine say a message that has immediate
//priority over everything else. Possible uses
//include (but are definitely not limited to) announcing
//events to the user and echoing back hotkey commands.
//
//Makes the speech engine say the "messagestring" 
//using the specified "pitch."
//
//"messagestring" is a text string.
//"pitch" can be any one of the following integer values:
//   -2 = very low
//   -1 = low
//    0 = normal
//    1 = high
//    2 = very high
//
//CLC_Shout WILL interrupt the currently spoken string.
//
function CLC_Shout(messagestring, pitch) {
   if (CLC_TTS_ENGINE == 0) {
      return;
   }

   if ((pitch > 2) || (pitch < -2)){
      alert("Invalid pitch");
      return;
   }

   if (CLC_TTS_ENGINE == 1) {
      pitch = (pitch * 25) + CLC_SPEAKJS_DefaultMiddle;
      
      // * TODO: Fix message text.
      // * TODO: Do some sort of priority magic.

      CLC_SPEAKJS_Speak(
         messagestring,
         CLC_SPEAKJS_OBJ,
         { amplitude: CLC_SPEAKJS_DefaultVolume, pitch: pitch, speed: CLC_SPEAKJS_DefaultRate } //, voice: CLC_LANG }
      );
   }
}

//------------------------------------------
//This function is intended to allow developers to
//make the speech engine "spell" a message that has immediate
//priority over everything else. Possible uses
//include (but are definitely not limited to) announcing
//keys that the user has typed. ShoutSpell should be used
//rather than Shout in order to announce punctuation.
//
//Makes the speech engine spell the "messagestring" 
//using the specified "pitch."
//
//"messagestring" is a text string.
//"pitch" can be any one of the following integer values:
//   -2 = very low
//   -1 = low
//    0 = normal
//    1 = high
//    2 = very high
//
//CLC_ShoutSpell WILL interrupt the currently spoken string.
//
function CLC_ShoutSpell(messagestring, pitch) {
   if (CLC_TTS_ENGINE == 0) {
      return;
   }

   if ((pitch > 2) || (pitch < -2)) {
      alert("Invalid pitch");
      return;
   }

   if (CLC_TTS_ENGINE == 1) {
      pitch = (pitch * 25) + CLC_SPEAKJS_DefaultMiddle;
      
      // * TODO: Fix message text.
      // * TODO: Space out letters.
      // * TODO: Do some sort of priority magic.

      CLC_SPEAKJS_Speak(
         messagestring,
         CLC_SPEAKJS_OBJ,
         { amplitude: CLC_SPEAKJS_DefaultVolume, pitch: pitch, speed: CLC_SPEAKJS_DefaultRate } //, voice: CLC_LANG }
      );
   }
}

//------------------------------------------
//Sets the synthesizer language. Whether this works depends on 
//whether the synthesizer supports the specified language.
//The specified language should be a string that represents a
//language using the same abbreviations as an HTML lang attribute.
//For example, use "ja" for Japanese and not jp, japan, etc. since ja
//is the proper value to use for a lang attribute in HTML.
//See http://www.w3.org/TR/html4/struct/dirlang.html
//
function CLC_SetLanguage(theLanguage) {
   CLC_LANG = theLanguage;
}

//------------------------------------------
//Sets the default pitch using the pitchValue and pitchMode.
//Currently, only mode 2 (enum) is supported.
//
function CLC_SetPitch(pitchValue, pitchMode) {
   if (pitchMode == 2) {
      CLC_SPEAKJS_DefaultMiddle = (pitchValue * 30) + 50;
   }
}

//------------------------------------------
//Sets the default rate using the rateValue and rateMode.
//Currently, only mode 2 (enum) is supported.
//
function CLC_SetRate(rateValue, rateMode) {
   if (rateMode == 2) {
      CLC_SPEAKJS_DefaultRate = (rateValue * 37.5) + 150;
   }
}
