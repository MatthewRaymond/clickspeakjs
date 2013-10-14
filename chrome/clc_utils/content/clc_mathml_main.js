//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Math ML Content System - Main
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
 

//Last Modified Date 3/9/2005

//These functions are for finding the appropriate text content that
//is associated with a given MathML object.
//

//------------------------------------------
//Globals

//Store all parts of the current Math ML object to allow for 
//fine grained control over what is being read back
var CLC_MathML_PartsOfMathObj = new Array();

//Mode to use for the various math messages
//  0 == Verbose Nemeth
var CLC_MathML_Mode = 0;

//Number format - read numbers one digit at a time or together
//  0 == One digit at a time: 100 -> one zero zero
//  1 == All digits of a number read together: 100 -> one hundred
var CLC_MathML_NumFormat = 0;

//------------------------------------------
//Messages

var CLC_MathML_Begin_Msg = " Begin ";
var CLC_MathML_Fraction_Msg = " Fraction ";
var CLC_MathML_Over_Msg = " Over ";
var CLC_MathML_End_Msg = " End ";
var CLC_MathML_Radical_Msg = " Radical "
var CLC_MathML_Sub_Msg = " Sub ";
var CLC_MathML_Sup_Msg = " Soup ";
var CLC_MathML_Base_Msg = " Base ";
var CLC_MathML_Under_Msg = " Under ";
var CLC_MathML_Script_Msg = " Script ";



//------------------------------------------
//Returns a string that is the Math ML in text form.
//
//The text generated is based on the MATHSPEAK method 
//proposed by Dr. A. Nemeth.
//
function CLC_GetMathMLContent(target){
  CLC_MathML_PartsOfMathObj = new Array();
  for (var i = 0; i < target.childNodes.length; i++){
     if (CLC_MathML_Mode == 0){
        if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
           CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
           }
        }
     }
  var mathstring = "";
  for (var i = 0; i < CLC_MathML_PartsOfMathObj.length; i++){
     mathstring = mathstring + CLC_MathML_PartsOfMathObj[i];
     }
  return mathstring;
  }


//------------------------------------------
//Processes the MathML object by pushing the appropriate
//strings onto the CLC_MathML_PartsOfMathObj array.
//
//The logic followed is the Verbose Nemeth MathSpeak scheme.
//
//This function is recursive and assumes that only targets 
//with textContent are passed to it.
//
function CLC_MathML_ProcessMathNode_Mode0(target){
   if (!target.firstChild){
      CLC_MathML_MathCharProcessor(target.textContent);
      return;
      }


   //Handle Text - add it as a whole string, do not split mtext
   if (target.tagName && target.tagName.toLowerCase() == "mtext"){
      CLC_MathML_AddMsg(1, target.textContent);
      return;
      }   

   //Handle Fractions
   if (target.tagName && target.tagName.toLowerCase() == "mfrac"){
      var depth = CLC_MathML_FindFractionDepth(target);
      CLC_MathML_AddMsg(depth, CLC_MathML_Begin_Msg);
      CLC_MathML_AddMsg(1, CLC_MathML_Fraction_Msg);
      var i = 0;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }
      CLC_MathML_AddMsg(depth, CLC_MathML_Over_Msg);
      i++;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }
      CLC_MathML_AddMsg(depth, CLC_MathML_End_Msg);
      CLC_MathML_AddMsg(1, CLC_MathML_Fraction_Msg);
      return;
      }

   //Handle Radicals
   if (target.tagName && target.tagName.toLowerCase() == "msqrt"){
      var depth = CLC_MathML_FindRadicalDepth(target);
      CLC_MathML_AddMsg(depth, CLC_MathML_Begin_Msg);
      CLC_MathML_AddMsg(1, CLC_MathML_Radical_Msg);
      for (var i = 0; i < target.childNodes.length; i++){
         if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
            CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
            }
          }
      CLC_MathML_AddMsg(depth, CLC_MathML_End_Msg);
      CLC_MathML_AddMsg(1, CLC_MathML_Radical_Msg);
      return;
      }

   //Handle Superscript or Subscript (msub or msup)
   if (  target.tagName && 
        (target.tagName.toLowerCase() == "msub" || target.tagName.toLowerCase() == "msup")){
      var i = 0;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }

      i++;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         var path = CLC_MathML_FindSubSupPath(target);
         CLC_MathML_AddMsg(1, path);
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }
      if ( CLC_MathML_RetToBase(target) ){
         CLC_MathML_AddMsg(1, CLC_MathML_Base_Msg);
         }
      return;
      }

   //Handle Superscript AND Subscript (msubsup)
   if (  target.tagName && (target.tagName.toLowerCase() == "msubsup")){
      //Main part
      var i = 0;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }
      //Subscript part
      i++;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         var path = CLC_MathML_FindSubSupPath(target.childNodes[i]);
         CLC_MathML_AddMsg(1, path);
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }
      //Superscript part
      i++;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         var path = CLC_MathML_FindSubSupPath(target.childNodes[i]);
         CLC_MathML_AddMsg(1, path);
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }
      if ( CLC_MathML_RetToBase(target) ){
         CLC_MathML_AddMsg(1, CLC_MathML_Base_Msg);
         }
      return;
      }


   //Handle Underscript or Overscript (munder or mover)
   if (  target.tagName && 
        (target.tagName.toLowerCase() == "munder" || target.tagName.toLowerCase() == "mover")){
      var i = 0;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }

      i++;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         var path = CLC_MathML_FindUnderOverPath(target);
         CLC_MathML_AddMsg(1, path);
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }
      if ( CLC_MathML_EndScriptBase(target) ){
         CLC_MathML_AddMsg(1, CLC_MathML_End_Msg + CLC_MathML_Script_Msg);
         }
      return;
      }


   //Handle Underscript AND Overscript (munderover)
   if (  target.tagName && (target.tagName.toLowerCase() == "munderover")){
      //Main part
      var i = 0;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }
      //Underscript part
      i++;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         var path = CLC_MathML_FindUnderOverPath(target.childNodes[i]);
         CLC_MathML_AddMsg(1, path);
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }
      //Overscript part
      i++;
      while(target.childNodes[i].nodeType != 1){
         i++;
         }
      if (CLC_IsSpeakableString(target.childNodes[i].textContent)){
         var path = CLC_MathML_FindUnderOverPath(target.childNodes[i]);
         CLC_MathML_AddMsg(1, path);
         CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
         }
      if ( CLC_MathML_EndScriptBase(target) ){
         CLC_MathML_AddMsg(1, CLC_MathML_End_Msg + CLC_MathML_Script_Msg);
         }
      return;
      }

   for (var i = 0; i < target.childNodes.length; i++){
      CLC_MathML_ProcessMathNode_Mode0(target.childNodes[i]);
      }
   }

