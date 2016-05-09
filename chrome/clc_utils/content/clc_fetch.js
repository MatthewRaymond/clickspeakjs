//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: DOM Object Fetching Functions
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

//NOTE on "Atomic" Objects:
//An atomic object is an object which cannot
//be further divided. In other words, it has
//no children objects.
//
//Text nodes in the Firefox JavaScript DOM are
//atomic. They have a nodeType of 3.
//
//NOTE on "parentPointer" objects:
//These are objects that CLC_Utils will tag on to
//objects that do not have a "normal" parentNode defined
//in order to impose a parent-child relationship.
//A classic example of this is IFRAME which has no reference
//back to the parent object that it is embedded inside of.



//------------------------------------------
//Returns the first atomic object that the
//"currentobj" contains. "currentobj" must be
//an object found in the DOM of the webpage being
//processed.
//
//Note: Because of the special properties of MathML and select objects,
//      they are considered "atomic" and indivisible. 
//
function CLC_GetFirstAtomicObject(currentobj){
   var atomicObject = currentobj;

   if (atomicObject != undefined && atomicObject != null) {
      if (CLC_RoleIsInput(atomicObject)) {
         return atomicObject;
      }

      if (CLC_GetRoleStringOf(atomicObject) == "img") {
         return atomicObject;
      }

      if (atomicObject.tagName) {
         switch(atomicObject.tagName) {
            case "math":
            case "MATH":
               return atomicObject;
            case "select":
            case "SELECT":
               return atomicObject;
            case "iframe":
            case "IFRAME":
               atomicObject.contentDocument.parentPointer = atomicObject;
               return CLC_GetFirstAtomicObject(atomicObject.contentDocument);
            default:
               break;
         }
      }

      while (atomicObject && atomicObject.firstChild) {
         atomicObject = atomicObject.firstChild;

         if (CLC_RoleIsInput(atomicObject)) {
            return atomicObject;
         }

         if (atomicObject.tagName) {
           switch(atomicObject.tagName) {
             case "math":
             case "MATH":
               return atomicObject;
             case "select":
             case "SELECT":
               return atomicObject;
             default:
               break;
           }
         }
      }

      return atomicObject;
   } else {
      return null;
   }
}

//------------------------------------------
//Returns the last atomic object that the
//"currentobj" contains. "currentobj" must be
//an object found in the DOM of the webpage being
//processed.
//
//Note: Because of the special properties of MathML and select objects,
//      they are considered "atomic" and indivisible. 
//
function CLC_GetLastAtomicObject(currentobj) {
   var atomicObject = currentobj;

   if (atomicObject != undefined && atomicObject != null) {
      if (CLC_RoleIsInput(atomicObject)){
         return atomicObject;
      }

      if (atomicObject.tagName) {
         switch(atomicObject.tagName.toLowerCase()) {
            case "math":
            case "MATH":
               return atomicObject;
            case "select":
            case "SELECT":
               return atomicObject;
            case "iframe":
            case "IFRAME":
               atomicObject.contentDocument.parentPointer = atomicObject;
               return CLC_GetLastAtomicObject(atomicObject.contentDocument);
            default:
               break;
         }
      }

      while (atomicObject.lastChild) {
         atomicObject = atomicObject.lastChild;

         if (CLC_RoleIsInput(atomicObject)) {
            return atomicObject;
         }

         if (atomicObject.tagName) {
           switch(atomicObject.tagName) {
             case "math":
             case "MATH":
               return atomicObject;
             case "select":
             case "SELECT":
               return atomicObject;
             default:
               break;
           }
         }
      }     
 
      return atomicObject;
   } else {
      return null;
   }
}


//------------------------------------------
//Returns the next atomic object after the 
//"CurrentAtomicObj." The "CurrentAtomicObj"
//must be an atomic object found in the DOM 
//of the webpage being processed.
//
//If there is no next atomic object (ie, the
//end of the page has been reached), it will
//return 0.
//
function CLC_GetNextAtomicObject(CurrentAtomicObj){
   var targetObject = CurrentAtomicObj;

   if (targetObject.nextSibling) {
      return CLC_GetFirstAtomicObject(targetObject.nextSibling);
   }

   while ((targetObject.parentNode) && (!targetObject.parentNode.nextSibling)) {
      targetObject = targetObject.parentNode;
   }

   if (targetObject.parentPointer) {
      return CLC_GetNextAtomicObject(targetObject.parentPointer);
   }

   if (!targetObject.parentNode) {
      return 0;
   } else {
      return CLC_GetFirstAtomicObject(targetObject.parentNode.nextSibling);
   }
}

