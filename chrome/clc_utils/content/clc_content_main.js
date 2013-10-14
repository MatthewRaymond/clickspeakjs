//Copyright 2007 Google Inc.
//
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Element Content System - Main
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
 

//Last Modified Date 2/21/2005

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


//------------------------------------------
//Returns a string that is the text content which
//should be associated with the target DOM object.
//The target DOM object should be an atomic DOM object.
//
//For the most part, this will simply be the textContent
//of the target object. However, this function does special
//processing for handling inputs (which do not have textContent).
//
function CLC_GetTextContent(target){
  if (!target){
     return "";
     }
  if (target.nodeType == 8){ //Ignore comment nodes
     return "";
     } 
  var textContentFromRole = CLC_GetTextContentFromRole(target);
  if (textContentFromRole){
    return textContentFromRole;
    }
  //Ignore scripts in the body
  if (target.parentNode && target.parentNode.tagName && target.parentNode.tagName.toLowerCase() == "script"){
     return "";
     } 
  if (target.parentNode && target.parentNode.tagName && target.parentNode.tagName.toLowerCase() == "noscript"){
     return "";
     } 
  //Do textarea twice because it may or may not have child nodes
  if (target.tagName && target.tagName.toLowerCase() == "textarea"){
     var labelText = CLC_Content_FindLabelText(target);
     return labelText; 
     }
  if (target.parentNode && target.parentNode.tagName && target.parentNode.tagName.toLowerCase() == "textarea"){
     var labelText = CLC_Content_FindLabelText(target.parentNode);
     return labelText; 
     }
  //Same logic as textarea applies for buttons
  if (target.parentNode && target.parentNode.tagName && target.parentNode.tagName.toLowerCase() == "button"){
     var labelText = CLC_Content_FindLabelText(target.parentNode);
     return labelText + target.textContent;  
     }
  if (target.tagName && target.tagName.toLowerCase() == "button"){
     var labelText = CLC_Content_FindLabelText(target);
     return labelText + target.textContent; 
     }
  //Form controls require special processing
  if (target.tagName && target.tagName.toLowerCase() == "input"){
     if (target.type.toLowerCase() == "radio"){
         var labelText = CLC_Content_FindLabelText(target);
         if (!labelText){
            labelText = CLC_Content_FindRadioButtonDirectContent(target);
            }
         return labelText;
         }
     if (target.type.toLowerCase() == "checkbox"){
         var labelText = CLC_Content_FindLabelText(target);
         if (!labelText){
            labelText = CLC_Content_FindCheckboxDirectContent(target);
            }
         return labelText;
         }
     if (target.type.toLowerCase() == "text"){
         var labelText = CLC_Content_FindLabelText(target);
         if (!labelText){
            labelText = CLC_Content_FindTextBlankDirectContent(target);
            }
         return labelText;
         }
     if (target.type.toLowerCase() == "password"){
         var labelText = CLC_Content_FindLabelText(target);
         if (!labelText){
            labelText = CLC_Content_FindPasswordDirectContent(target);
            }
         return labelText;
         }
     if ( (target.type.toLowerCase() == "submit") || (target.type.toLowerCase() == "reset")  || (target.type.toLowerCase() == "button")){
         var labelText = CLC_Content_FindLabelText(target);
         return labelText + " " + target.value;
         }
     if (target.type.toLowerCase() == "image"){
         var labelText = CLC_Content_FindLabelText(target);
         return labelText + " " + target.alt;
         }
      return "";
      }
  //MathML element - Use the functions in clc_mathml_main.js to handle these
  if (target.tagName && target.tagName.toLowerCase() == "math"){
     return CLC_GetMathMLContent(target);
     }
  //Images
  if (target.tagName && target.tagName.toLowerCase() == "img"){
      if ( target.hasAttribute("alt") && target.alt == "" ){
         return "";
         }
       if ( target.hasAttribute("alt") ){
         return target.alt;
         }
       return target.src;
       }
  //Select boxes - ignore their textContent, only read out the selected value.
  //However, if there is a label, use it.
  if (target.tagName && target.tagName.toLowerCase() == "select"){
     var labelText = CLC_Content_FindLabelText(target);
     return labelText;
     }
  //"Normal" elements that are just text content and do not require any special action
  if (target.textContent){
     return target.textContent;
     }
  return "";
  }



//------------------------------------------
//Finds the text content of all the labels asscoiated
//with a given input element.
//
function CLC_Content_FindLabelText(target){
   var logicalLineage = CLC_GetLogicalLineage(target);
   var labelText = "";
   for (var i=0; i < logicalLineage.length; i++){
      if (logicalLineage[i].tagName && (logicalLineage[i].tagName.toLowerCase() == "label")){
         labelText = labelText + " " + logicalLineage[i].textContent;
         }
       }
   return labelText;
   }


