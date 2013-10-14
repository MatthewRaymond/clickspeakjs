//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Cursor
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
 

//Last Modified Date 11/09/2005



//------------------------------------------
//Turns on caret browsing mode
//
function CLC_CaretModeOn(){
   Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("").setBoolPref("accessibility.warn_on_browsewithcaret", false);
   Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("").setBoolPref("accessibility.browsewithcaret", true);
   }

//------------------------------------------
//This moves the caret (cursor used for caret 
//browsing) to the targetnode.
//
function CLC_MoveCaret(targ_DOMobj){
   if (!targ_DOMobj){
      return;
      }

   var cursor = CLC_Window().getSelection();
   var range = document.createRange();
   range.setStart(targ_DOMobj, 0); 
   range.setEnd(targ_DOMobj, 0);  
   cursor.collapse(targ_DOMobj, 0);  
   cursor.addRange(range);
   }

//------------------------------------------
//This will blur the targ_DOMobj completely.
//Sometimes, if the targ_DOMobj and all its 
//ancestors are not blurred, there may be a 
//problem with moving the caret with CLC_MoveCaret.
//
function CLC_BlurAll(targ_DOMobj){
   while(targ_DOMobj){
      if (targ_DOMobj.blur){
          targ_DOMobj.blur();
          }
      targ_DOMobj = targ_DOMobj.parentNode;
      }   
   }

//------------------------------------------
//This will select the sentence found in targ_DOMobj which is
//targ_sentenceArray[targ_sentenceArrayIndex].
//This function assumes that targ_sentenceArray was created from
//targ_DOMobj, and that targ_sentenceArrayIndex is within range.
//
//
function CLC_SelectSentence(targ_DOMobj, targ_sentenceArray, targ_sentenceArrayIndex){
   try{
      //Find the start point
      var startPoint = 0;
      for (var i=0; i<targ_sentenceArrayIndex; i++){
         startPoint = startPoint + targ_sentenceArray[i].length;
         }

      //Find the end point
      var endPoint = startPoint + targ_sentenceArray[targ_sentenceArrayIndex].length;

      //Create the range
      var range = document.createRange();
      range.setStart(targ_DOMobj, startPoint); 
      range.setEnd(targ_DOMobj, endPoint); 

      //Create the cursor
      var cursor = CLC_Window().getSelection();
      cursor.collapse(targ_DOMobj, 0);   
      cursor.addRange(range);
      }
   catch(e){}
   }


//------------------------------------------
//Returns the index of the sentence that the cursor is on.
//This function assumes that targ_sentenceArray was created from
//the DOMobj that the cursor is currently on; this is being used rather 
//than automatically trying to detect the DOMobj in order to:
//1. Be more general and not restrict DOMobj to being just Atomic DOM objects only 
//(eventhough "Atomic" will be the most likely type used)
//and 
//2. To reduce the number of places that need to be fixed when the next Firefox 
//update breaks the behavior of retrieving Atomic DOM objects from the cursor position.
//
function CLC_FindSentenceArrayIndexOfCursorPos(targ_sentenceArray){
   try{
      //Find the cursor's offset
      var cursor = CLC_Window().getSelection();
      var offset = cursor.anchorOffset;
      for (var i=0; i<targ_sentenceArray.length; i++){
         offset = offset - targ_sentenceArray[i].length;
         if (offset < 0){
            return i;
            }
         }
      return -1;
      }
   catch(e){}
   return -1;   
   }