//------------------------------------------
//Returns the previous atomic object before the 
//"CurrentAtomicObj." The "CurrentAtomicObj"
//must be an atomic object found in the DOM 
//of the webpage being processed.
//
//If there is no previous atomic object (ie, the
//top of the page has been reached), it will
//return 0.
//
function CLC_GetPrevAtomicObject(CurrentAtomicObj){
     var targetObject = CurrentAtomicObj;
     if (targetObject.previousSibling){        
        return CLC_GetLastAtomicObject(targetObject.previousSibling);
        }
     while ((targetObject.parentNode) && (!targetObject.parentNode.previousSibling)){
        targetObject = targetObject.parentNode;
        }
     if (targetObject.parentPointer){
        return CLC_GetPrevAtomicObject(targetObject.parentPointer);
        }
     if (!targetObject.parentNode){
        return 0;
        }
     else{
        return CLC_GetLastAtomicObject(targetObject.parentNode.previousSibling);
        }
     }



//------------------------------------------
//Returns the atomic object at the cursor
//
function CLC_GetAtomicObjectAtCursor() {
   var cursor = CLC_Window().getSelection();

   //Try to collapse the cursor to its start, 
   //but continue the function even if this fails.
   try {
     cursor.collapseToStart();
   } catch(e) {
   }

   var atomicobj = CLC_GetFirstAtomicObject(cursor.anchorNode); 
   var lineage = CLC_GetLineage(atomicobj);

   if (CLC_TagInLineage(lineage, "math")) {
      while(1) {
         if (atomicobj.tagName && (atomicobj.tagName == "math" || atomicobj.tagName == "MATH")) {
            return atomicobj;
         }

         atomicobj = atomicobj.parentNode;
      }
   }

   if (CLC_TagInLineage(lineage, "select")) {
      while(1) {
         if (atomicobj.tagName && (atomicobj.tagName == "select" || atomicobj.tagName == "SELECT")) {
            return atomicobj;
         }

         atomicobj = atomicobj.parentNode;
      }
   }

   return atomicobj;
}

//------------------------------------------
//Returns the next atomic object that contains text
//
function CLC_GetNextAtomicTextObject(CurrentAtomicObj){
   CurrentAtomicObj = CLC_GetNextAtomicObject(CurrentAtomicObj);   
   while (CurrentAtomicObj && !CLC_HasText(CurrentAtomicObj)){
      CurrentAtomicObj = CLC_GetNextAtomicObject(CurrentAtomicObj);
      }
   return CurrentAtomicObj;
   }

//------------------------------------------
//Returns the previous atomic object that contains text
//
function CLC_GetPrevAtomicTextObject(CurrentAtomicObj){
   CurrentAtomicObj = CLC_GetPrevAtomicObject(CurrentAtomicObj);   
   while (CurrentAtomicObj && !CLC_HasText(CurrentAtomicObj)){
      CurrentAtomicObj = CLC_GetPrevAtomicObject(CurrentAtomicObj);
      }
   return CurrentAtomicObj;
   }


//------------------------------------------
//Returns an array of DOM objects that is the lineage
//of the target object.
//The array is ordered such that the target is the 
//last element in the array.
//
function CLC_GetLineage(target){
   var lineage = new Array();
   var object = target;
   while (object){
      lineage.push(object);      
      if (object.parentPointer){
         object = object.parentPointer;
         }
      else{
         object = object.parentNode;
         }
      }
   lineage.reverse();
   while(lineage.length && !lineage[0].tagName && !lineage[0].nodeValue){
      lineage.shift();
      }
   return lineage;
   }

//------------------------------------------
//Compares Lineage A with Lineage B and returns
//the index value in B at which B diverges from A.
//If there is no divergence, the result will be -1.
//Note that if B is the same as A except B has more nodes
//even after A has ended, that is considered a divergence.
//The first node that B has which A does not have will
//be treated as the divergence point.
//
function CLC_CompareLineages(lina, linb){
   var i = 0;
   while( lina[i] && linb[i] && (lina[i] == linb[i]) ){
       i++;
       }
   if ( !lina[i] && !linb[i] ){
      i = -1;
      }
   return i;
   }


//------------------------------------------
//Finds the closest highlightable DOM object to target and returns it.
//If target is not highlightable, it will go up to target's parent and so on.
//If nothing is highlightable, it returns 0.
//
function CLC_FindHighlightable(target){
   var Highlightable = target;
   while (Highlightable && !Highlightable.style){
      Highlightable = Highlightable.parentNode;
      }
   return Highlightable;
   }  