//------------------------------------------
//Processes each MathML character by changing each to a string and
//pushing this string onto the CLC_MathML_PartsOfMathObj array.
//
function CLC_MathML_MathCharProcessor(target){
   if (CLC_StringIsAllNumber(target) && (CLC_MathML_NumFormat == 1)){
      CLC_MathML_AddMsg(1, target);
      return;
      }
   var spokenstring = " ";
   for (var i = 0; i < target.length; i++){
      tempstring = target[i];
      spokenstring = spokenstring + CLC_MathML_CharacterToString(tempstring) + " ";
      }
   CLC_MathML_AddMsg(1, spokenstring);
   }


//------------------------------------------
//Pushes the message onto the array for the specified number of times
//
function CLC_MathML_AddMsg(times, msg){
  for (var i = 0; i < times; i++){
     CLC_MathML_PartsOfMathObj.push(msg);
     }
   }

//------------------------------------------
//Finds the depth of the fractions inside the target fraction.
//If there are no other fractions, it has a depth of 1.
//
//Note: If a fraction inside the target fraction were only inside
//of it indirectly for example, a fraction used as a super script, 
//this code would cause the depth to increment by 1. 
//Is this the correct behavior for Nemeth code?
//
function CLC_MathML_FindFractionDepth(target){
   var deepest = 0;
   innerfracs = target.getElementsByTagName("mfrac");
   for (var i = 0; i < innerfracs.length; i++){
      var tempObj = innerfracs[i];
      var candidate = 1;
      while (tempObj.parentNode != target){
         tempObj = tempObj.parentNode;
         if (tempObj.tagName && tempObj.tagName.toLowerCase() == "mfrac"){
            candidate = candidate + 1;
            }
          }
      if (candidate > deepest){
          deepest = candidate;
          }
      }
   return deepest + 1;
   }

//------------------------------------------
//Finds the depth of the radicals inside the target radical.
//If there are no other radicals, it has a depth of 1.
//
//Note: If a radical inside the target fraction were only inside
//of it indirectly for example, a radical used as a super script, 
//this code would cause the depth to increment by 1. 
//Is this the correct behavior for Nemeth code?
//
function CLC_MathML_FindRadicalDepth(target){
   var deepest = 0;
   innerrads = target.getElementsByTagName("msqrt");
   for (var i = 0; i < innerrads.length; i++){
      var tempObj = innerrads[i];
      var candidate = 1;
      while (tempObj.parentNode != target){
         tempObj = tempObj.parentNode;
         if (tempObj.tagName && tempObj.tagName.toLowerCase() == "sqrt"){
            candidate = candidate + 1;
            }
          }
      if (candidate > deepest){
          deepest = candidate;
          }
      }
   return deepest + 1;
   }


