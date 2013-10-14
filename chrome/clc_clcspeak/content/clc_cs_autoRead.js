//This file is only for the Auto Reader
//
//The idea here is to fake multithreading capability by having
//a function that calls itself recursively through a setTimeout.
//Because this makes the recursive call a separate thread, there
//is no problem with the user doing something which will interrupt it.
//This function will stop itself if it is interrupted or if it reaches the
//end of the document.
//


function CLC_CS_AutoRead()
{
  if (CLC_CS_Stop) {
    CLC_Interrupt();
  } else {
    if (CLC_Ready()) {
      CLC_CS_ReadContentBySentence();
    }

    if (CLC_CS_CurrentAtomicObject) {
      window.setTimeout(function(){CLC_CS_AutoRead();}, 0); 
    }

    CLC_CS_RestoreCaretSetting();
  }

  return;    
} 

//-----------------------------------------------