//------------------------------------------
//Finds the closest scrollable DOM object to target and returns it.
//If target is not scrollable, it will go up to target's parent and so on.
//If nothing is scrollable, it returns 0.
//
function CLC_FindScrollable(target){
   var Scrollable = target;
   while (Scrollable && !Scrollable.offsetTop){
      Scrollable = Scrollable.parentNode;
      }
   return Scrollable;
   }  


//------------------------------------------
//Finds the most logical focusable DOM object to target and returns it.
//INPUT elements have the top priority. If it is an input element, it will be focused on.
//LINK elements have second priority. If its lineage contains a link, the link will take be
//focused on as long as it is not an input.
//Otherwise, the most logical focusable DOM object is the closest focusable parentNode.
//
//Returns 0 if nothing is focusable.
//
function CLC_FindFocusable(target){
  if (target != undefined && target != null) {
    if (target.tagName && (target.tagName == "input" || target.tagName == "INPUT")) {
      return target;
    }

    if (target.tagName && (target.tagName == "select" || target.tagName == "SELECT")) {
      return target;
    }

    var lineage = CLC_GetLineage(target);

    for (var i=0; i < lineage.length; i++){
      if (lineage[i].localName && (lineage[i].localName == "a" || lineage[i].localName == "A") && lineage[i].hasAttribute("href")) {
         return lineage[i];
      }
    }

    var Focusable = target;

    while (Focusable && !Focusable.focus) {
      Focusable = Focusable.parentNode;
    }

    return Focusable;
  } else {
    return null;
  }
}  



//------------------------------------------
//Determines if DOM_obja contains DOM_objb
//
function CLC_AcontainsB(DOM_obja, DOM_objb){
   if(!DOM_obja){
      return false;
      }
   var lineage = CLC_GetLineage(DOM_objb);
   for (var i=0; i < lineage.length; i++){
      if (lineage[i] == DOM_obja){
         return true;
         }
      }
   return false;
   }


//------------------------------------------
//Determines if a lineage has any DOM object with 
//the specified HTML tag string
//
function CLC_TagInLineage(lineage, tag){
   tag = tag.toLowerCase();
   for (var i=0; i < lineage.length; i++){
      if ( lineage[i].localName && (lineage[i].localName.toLowerCase() == tag) ){
         return true;
         }
      }
   return false;
   }

//------------------------------------------
//Builds a logical lineage as opposed to a strict physical lineage.
//These are identical for the most part, except a logical lineage
//will include the label elements as parents of whatever
//they are a label for.
//If there are multiple labels, the earlier they appear in the HTML,
//the "older" they are. "Older"/"younger" means that if both exist, the 
//older one will be the parent of the younger one.
//
function CLC_GetLogicalLineage(target){
   if (!target.tagName){
      return CLC_GetLineage(target);
   }

   switch(target.tagName) {
      case "input":
      case "button":
      case "select":
      case "textarea":
      case "INPUT":
      case "BUTTON":
      case "SELECT":
      case "TEXTAREA":
         break;
      default:
         return CLC_GetLineage(target);
   }

   if (!target.hasAttribute("id")){
      return CLC_GetLineage(target);
   }

   var tempLineage = CLC_GetLineage(target);
   var labelArray = tempLineage[0].getElementsByTagName("label"); 

   //Build up the Logical Lineage of an input element
   var logicalLineage = new Array();

   //Last element should be the target itself
   logicalLineage.push(tempLineage[tempLineage.length-1]);

   var i;

   //Add labels that are attached to the target
   for (i = labelArray.length - 1; i >= 0; i--) {
      if (labelArray[i].htmlFor == target.id) {
         logicalLineage.push(labelArray[i]);
      }
   }

   //Add the rest of the physical lineage
   for (i = tempLineage.length - 2; i >= 0; i--) {
      logicalLineage.push(tempLineage[i]);
   }

   logicalLineage.reverse();
   return logicalLineage;
}

//------------------------------------------
//Fills the targ_array with all DOM Objects that are under
//the targ_obj that have targ_attrib as an attribute
//
function CLC_AllDOMObjWithAttribute(targ_array, targ_obj, targ_attrib){
   if (!targ_obj){
      return targ_array;
      }
   if ( targ_obj.hasAttribute && targ_obj.hasAttribute(targ_attrib) ) {
      targ_array.push(targ_obj);
      }
   for (var i=0; i < targ_obj.childNodes.length; i++){
      CLC_AllDOMObjWithAttribute(targ_array, targ_obj.childNodes[i], targ_attrib);
      }
   return targ_array;
   }


