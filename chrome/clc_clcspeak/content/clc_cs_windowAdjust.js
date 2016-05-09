//These functions are for adjusting the position of things.
//This includes tasks such as scrolling the window to an appropriate
//position, adjusting focus, highlight, etc.



//-----------------------------------------------
//Tries to scroll to the sentence.
//The Firefox API for doing this is not documented, so enjoy the magic.
//
function CLC_CS_SentenceScroll(){
   try {
      var ci = Components.interfaces;
      var sc = ci.nsISelectionController;
      var ir = ci.nsIInterfaceRequestor;
      var sd = ci.nsISelectionDisplay;
      var selectionController = getBrowser().docShell.QueryInterface(ir).getInterface(sd).QueryInterface(sc);

      selectionController.scrollSelectionIntoView(sc.SELECTION_NORMAL, sc.SELECTION_FOCUS_REGION, true);
   } catch(e){ }
}

//-----------------------------------------------
//Manages the focus, highlighting, and scroll position
//so that what is shown on screen stays consistent with
//what is being read back.
//
function CLC_CS_AdjustScreen(){
   CLC_MoveCaret(CLC_CS_CurrentAtomicObject);   

   var Focusable = CLC_FindFocusable(CLC_CS_CurrentAtomicObject);

   if (Focusable && CLC_CS_ShouldFocus()) {
      Focusable.focus();
   }
}

//-----------------------------------------------
//Determines if Fire Vox should attempt to focus 
//on the current object. True if yes; else no.
//
function CLC_CS_ShouldFocus(){
   var oldFocusable = CLC_FindFocusable(CLC_CS_PrevAtomicObject);
   var newFocusable = CLC_FindFocusable(CLC_CS_CurrentAtomicObject);

   return oldFocusable != newFocusable;
}