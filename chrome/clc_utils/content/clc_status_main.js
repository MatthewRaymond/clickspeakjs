//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Element Content System - Main
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
 

//Last Modified Date 3/17/2015

//These functions are for finding the appropriate text content that
//is associated with a given atomic DOM object.
//
//Any atomic object with content will have the following 3 types of 
//data associated with it:
//1. ID (Primary and Secondary)  <--Language dependent, identifies the element. 
//                                  Secondary content may contain info included
//                                  in the other types of data as well.
//2. Content                     <--Text content associated in the object from 
//                                  the page itself, no addtional text is added.
//3. Status                      <--Language dependent, based on what the user 
//                                  has done to the element.
//
//While all atomic objects have these things, they *may* be null strings.
//


//Defines the language for status messages about HTML elements
//0 = No language (No information will be generated)
//1 = English (Default)
var CLC_StatusLang = 1;

//------------------------------------------
//Returns a string that is the status which
//should be associated with the target DOM object.
//The target DOM object should be an atomic DOM object.
//
//So far, only input elements will have status
//
function CLC_GetStatus(target){
  if (!target){
     return "";
     }
  var statusFromRole = '';
  if (CLC_GetRoleStringOf(target)){
     statusFromRole = CLC_GetStatusFromRole(target);
     }
  if (statusFromRole){
     return statusFromRole;
     }
  if (target.tagName && (target.tagName == "textarea" || target.tagName == "TEXTAREA")) {
     return CLC_Status_TextArea(target);
     }
  if (target.parentNode && target.parentNode.tagName && (target.parentNode.tagName == "textarea" || target.parentNode.tagName == "TEXTAREA")) {
     return CLC_Status_TextArea(target.parentNode);
     }
  if (target.tagName && (target.tagName == "select" || target.tagName == "SELECT")){
     return CLC_Status_Select(target);
     }
  if (!target.tagName){
     return "";
     }
  if (!(target.tagName == "input" || target.tagName == "INPUT")) {
     return "";
     }
  if (target.type == "radio" || target.type == "RADIO") {
     return CLC_Status_RadioButton(target);
     }
  if (target.type == "text" || target.type == "TEXT") {
     return CLC_Status_TextBlank(target);
     }
  if (target.type == "password" || target.type == "PASSWORD") {
     return CLC_Status_PasswordBlank(target);
     }
  if (target.type == "checkbox" || target.type == "CHECKBOX") {
     return CLC_Status_Checkbox(target);
     }
  return "";
  }