//------------------------------------------
//Returns the first DOM object that matches one of the target tags in the
//targObjTag_array and occurs before/after the currentObj.
//Direction == -1 to get the one before; direction == +1 to get the one after. 
//Note that neither the currentObj nor the returned DOM object 
//is necessarily atomic. In fact, the returned DOM object will
//most likely NOT be atomic.
//
function CLC_GetClosestDOMObj(currentObj, targObjTag_array, direction){
  var tempObj;
  if (direction == -1){
    tempObj = CLC_GetPrevAtomicObject(currentObj);
    }
  else{
    tempObj = CLC_GetNextAtomicObject(currentObj);
    }
  if (!tempObj){
    return 0;
    }
  var lineage = CLC_GetLineage(tempObj);
  for (var i = 0; i < targObjTag_array.length; i++){
    if ( CLC_TagInLineage(lineage, targObjTag_array[i].toLowerCase()) ){        
      while(1){
        if ( tempObj.tagName && (tempObj.tagName.toLowerCase() == targObjTag_array[i].toLowerCase()) ){
          return tempObj;
          }
        tempObj = tempObj.parentNode;
        }
      }
    }
  return CLC_GetClosestDOMObj(tempObj, targObjTag_array, direction);
  }


//------------------------------------------
//Returns the first DOM object that matches one of the target tags in the
//targObjTag_array, occurs before/after the currentObj, has all attributes specified
//in mustHaveAttrib_array, and none of the attributes in mustNotHaveAttrib_array.
//Direction == -1 to get the one before; direction == +1 to get the one after. 
//Note that neither the currentObj nor the returned DOM object 
//is necessarily atomic. In fact, the returned DOM object will
//most likely NOT be atomic.
//
function CLC_GetClosestDOMObjWithRestrictions(currentObj, targObjTag_array, direction, mustHaveAttrib_array, mustNotHaveAttrib_array){
  var tempObj = CLC_GetClosestDOMObj(currentObj, targObjTag_array, direction);
  if (!tempObj){
    return 0;
    }
  var isAnswer = true;
  for (var i = 0; i < mustHaveAttrib_array.length; i++){
    if ( tempObj.hasAttribute && !tempObj.hasAttribute(mustHaveAttrib_array[i].toLowerCase()) ){
      isAnswer = false;
      }
    }
  for (var j = 0; j < mustNotHaveAttrib_array.length; j++){
    if ( tempObj.hasAttribute && tempObj.hasAttribute(mustNotHaveAttrib_array[j].toLowerCase()) ){
      isAnswer = false;
      }
    }
  if (isAnswer){
    return tempObj;
    }
  return CLC_GetClosestDOMObjWithRestrictions(tempObj, targObjTag_array, direction, mustHaveAttrib_array, mustNotHaveAttrib_array);
  }

//------------------------------------------
//Returns the value of the specified attribute that is 
//closest to the specified DOM object.
//If the object itself has this attribute, then the 
//closest value would be the value of the attribute on the 
//object itself. Otherwise, it is the value of the attribute 
//at the object's closest parent.
//If the attribute doesn't exist at all in the entire lineage, 
//this function will return null.
//
function CLC_GetClosestAttributeOf(targObj, targAttribute){
  //Do nothing if no target attribute is specified
  if (!(targAttribute == "")){
    while (1) {
      if (!targObj) {
        break;
      }

      //See if the target object has this attribute
      if (targObj.hasAttribute && targObj.hasAttribute(targAttribute)) {
         return targObj.getAttribute(targAttribute);
      }

      targObj = targObj.parentNode;
    }
  }

  return "";
}


//------------------------------------------
//Returns the closest ancestor to the targObj
//that is of the specified HTML tag string.
//Returns null if nothing is found.
//
function CLC_GetClosestAncestorThatIs(targObj, tag){
   var lineage = CLC_GetLineage(targObj);
   tag = tag.toLowerCase();
   for (var i=lineage.length - 1; i > -1; i--){
      if (lineage[i].localName && (lineage[i].localName.toLowerCase() == tag)){
         return lineage[i];
         }
      }
   return "";
   }

//------------------------------------------
//Returns the closest ancestor to the targObj
//that has the specified attribute value.
//Returns null if nothing is found.
//
function CLC_GetClosestAncestorWithAttribute(targObj, targAttributeName, targAttributeValue){
   var lineage = CLC_GetLineage(targObj);   
   for (var i=lineage.length - 1; i > -1; i--){
      if (lineage[i].localName && lineage[i].getAttribute && (lineage[i].getAttribute(targAttributeName) == targAttributeValue)){
         return lineage[i];
         }
      }
   return "";
   }