//------------------------------------------
//Finds the information inside a radio button element
//itself (ignoring all labels).
//
//What else should be here besides the ID? Name? Value?
//
function CLC_Content_FindRadioButtonDirectContent(target){
   if (target.title){
      return target.title;
      }
   if (target.id){
      return target.id;
      }
   return "";
   }

//------------------------------------------
//Finds the information inside a text blank element
//itself (ignoring all labels).
//
//What else should be here besides the ID? Name? Value?
//
function CLC_Content_FindTextBlankDirectContent(target){
   if (target.title){
      return target.title;
      }
   if (target.id){
      return target.id;
      }
   return "";
   }

//------------------------------------------
//Finds the information inside a text blank element
//itself (ignoring all labels).
//
//What else should be here besides the ID? Name? Value?
//
function CLC_Content_FindPasswordDirectContent(target){
   if (target.title){
      return target.title;
      }
   if (target.id){
      return target.id;
      }
   return "";
   }

//------------------------------------------
//Finds the information inside a checkbox element
//itself (ignoring all labels).
//
//What else should be here besides the ID? Name? Value?
//
function CLC_Content_FindCheckboxDirectContent(target){
   if (target.title){
      return target.title;
      }
   if (target.id){
      return target.id;
      }
   return "";
   }

//------------------------------------------
//Finds the language of the target DOM Object.
//Returns null if the language cannot be determined.
//
function CLC_Content_FindLanguage(targObj){
   var lang = CLC_GetClosestAttributeOf(targObj, "lang");
   if (!lang){
      lang = CLC_GetClosestAttributeOf(targObj, "xml:lang");
      }
   if (!lang){
      var htmlObj  = 0;
      var tempLineage = CLC_GetLineage(targObj);
      for (var i=0; i<tempLineage.length; i++){
         if (tempLineage[i].tagName && (tempLineage[i].tagName.toLowerCase()=="html")){
            htmlObj = tempLineage[i];
            }
         }
      if (htmlObj){
         var metaElementsArray = htmlObj.getElementsByTagName("meta");
         for (var i=0; i<metaElementsArray.length; i++){
            if (metaElementsArray[i].httpEquiv && (metaElementsArray[i].httpEquiv.toLowerCase() == "content-language")){
               lang = metaElementsArray[i].content;
               }
            }
         }
      }
   return lang;
   }

//------------------------------------------
//Returns a string that is the text content which
//should be associated with the target DOM object.
//The target DOM object does not have to be an atomic DOM object;
//in fact, it is expected not to be atomic.
//If it were known to be atomic, it is recommended that 
//CLC_GetTextContent(target) be used instead for efficiency.
//
//For the most part, this will simply be the textContent
//of the target object. However, this function does special
//processing for handling inputs (which do not have textContent)
//as well as for images which only have alt and no textContent.
//
function CLC_GetTextContentOfAllChildren(target){
   var childNode = CLC_GetFirstAtomicObject(target);
   var theTextContent = CLC_GetTextContent(childNode) + " ";
   childNode = CLC_GetNextAtomicTextObject(childNode);
   while (CLC_AcontainsB(target, childNode)){
      theTextContent = theTextContent + CLC_GetTextContent(childNode) + " ";
      childNode = CLC_GetNextAtomicTextObject(childNode);
      }
   return theTextContent;
   }


//------------------------------------------
//Retrieves the text content for WAI-ARIA widgets
//
function CLC_GetTextContentFromRole(target){
  if (!target){
    return "";
    }
  var theRole = CLC_GetRoleStringOf(target);
  if (!theRole){
    return "";
    }

  if (theRole.toLowerCase() == "slider"){
    if (target.title){
      return target.title;
      }
    return " ";
    }

  if (theRole.toLowerCase() == "progressbar"){
    if (target.title){
      return target.title;
      }
    return " ";
    }

  if (theRole.toLowerCase() == "treeitem"){
    return CLC_GetTextContentOfAllChildren(target);
    }

  if (theRole.toLowerCase() == "combobox"){
    if (target.title){
      return target.title;
      }
    return " ";
    }

  if (theRole.toLowerCase() == "img"){
    var titleText = "";
    var labelText = "";
    if (target.title){
      titleText = target.title;
      }
    var labelsArray = CLC_GetAssociatedLabels(target);
    for (var i=0; i<labelsArray.length; i++){
      labelText = labelText + " " + labelsArray[i].textContent;
      } 
    var imageText = titleText + " " + labelText;
    return imageText;
    }


  if (theRole.toLowerCase() == "listbox"){
    if (target.title){
      return target.title;
      }
    return " ";
    }

  return "";
  }