//------------------------------------------
//Returns a string that indicates the status of the
//target radio button DOM obj.
//
function CLC_Status_RadioButton(target){
  //English
   if (CLC_StatusLang == 1){
      if (target.checked == false){
         return "Not checked";
         }
      return "Checked";
      }
  //French
   if (CLC_StatusLang == 2){
      if (target.checked == false){
         return "non coché";
         }
      return "coché";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
//Returns a string that indicates the status of the
//target text blank DOM obj.
//
function CLC_Status_TextBlank(target){
  //English
   if (CLC_StatusLang == 1){
      if (target.value == ""){
         return "The text field is empty.";
         }
      return target.value;
      }
  //French
   if (CLC_StatusLang == 2){
      if (target.value == ""){
         return "vide.";
         }
      return target.value;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }


//------------------------------------------
//Returns the number of characters entered into the
//target password blank DOM obj. Do NOT read back the password!
//
function CLC_Status_PasswordBlank(target){
  //English
   if (CLC_StatusLang == 1){
      return target.value.length + " characters have been typed.";
      }
  //French
   if (CLC_StatusLang == 2){
      return target.value.length + " caractères ont été saisis.";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
//Returns a string that indicates the status of the
//target checkbox DOM obj.
//
function CLC_Status_Checkbox(target){
  //English
   if (CLC_StatusLang == 1){
      if (target.checked == false){
         return "Not checked";
         }
      return "Checked";
      }
  //French
   if (CLC_StatusLang == 2){
      if (target.checked == false){
         return "non coché";
         }
      return "coché";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
//Returns a string that indicates the status of the
//target text area DOM obj.
//
function CLC_Status_TextArea(target){
   var text = target.value;
  //English
   if (CLC_StatusLang == 1){
      if (!text){
         return "The text area is empty.";
         }
      return text;
      }
  //French
   if (CLC_StatusLang == 2){
      if (!text){
         return "vide.";
         }
      return text;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
//Returns a string that indicates the status of the
//target select DOM obj.
//
function CLC_Status_Select(target){
   var text = CLC_GetTextContent(target.options[target.selectedIndex]);
  //English
   if (CLC_StatusLang == 1){
      if (!text){
         return "There is no option selected.";
         }
      return text;
      }
  //French
   if (CLC_StatusLang == 2){
      if (!text){
         return "There is no option selected.";
         }
      return text;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }


//------------------------------------------
//Returns the status of WAI-ARIA widgets
//

function CLC_GetStatusFromRole(target){
  if (!target){
    return "";
    }
  var statusString = "";

  //Resort to using the namespaced version if there is no hasAttribute
  if (!target.hasAttribute){
    return CLC_GetNSStatusFromRole(target);
    }

  var theRole = CLC_GetRoleStringOf(target);

  //aria-checked
  if (target.hasAttribute('aria-checked')){
    if (target.getAttribute('aria-checked').toLowerCase() == "true"){
      statusString = statusString + "Checked. ";
      }
    else if (target.getAttribute('aria-checked').toLowerCase() == "mixed"){
      statusString = statusString + "Mixed. ";
      }
    else {
      statusString = statusString + "Not checked. ";
      }
    }

  //aria-valuenow
  if (target.hasAttribute('aria-valuenow')){
    statusString = statusString + "Current value: " + target.getAttribute('aria-valuenow') + ". ";
    }

  //aria-activedescendant
  if (target.hasAttribute('aria-activedescendant')){
    var theActiveDescendantID = target.getAttribute('aria-activedescendant');
    var activeDescendant = CLC_Window().document.getElementById(theActiveDescendantID);
    statusString = statusString + CLC_GetTextContentOfAllChildren(activeDescendant);
    }

  if (!statusString){
    return CLC_GetNSStatusFromRole(target);
    }

  return statusString;
  }


function CLC_GetNSStatusFromRole(target){
  if (!target){
    return "";
    }
  var statusString = "";

  //Resort to using the namespaced version if there is no hasAttribute
  if (!target.hasAttributeNS){
    return "";
    }
  var theRole = CLC_GetRoleStringOf(target);

  if (target.hasAttributeNS("http://www.w3.org/2005/07/aaa", "checked")){
    var checkedStatus = target.getAttributeNS("http://www.w3.org/2005/07/aaa", "checked").toLowerCase();
    if (checkedStatus == "true"){
      statusString = statusString + "Checked. ";
      }
    else if (checkedStatus == "mixed"){
      statusString = statusString + "Mixed. ";
      }
    else{
      statusString = statusString + "Not checked. ";
      }
    }

  if (target.hasAttributeNS("http://www.w3.org/2005/07/aaa", "valuenow")){
    status = status + "Current value: " + target.getAttributeNS("http://www.w3.org/2005/07/aaa", "valuenow") + ". ";
    }

  if (target.getAttributeNS("http://www.w3.org/2005/07/aaa", "activedescendant")){
    var theActiveDescendantID = target.getAttributeNS("http://www.w3.org/2005/07/aaa", "activedescendant");      
    var activeDescendant = CLC_Window().document.getElementById(theActiveDescendantID);
    statusString = statusString + CLC_GetTextContentOfAllChildren(activeDescendant);
    }

  if ( (theRole.toLowerCase() == "combobox") || (theRole.toLowerCase() == "listbox")) {
    var allDescendentsArray = target.getElementsByTagName("*");
	
    for (var i = 0; i < allDescendentsArray.length; i++) {
      if (CLC_GetRoleStringOf(allDescendentsArray[i]) == "option") {
        if (allDescendentsArray[i].getAttributeNS) {
		  var attrib = allDescendentsArray[i].getAttributeNS("http://www.w3.org/2005/07/aaa", "selected");
		  
		  if (attrib !== null && attrib.toLowerCase() == "true") {
            statusString = statusString + CLC_GetTextContent(allDescendentsArray[i]);
		  }
        }
      }
    }
  }

  return statusString;
}



//------------------------------------------
//Returns true if the WAI-ARIA widget is an input; returns false if not.
//


function CLC_RoleIsInput(target) {
  var theRole = CLC_GetRoleStringOf(target);

  if (theRole.toLowerCase() == "treeitem") {
    return false;
  }

  if (CLC_GetStatusFromRole(target) != "") {
    return true;
  }

  return false;
}
