//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Text Manipulation
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
 

//Last Modified Date 2/24/2006



//------------------------------------------
//Returns the index value of the first occurrence of
//the "target" character in the specified
//"text" string.
//
//If the "target" character is not in the "text"
//string, this function will return -1.
//
//This is useful if you want to break a paragraph
//up into sentences. You could use findCharacter
//to locate the '.' and then use the splitText function
//(the Firefox Javascript DOM has splitText by default)
//and passing in the return value of findCharacter + 1
//to split it after the '.'
//
function CLC_FindCharacter(text, target){
     if (!text){
        alert("Invalid text string");
        return -1;
        }
     if (!target){
        alert("Invalid target");
        return -1;
        }
     var count = 0;
     while((text[count] != target) && (text[count])){
         count++;
         }
     if (text[count]){
         return count;
         }
     return -1;
     }


//------------------------------------------
//Returns the selected text in the browser window
//
function CLC_GetSelectedText(){
     var text = CLC_Window().getSelection().toString();
     return text;
     }

//------------------------------------------
//Evaluates a character to see if it is speakable
//or not. Returns true if speakable; else false.
//"Speakable" is defined by the list of known
//unspeakable characters. If it is not in the list,
//it is considered speakable.
//
function CLC_IsSpeakableChar(targ_char){
   //Using escape characters when possible
   if (  targ_char == '\n' ||            //New line
         targ_char == ' '  ||            //Space
         targ_char == '\t' ||            //Tab
         targ_char == '\v' ||            //Vertical Tab
         targ_char == '\\' ||            //The \ symbol
         targ_char == '\r'               //Carriage return
       ){
      return false;
      }
   //Using the charCode when there is no escape character
   if (  targ_char.charCodeAt(0) == 160       //nbsp
      ){
      return false;
      }
   return true;
   }




//------------------------------------------
//Evaluates target DOM object to see if it 
//really has text content.
//Returns true if it does; else false.
//Images without an alt attribute at all, are
//treated as having text in order to alert users
//to their presence.
//Inputs are always considered to have text content.
//
//Use CLC_GetTextContent to generate the content string.
//
function CLC_HasText(target){
   //Do not try to read metadata in the head
   if (target.localName && (target.localName.toLowerCase() == "head") ) {
      return false;
      }
   //Script elements are for the computer, not the human - they never have text
   if (target.localName && (target.localName.toLowerCase() == "script") ) {
      return false;
      }
  //Ignore visibility=hidden/display=none nodes
  if (target.nodeType == 1){
    var style = CLC_Window().getComputedStyle(target, '');
    if ((style.display == 'none') || (style.visibility == 'hidden')){
       return false;
       }
     }
  if (target.parentNode && target.parentNode.nodeType == 1){
    var style = CLC_Window().getComputedStyle(target.parentNode, '');
    if ((style.display == 'none') || (style.visibility == 'hidden')){
       return false;
       }
     }
   //Input roles are always considered to have text content
   if (CLC_RoleIsInput(target)) {
      return true;
      }     
   //Inputs are always considered to have text content unless they are hidden
   if (target.localName && (target.localName.toLowerCase() == "input") ) {
      if (target.type.toLowerCase() == "hidden"){
         return false;
         }
      return true;
      }     
   //Select boxes are always considered to have text content unless they are hidden
   if (target.localName && (target.localName.toLowerCase() == "select") ) {
      if (target.type.toLowerCase() == "hidden"){
         return false;
         }
      return true;
      }    
   //Text areas are always considered to have text
   if (target.localName && (target.localName.toLowerCase() == "textarea") ) {
      return true;
      }
   if (target.parentNode && target.parentNode.localName && (target.parentNode.localName.toLowerCase() == "textarea") ) {
      return true;
      }
   //Iframes should have text, but textContent can't be used to check them.
   //Even if there is no text, users should be alerted to their presence.
   if (target.localName && (target.localName.toLowerCase() == "iframe") ) {
      return true;
      }
   //Handling images
   if (target.localName && (target.localName.toLowerCase() == "img") && target.hasAttribute("alt")){
      return CLC_IsSpeakableString(target.alt);
      }
   if (CLC_GetRoleStringOf(target) == "img"){
      return CLC_IsSpeakableString(CLC_GetTextContentFromRole(target));
      }
   //Make an exception for images which do not have the alt attribute
   if (target.localName && (target.localName.toLowerCase() == "img") && !target.hasAttribute("alt")){
      return true;
      }
   if (!target.textContent){
      return false;
      }
   return CLC_IsSpeakableString(target.textContent);
   }


//------------------------------------------
//Returns the rest of the textstring after the 
//first occurrence of the marker character
//
function CLC_GetTextAfterMarker(textstring, marker){
   var cutpoint = CLC_FindCharacter(textstring, marker);
   if (cutpoint == -1){
      return "";
      }
   return textstring.substring(cutpoint+1,textstring.length);
   }


//------------------------------------------
//Returns true if target is an uppercase character; else false.
//
function CLC_IsUpper(target){
   if ( target == '+' || target == '\\' || 
        target == '*' || target == '[' || 
        target == '(' ){
      return false;
      }
   var upperletters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   if (upperletters.search(target) != -1){
      return true;
      }
   return false;
   }

//------------------------------------------
function CLC_IsSpeakableString(target){
   for (var i=0; i < target.length; i++){
      if ( CLC_IsSpeakableChar(target[i]) ){
         return true;
         }
      }
   return false;
   }

//------------------------------------------
function CLC_StringIsAllNumber(target){
   for (var i=0; i < target.length; i++){
      if ( (target[i] < '0') || (target[i] > '9') ) {
         return false;
         }
      }
   return true;
   }



//------------------------------------------
function CLC_RemoveSpaces(target){
   var strippedstring = "";
   for (i=0; i < target.length; i++) {
      if (target.charAt(i) != '\n' &&
          target.charAt(i) != '\r' &&
          target.charAt(i) != '\t' &&
          target.charAt(i) != ' ')    {
         strippedstring = strippedstring + target.charAt(i);
         }
      }
   return strippedstring;
   }
//------------------------------------------
function CLC_RemoveLeadingSpaces(target){
   var strippedstring = target;
   while ( (strippedstring.charAt(0) == '\n') || 
           (strippedstring.charAt(0) == '\r') || 
           (strippedstring.charAt(0) == '\t') || 
           (strippedstring.charAt(0) == ' ')    ){
          strippedstring = strippedstring.substring(1, strippedstring.length);
          }
   return strippedstring;
   }

//------------------------------------------
//Returns true if target is a lowercase character; else false.
//
function CLC_IsLower(target){
   if ( target == '+' || target == '\\' || 
        target == '*' || target == '[' || 
        target == '(' ){
      return false;
      }
   var upperletters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   var lowerletters = upperletters.toLowerCase();
   if (lowerletters.search(target) != -1){
      return true;
      }
   return false;
   }
//------------------------------------------

