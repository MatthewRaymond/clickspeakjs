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
 

//Last Modified Date 4/07/2016



//------------------------------------------

//Globals used by CLC-4-TTS
//These variables MUST NOT be touched by anyone using this library!
var CLC_LANG = "en/en-us";
var CLC_SPEAKJS_OBJ = new Object();
var CLC_TTS_HISTORY_BUFFER;
var CLC_TTS_HISTORY_BUFFER_MAXSIZE;
var CLC_BrowserSpeechEnabled = false;

var CLC_SPEAKJS_DefaultMiddle = 50;
var CLC_SPEAKJS_DefaultRate = 175;
var CLC_SPEAKJS_DefaultVolume = 100;

//------------------------------------------

//
//Returns true if initialized successfully; otherwise false.
//
function CLC_Init() {
  var returnValue = false;
	
  try {
	CLC_BrowserSpeechEnabled = typeof CLC_Window().speechSynthesis != 'undefined';
	
	if (!CLC_BrowserSpeechEnabled) {
	  var CLC_AudioContext = CLC_Window().AudioContext;
	  
	  CLC_SPEAKJS_Init();
      CLC_SPEAKJS_OBJ = new CLC_AudioContext();
      CLC_SPEAKJS_OBJ.source = null;
	}

    CLC_SPEAKJS_OBJ.Waiting = false;
    CLC_SPEAKJS_OBJ.Playing = false;
	
    // * Create history buffer.
    CLC_Make_TTS_History_Buffer(20);
	
    returnValue = true;
  } catch(err) { }

  return returnValue;
}


//------------------------------------------

//
// Resets the TTS engine.
//
function CLC_Reset() {
  var returnValue = false;

  try {
	var IsSpeechEnabled = typeof CLC_Window().speechSynthesis != 'undefined';
	
	if (CLC_BrowserSpeechEnabled != IsSpeechEnabled) {
	  CLC_BrowserSpeechEnabled = IsSpeechEnabled;
      CLC_Shutdown();
	  
	  if (CLC_BrowserSpeechEnabled) {
        CLC_SPEAKJS_OBJ = new Object();
	  } else {
        var CLC_AudioContext = CLC_Window().AudioContext;
	  
        CLC_SPEAKJS_Init();
        CLC_SPEAKJS_OBJ = new CLC_AudioContext();
        CLC_SPEAKJS_OBJ.source = null;
	  }

      CLC_SPEAKJS_OBJ.Waiting = false;
      CLC_SPEAKJS_OBJ.Playing = false;
	}
	
    returnValue = true;
  } catch(err) { }

  return returnValue;
}

//------------------------------------------

//Shuts down the speech engine.
//This function is a NOOP; deallocation is automatically handled
//by Firefox so developers do NOT actually need to free any memory 
//themselves. In fact, manual deallocation can be dangerous since
//it may deallocate it when some other extension still needs it.
//
function CLC_Shutdown() {
   CLC_Stop();
   
   if (!CLC_BrowserSpeechEnabled) {
	 CLC_SPEAKJS_Uninit();
   }
   
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
   return CLC_SPEAKJS_OBJ.Playing == false && CLC_SPEAKJS_OBJ.Waiting == false;
}

//------------------------------------------

//Globally stops all speakers.
//
function CLC_Interrupt() {
   sendSyncMessage(addOnID + ":CLC_Interrupt");
}


//------------------------------------------

//Cancels speech from the speech engine.
//
function CLC_Stop() {
  if (CLC_BrowserSpeechEnabled) {
    CLC_Window().speechSynthesis.cancel();
  } else {
	if (CLC_SPEAKJS_OBJ.Playing) {
      CLC_SPEAKJS_OBJ.source.stop();
      CLC_SPEAKJS_OBJ.source = null;
    }

    CLC_SPEAKJS_OBJ.Playing = false;
    CLC_SPEAKJS_OBJ.Waiting = false;
  }
}

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
  pitch = (pitch * 25) + CLC_SPEAKJS_DefaultMiddle;
  
  if (CLC_BrowserSpeechEnabled) {
    var SpeechSynthesisUtterance = CLC_Window().SpeechSynthesisUtterance;
    var utterance = new SpeechSynthesisUtterance(messagestring);

    CLC_SPEAKJS_OBJ.Waiting = true;
    CLC_SPEAKJS_OBJ.Playing = false;

    utterance.pitch = pitch;
    utterance.volume = CLC_SPEAKJS_DefaultVolume;
    utterance.speed = CLC_SPEAKJS_DefaultRate;
    utterance.lang = CLC_LANG;
    utterance.onstart = function() { CLC_SPEAKJS_OBJ.Playing = true; CLC_SPEAKJS_OBJ.Waiting = false; };
    utterance.onpause = function() { CLC_SPEAKJS_OBJ.Playing = false; };
    utterance.onresume = function() { CLC_SPEAKJS_OBJ.Playing = true; };
    utterance.onend = function() { CLC_SPEAKJS_OBJ.Playing = false; };
    //utterance.onerror = function() { CLC_SPEAKJS_OBJ.Playing = false; };

    CLC_Window().speechSynthesis.speak(utterance);
  } else {
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
  if (CLC_BrowserSpeechEnabled) {
    var SpeechSynthesisUtterance = CLC_Window().SpeechSynthesisUtterance;
    var utterance = new SpeechSynthesisUtterance(messagestring);

    CLC_SPEAKJS_OBJ.Waiting = true;
    CLC_SPEAKJS_OBJ.Playing = false;
  
    utterance.pitch = args.pitch;
    utterance.volume = args.amplitude;
    utterance.speed = args.speed;
    utterance.lang = args.voice;
    utterance.onstart = function() { CLC_SPEAKJS_OBJ.Playing = true; CLC_SPEAKJS_OBJ.Waiting = false; };
    utterance.onpause = function() { CLC_SPEAKJS_OBJ.Playing = false; };
    utterance.onresume = function() { CLC_SPEAKJS_OBJ.Playing = true; };
    utterance.onend = function() { CLC_SPEAKJS_OBJ.Playing = false; };
    //utterance.onerror = function() { CLC_SPEAKJS_OBJ.Playing = false; };

    CLC_Window().speechSynthesis.speak(utterance);
  } else {
	CLC_SPEAKJS_Speak(messagestring, CLC_SPEAKJS_OBJ, args);
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
  CLC_Say(contentstring, pitch);
  
  for(var i = CLC_TTS_HISTORY_BUFFER_MAXSIZE; i > 1; i--) {
    CLC_TTS_HISTORY_BUFFER[i - 1] = CLC_TTS_HISTORY_BUFFER[i - 2];
  }

  CLC_TTS_HISTORY_BUFFER[0] = contentobject;
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
