//These functions are for manipulating the current atomic object and
//ensuring that it gets placed where it is supposed to be.
//
//All of these use the PHYSICAL lineage since the goal is to determine
//whether or not the object as it is physically positioned should be spoken, 
//and announcements for logical parents are not needed yet.


//-----------------------------------------------
//Returns true if the detected atomic object at the cursor is "valid"; otherwise, returns false.
//In Firefox 1.5, there is a problem with the cursor returning different atomic objects
//eventhough it has not been moved between calls to check what the anchor node of the cursor is.
//

function CLC_CS_ValidCursorObject() {
  if (CLC_AcontainsB(CLC_CS_CurrentAtomicObject, CLC_GetAtomicObjectAtCursor())) {
    return false;
  }

  return true;
}


//-----------------------------------------------
//Sets the CLC_CS_CurrentAtomicObject to the correct AtomicObject
//
function CLC_CS_SetCurrentAtomicObject() {
  if (CLC_CS_UseCursorMatching && CLC_CS_CurrentAtomicObject != undefined && CLC_CS_CurrentAtomicObject != null) {
    //Something strange here - there will always be an exception if the 
    //CurrentAtomicObject is a SELECT element, but the try-catch block will
    //be unable to catch this exception and this exception will halt continued execution.
    //Therefore, never ever try to match if the CurrentAtomicObject is a SELECT element!
    var IsNotSelect = false;

    try {
      IsNotSelect = !(CLC_CS_CurrentAtomicObject.tagName && CLC_CS_CurrentAtomicObject.tagName.toLowerCase() == "select");
    } catch (e) {
      CLC_CS_CurrentAtomicObject = null;
      IsNotSelect = false;
    }

    if (IsNotSelect) {
      //Use try and catch to deal with strange cases where the cursor 
      //is lost. If the cursor is lost, all cursor related functions will
      //fail and the user becomes "stuck" in the page.
      try {
        if (CLC_CS_CurrentAtomicObject) {
          //Deal with the special case of input blanks
          if (CLC_CS_ObjectIsValidInputControl(CLC_CS_LastFocusedObject)) {
            CLC_CS_CurrentAtomicObject = CLC_GetFirstAtomicObject(CLC_CS_LastFocusedObject);
          } else {
            //Deal with the normal case
            CLC_CS_MatchCurrentObjWithCaret();
            CLC_CS_MatchCurrentSentenceWithCaret();
          }

          return;
        }
      } catch(e){
        //The correct way to address a cursor error is to ignore it.
        //If the cursor was lost, then ignore cursor positioning  
        //and simply advance the current object.
      }
    }
  }

  CLC_CS_NavigateBodyFwd();  
}

//-----------------------------------------------
//Determines if we have a special case of input blanks.
//
function CLC_CS_ObjectIsValidInputControl(lfo)
{
  if (lfo && lfo.tagName) {
    if (lfo.tagName.toLowerCase() == "input" || lfo.tagName.toLowerCase() == "textarea") {
      return true;
    }
  }

  return false;
}

//-----------------------------------------------
//Moves the current object so that the current object
//is the first atomic text object after the caret.
//
function CLC_CS_MatchCurrentObjWithCaret() {   
  CLC_CS_CurrentAtomicObject = CLC_GetAtomicObjectAtCursor();
  var lineage = CLC_GetLineage(CLC_CS_CurrentAtomicObject);

  while (CLC_CS_IsBadLineage(lineage)) {
    CLC_CS_CurrentAtomicObject = CLC_GetNextAtomicTextObject(CLC_CS_CurrentAtomicObject);
    lineage = CLC_GetLineage(CLC_CS_CurrentAtomicObject);
  } 

  return;
}

//-----------------------------------------------
//Returns the next atomic object which has text and is within the BODY.
//Note that this function also updates the global variables
//CLC_CS_CurrentAtomicObject & CLC_CS_PrevAtomicObject to reflect
//this forward movement.
//
function CLC_CS_NavigateBodyFwd() {   
  CLC_CS_PrevAtomicObject = CLC_CS_CurrentAtomicObject;

  //First run through - No current object yet
  if (!CLC_CS_CurrentAtomicObject) {
    CLC_CS_CurrentAtomicObject = CLC_GetFirstAtomicObject(CLC_Window().document.body);
  } else { //Already ran at least once - have current object
    //Blur the current object before getting the next one to prevent input blanks
    //from "trapping" the focus.
    CLC_BlurAll(CLC_CS_CurrentAtomicObject);
    CLC_CS_CurrentAtomicObject = CLC_GetNextAtomicTextObject(CLC_CS_CurrentAtomicObject);
  }

  //Ensure that the current atomic object stays within bounds and is readable
  var lineage = CLC_GetLineage(CLC_CS_CurrentAtomicObject);

  while (CLC_CS_IsBadLineage(lineage)) {
    CLC_CS_CurrentAtomicObject = CLC_GetNextAtomicTextObject(CLC_CS_CurrentAtomicObject);
    lineage = CLC_GetLineage(CLC_CS_CurrentAtomicObject);
  } 

  CLC_MoveCaret(CLC_CS_CurrentAtomicObject);
  return CLC_CS_CurrentAtomicObject;
}


//-----------------------------------------------
//Sets the CLC_CS_SentencesArrayIndex to match where the cursor is.
//
function CLC_CS_MatchCurrentSentenceWithCaret() {
  try {
    CLC_CS_SentencesArray = CLC_MakeSegments(CLC_GetTextContent(CLC_CS_CurrentAtomicObject));
    CLC_CS_SentencesArrayIndex = CLC_FindSentenceArrayIndexOfCursorPos(CLC_CS_SentencesArray);

    //Adjust the index in anticipation of moving forward one or moving back one before actually reading it.
    if (CLC_CS_SentencesArrayIndex != -1) {
       CLC_CS_SentencesArrayIndex--;
    }
  } catch(e) {
    CLC_CS_SentencesArrayIndex = -1;
  }
}


//-----------------------------------------------
//Determines if the lineage is inviable.
//
function CLC_CS_IsBadLineage(lineage) {
  if (CLC_CS_CurrentAtomicObject) {
    if (!CLC_TagInLineage(lineage, "body")) {
      return true;
    } else if (!CLC_HasText(CLC_CS_CurrentAtomicObject)) {
      return true;
    } else if (CLC_CS_ShouldNotSpeak(lineage)) {
      return true;
    }
  }

  return false;
}