//------------------------------------------
//Returns an array of childNodes of the targObj
//that have the specified attribute value.
//Returns an empty array if nothing is found.
//
function CLC_GetDescendentNodesWithAttribute(targObj, targAttributeName, targAttributeValue){
   var matchingNodes = new Array();
   var descendents = targObj.getElementsByTagName('*');
   for (var i=0; i<descendents.length; i++){
      if (descendents[i].getAttribute && (descendents[i].getAttribute(targAttributeName) ==  targAttributeValue)){
         matchingNodes.push(descendents[i]);
         } 
      }
   return matchingNodes;
   }


//------------------------------------------
//Returns the value of the specified attribute under the 
//specified namespace that is closest to the specified DOM 
//object. If the object itself has this attribute, then the 
//closest value would be the value of the attribute on the 
//object itself. Otherwise, it is the value of the attribute 
//at the object's closest parent.
//If the attribute doesn't exist at all in the entire lineage, 
//this function will return null.
//
function CLC_GetClosestNSAttributeOf(targObj, targNamespace, targAttribute){
  //Do nothing if no namespace or no target attribute is specified
  if (!(targNamespace == "" || targAttribute == "")) {
    while (1) {
      if (!targObj) {
        break;
      }

      //See if the target object has this attribute
      if (targObj.hasAttributeNS && targObj.hasAttributeNS(targNamespace, targAttribute)){
         return targObj.getAttributeNS(targNamespace, targAttribute);
      }

      targObj = targObj.parentNode;
    }
  }

  return "";
}

//------------------------------------------
//Returns an array containing the DOM objects 
//that are labels for the specified targObj.
//Note that this is currently only for WAI-ARIA labels specified by "labelledby".
//
function CLC_GetAssociatedLabels(targObj){
  var labelArray = new Array();
  if (!targObj){
    return labelArray;
    }
  var labelIDsString = "";
  if (targObj.hasAttributeNS && targObj.hasAttributeNS("http://www.w3.org/2005/07/aaa", "labelledby")){
     labelIDsString = targObj.getAttributeNS("http://www.w3.org/2005/07/aaa", "labelledby");
     }
  if (!labelIDsString && targObj.hasAttribute && targObj.hasAttribute("aria-labelledby")){
    labelIDsString = targObj.getAttribute("aria-labelledby");
    }
  if (!labelIDsString){
    return labelArray;
    }
  var labelIDArray = labelIDsString.split(' ');
  for(var i=0; i < labelIDArray.length; i++){
    var tempObj = CLC_Window().document.getElementById(labelIDArray[i]);
    if (tempObj){
      labelArray.push(tempObj);
      }
    }
  return labelArray;
  }

//------------------------------------------
//Returns an array containing the DOM objects 
//that are descriptions for the specified targObj.
//Note that this is currently only for WAI-ARIA descriptions specified by "describedby".
//
function CLC_GetAssociatedDescriptions(targObj){
  var descriptionArray = new Array();
  if (!targObj){
    return descriptionArray;
    }
  var descriptionIDsString = "";
  if (targObj.hasAttributeNS && targObj.hasAttributeNS("http://www.w3.org/2005/07/aaa", "describedby")){
     descriptionIDsString = targObj.getAttributeNS("http://www.w3.org/2005/07/aaa", "describedby");
     }
  if (!descriptionIDsString && targObj.hasAttribute && targObj.hasAttribute("aria-describedby")){
    descriptionIDsString = targObj.getAttribute("aria-describedby");
    }
  if (!descriptionIDsString){
    return descriptionArray;
    }
  var descriptionIDArray = descriptionIDsString.split(' ');
  for(var i=0; i < descriptionIDArray.length; i++){
    var tempObj = CLC_Window().document.getElementById(descriptionIDArray[i]);
    if (tempObj){
      descriptionArray.push(tempObj);
      }
    }
  return descriptionArray;
  }


//------------------------------------------
//Returns the closest ancestor that has the specified WAI-ARIA role
//
function CLC_GetClosestAncestorWithRole(targObj, roleStr){
  if (!targObj){
    return "";
    }
  if (!roleStr){
    return "";
    }
  var tempObj = targObj;
  while (tempObj){
    var tempObjRoleStr = CLC_GetRoleStringOf(tempObj);
    if (tempObjRoleStr && (tempObjRoleStr == roleStr)){
       return tempObj;
       }
    tempObj = tempObj.parentNode;
    }
  return "";
  }
