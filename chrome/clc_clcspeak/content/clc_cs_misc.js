//Miscellaneous functions that have not been categorized yet



//-----------------------------------------------
//Determines if the target should not be spoken
//for some reason because of its lineage.
//For example, if it is part of a comment node.
//True if it should NOT be spoken; else false.
//
//Should be using the PHYSICAL lineage here, not the logical one!
//Legends and labels are ignored because they will be spoken by announcement.
//
function CLC_CS_ShouldNotSpeak(lineage){
   //Input should always be spoken - also accounts for implicit labels
   if (lineage[lineage.length-1].tagName) {
      switch(lineage[lineage.length-1].tagName.toLowerCase()) {
         case "input":
         case "button":
         case "select":
         case "textarea":
            return false;
         default:
            break;
      }
   }

   if (lineage[lineage.length-2].tagName && lineage[lineage.length-2].tagName.toLowerCase() == "textarea") {
      return false;
   }

   for (var i=0; i < lineage.length; i++){
      //Do not read images without alt text
      if (lineage[i].tagName && (lineage[i].tagName.toLowerCase() == "img")){
         if (!lineage[i].alt){
            return true;
            }
         }
      if (lineage[i].nodeType == 8){
         return true;
         }
      if (lineage[i].tagName && (lineage[i].tagName.toLowerCase() == "script") ) {
         return true;
         }

      //NOSCRIPT elements are tricky
      if (lineage[i].tagName && (lineage[i].tagName.toLowerCase() == "noscript") ) {
         //If javascript is on, then the content of a NOSCRIPT element should be ignored
         if (Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("").getBoolPref("javascript.enabled") ){
            return true;
            }
         //However, if javascript is off, then the content goes into the regular HTML DOM and needs to be used
         return false;
         }
      if (lineage[i].tagName && (lineage[i].tagName.toLowerCase() == "legend") ){
         //Insert some mitigating factors here if needed
         return true;
         }
      if (lineage[i].tagName && (lineage[i].tagName.toLowerCase() == "label") ){       
         //Insert some mitigating factors here later to account for orphaned labels
         return true;
         }
      }
   return false;
   }



//-----------------------------------------------
//Goes to a DOM object and reads it. Will adjust the screen.
//
function CLC_CS_GoToAndRead(target){
   if (!target){
      return;
      } 
   CLC_CS_CurrentAtomicObject = CLC_GetFirstAtomicObject(target);
   CLC_MoveCaret(CLC_CS_CurrentAtomicObject);   
   CLC_CS_ReadCurrentPosition();
   }



//-----------------------------------------------
//Dumps debug information into the CLC_CS_DebugStringDump global variable.
//
function CLC_CS_DumpToDebug(debug_message){
   CLC_CS_DebugStringDump = CLC_CS_DebugStringDump + debug_message + "\n";
   }


//-----------------------------------------------
//Returns everything in the CLC_CS_DebugStringDump global variable.
//
function CLC_CS_ReadDebugDump(){
   return CLC_CS_DebugStringDump;
   }


//-----------------------------------------------
//Resets the CLC_CS_DebugStringDump global variable.
//
function CLC_CS_ResetDebugDump(){
   CLC_CS_DebugStringDump = "";
   }