//------------------------------------------
//Finds the sequence of sub/sup to reach the current sub/sup element
//
function CLC_MathML_FindSubSupPath(target){
   var keepgoing = true;
   var tempnode = target;
   var path = new Array();
   while (keepgoing){
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "msub"){
         path.push(CLC_MathML_Sub_Msg);
         }
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "msup"){
         path.push(CLC_MathML_Sup_Msg);
         }
      if (tempnode.parentNode && tempnode.parentNode.tagName && tempnode.parentNode.tagName.toLowerCase() == "msubsup"){
         var position = CLC_MathML_FindChildNodePos(tempnode);
         if (position == 2){
            path.push(CLC_MathML_Sub_Msg);
            }
         else if (position == 3){
            path.push(CLC_MathML_Sup_Msg);
            }
         }
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "math"){
         keepgoing = false;
         }
      tempnode = tempnode.parentNode;
      }
   path.reverse();
   var pathstring = "";
   for (var i=0; i < path.length; i++){
      pathstring = pathstring + path[i];
      }
   return pathstring;
   }



//------------------------------------------
//Determines if it is time to return to base from sub/sup
//
function CLC_MathML_RetToBase(target){
   var tempnode = target;
   while (tempnode.parentNode && tempnode.parentNode.tagName && tempnode.parentNode.tagName != "math"){
      tempnode = tempnode.parentNode;
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "msub"){
         return false;
         }
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "msup"){
         return false;
         }
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "msubsup"){
         return false;
         }
      }
   return true;
   }

//------------------------------------------
//Determines the target childNode's position within its parent.
//In MathML, this is critical because it determines WHAT the
//childNode's meaning is. For example, with msubsup, the 1st
//position is reserved for the main element, the 2nd position 
//is for the subscript to that element, and the 3rd position
//is the superscript.
//
//Note: Contrary to intuition, the position cannot be determined from index!
//If target == parentNode.childNodes[i], i does not have to be the position! 
//This is because there are sometimes blank empty nodes of text type 
//interspersed between the true childNodes.
//Hence the index value is not particularly helpful in this case.
//
//Positions start at 1. If 0 is returned as the pos, then there has been some error.
//
function CLC_MathML_FindChildNodePos(target){
   var pnode = target.parentNode;
   var i = 0;
   var pos = 1;
   while (pnode.childNodes.length > i){
      while(pnode.childNodes[i].nodeType != 1){
         i++;
         if ( !(pnode.childNodes.length > i) ){
            return 0;
            }
         }
      if (pnode.childNodes[i] == target){
         return pos;
         }
      i++;
      pos++;
      }
   return 0;
   }

//------------------------------------------
//Finds the sequence of under/over to reach the current under/over element
//
function CLC_MathML_FindUnderOverPath(target){
   var keepgoing = true;
   var tempnode = target;
   var path = new Array();
   while (keepgoing){
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "munder"){
         path.push(CLC_MathML_Under_Msg);
         }
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "mover"){
         path.push(CLC_MathML_Over_Msg);
         }
      if (tempnode.parentNode && tempnode.parentNode.tagName && tempnode.parentNode.tagName.toLowerCase() == "munderover"){
         var position = CLC_MathML_FindChildNodePos(tempnode);
         if (position == 2){
            path.push(CLC_MathML_Under_Msg);
            }
         else if (position == 3){
            path.push(CLC_MathML_Over_Msg);
            }
         }
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "math"){
         keepgoing = false;
         }
      tempnode = tempnode.parentNode;
      }
   path.reverse();
   path.push(CLC_MathML_Script_Msg);
   var pathstring = "";
   for (var i=0; i < path.length; i++){
      pathstring = pathstring + path[i];
      }
   return pathstring;
   }

//------------------------------------------
//Determines if it is time to end the under/over scripts
//
function CLC_MathML_EndScriptBase(target){
   var tempnode = target;
   while (tempnode.parentNode && tempnode.parentNode.tagName && tempnode.parentNode.tagName != "math"){
      tempnode = tempnode.parentNode;
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "munder"){
         return false;
         }
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "mover"){
         return false;
         }
      if (tempnode.tagName && tempnode.tagName.toLowerCase() == "munderover"){
         return false;
         }
      }
   return true;
   }

//------------------------------------------
