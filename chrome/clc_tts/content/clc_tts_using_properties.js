//Copyright (C) 2008 Google Inc.
//CLC-4-TTS Firefox Extension:
//Core Library Components for Text-To-Speech for Firefox
//by Charles L. Chen

 
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


//For all the functions that use properties:
//"speechProperties_array" is an array of arrays of two integers, 
//the first integer being the value and the second integer 
//being the mode.
//"additionalProperties_array" is an array of text strings.
//
//In general, "speechProperties_array" are those that 
//have a predefined number of values that can be 
//quantified along with a mode. A good example would be 
//the pitch. It can be treated as absolute (an absolute 
//pitch of 120 KHz), a percentage (120% of the default),
//or an enumeration (-2 as xlow, -1 as low, 0 as normal,
//1 as high, 2 as xhigh).
//
//In general, "additionalProperties_array" are those that 
//which can not be enumerated. 
//At this point, I am still not completely sure if I can
//fully enumerate the speech family (for example, what if
//there is a request for a particular voice by name?),
//so I am just going to have this in as an escape hatch.
//
//The standard modes are:
//-1 = undefined; this is used to indicate that a 
//     property should be skipped
// 0 = absolute
// 1 = percentage (assumes % sign: 50% is integer 50, etc.)
// 2 = enumeration (0 is the medium level, negative numbers 
//     for lower, positive numbers for higher - total number 
//     of levels are same as defined in CSS)
//
//The boolean modes are:
//-1 = undefined; this is used to indicate that a 
//     property should be skipped
// 0 = boolean: value of 1 is true, else false.
//
//Since this is a work in progress, to avoid forcing people
//who use this function to modify their programs any time
//a new speech property is added, the properties will
//be processed in the following defined order:
//0 = pitch; standard modes
//1 = pitch range; standard modes
//2 = speaking rate; standard modes
//3 = volume; standard modes
//4 = spell out; boolean modes
//
//The property lists may be shorter than defined; any
//property that is past the end of the given array will 
//simply have its default value used. 

function CLC_GenerateSpeakJSArrayWithProperties(speechProperties_array, additionalProperties_array)
{
   var pitch = CLC_SPEAKJS_DefaultMiddle;
   var rate = CLC_SPEAKJS_DefaultRate;
   var volume = CLC_SPEAKJS_DefaultVolume;

   //Set pitch
   if (speechProperties_array.length > 0){
      //Make sure pitch property was valid
      if (speechProperties_array[0].length == 2) {
         switch (speechProperties_array[0][1]) {
            case 0: //Absolute 
               pitch = speechProperties_array[0][0];      
               break;
            case 1: //Percentage 
               pitch = (speechProperties_array[0][0] / 100) * CLC_SPEAKJS_DefaultMiddle; 
               pitch = Math.round(pitch);
               break;
            case 2: //Enumeration
               if ((speechProperties_array[0][0] < 3) && (speechProperties_array[0][0] > -3)) {
                  pitch = (speechProperties_array[0][0] * 25) + CLC_SPEAKJS_DefaultMiddle;
               }

               break;
            default:
               break;
         }
      }
   }

   //Set rate
   if (speechProperties_array.length > 2) {
      //Make sure rate property was valid
      if (speechProperties_array[2].length == 2) {
         switch (speechProperties_array[2][1]) {
            case 0: //Absolute - No absolute for rate since it is not defined in CSS3
               break;
            case 1: //Percentage
               rate = (speechProperties_array[2][0] / 100) * CLC_SPEAKJS_DefaultRate;
               rate = Math.round(rate);
               break;
            case 2://Enumeration
               if ((speechProperties_array[2][0] < 3) && (speechProperties_array[2][0] > -3)){
                  rate = (CLC_SPEAKJS_DefaultRate / 4) * speechProperties_array[2][0];
                  rate += CLC_SPEAKJS_DefaultRate;
               }

               break;
            default:
               break;
         }
      }
   }

   //Set volume
   if (speechProperties_array.length > 3){
      //Make sure volume property was valid
      if (speechProperties_array[3].length == 2) {
         switch (speechProperties_array[3][1]) {
            case 0: //Absolute 
               volume = speechProperties_array[3][0] / 100; 
               break;
            case 1: //Percentage
               volume = Math.round((speechProperties_array[3][0] / 100) * CLC_SPEAKJS_DefaultVolume); 
               break;
            case 2: //Enumeration
               if (speechProperties_array[3][0] == -3){
                  volume = 0;
               } else if ((speechProperties_array[3][0] < 3) && (speechProperties_array[3][0] > -4)){
                  volume = speechProperties_array[3][0] * (CLC_SPEAKJS_DefaultVolume / 6);
                  volume += (CLC_SPEAKJS_DefaultVolume * 3) / 4;
               }

               break;
            default:
               break;
         }
      }
   }

   var retParam

   if (CLC_BrowserSpeechEnabled) {
     retParam = {
       "amplitude": volume,
       "pitch": pitch,
       "speed": rate,
       "voice": CLC_LANG
     };
   } else {
     retParam = {
       "amplitude": volume,
       "pitch": pitch,
       "speed": rate
     };
   }
   
   return retParam;
}

//------------------------------------------
//
//This function is intended to allow developers to
//make the speech engine say a message. Possible uses
//include (but are definitely not limited to) announcing
//events to the user and echoing back hotkey commands.
//
//Makes the speech engine say the "messagestring" 
//using the specified "speech_properties" and 
//"additional_properties". 
//
//"messagestring" is a text string.
//
//CLC_SayWithProperties will NOT interrupt the currently spoken string.
//
function CLC_SayWithProperties(
  messagestring,
  speechProperties_array,
  additionalProperties_array
) {
  CLC_Say_Direct(
    messagestring,
    CLC_GenerateSpeakJSArrayWithProperties(speechProperties_array, additionalProperties_array)
  );
}


//------------------------------------------
//
//This function is intended to allow developers to
//make the speech engine read content displayed within the 
//browser. The object that generated the string is stored
//to allow users to go back to the last object that was read.
//
//Makes the speech engine read the "contentstring" 
//using the specified "pitch." It also stores the "contentobject"
//in a history buffer of the most recently read objects.
//
//"contentobject" should be the object on the page that generated the "contentstring"
//
//CLC_ReadWithProperties will NOT interrupt the currently spoken string.
//
function CLC_ReadWithProperties(
  contentobject,
  messagestring,
  speechProperties_array,
  additionalProperties_array
) {
  CLC_SayWithProperties(messagestring, speechProperties_array, additionalProperties_array);

  for(var i = CLC_TTS_HISTORY_BUFFER_MAXSIZE; i > 1; i--) {
    CLC_TTS_HISTORY_BUFFER[i - 1] = CLC_TTS_HISTORY_BUFFER[i - 2];
  }

  CLC_TTS_HISTORY_BUFFER[0] = contentobject;

  return;
}


//------------------------------------------
//This function is intended to allow developers to
//make the speech engine say a message that has immediate
//priority over everything else. Possible uses
//include (but are definitely not limited to) announcing
//events to the user and echoing back hotkey commands.
//
//CLC_ShoutWithProperties WILL interrupt the currently spoken string.
//
function CLC_ShoutWithProperties(
  messagestring,
  speechProperties_array,
  additionalProperties_array
) {
  CLC_Say_Direct(
    messagestring,
    CLC_GenerateSpeakJSArrayWithProperties(speechProperties_array, additionalProperties_array)
  );
}
