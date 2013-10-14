//------------------------------------------
//Function used to handle mouse clicks.
//
//The only purpose of this function is to turn on cursor matching,
//
function CLC_CS_Mouseclick_Handler(event) {  
   CLC_CS_UseCursorMatching = true;
   return;
}



//------------------------------------------
//Sets the event listener to catch keypress events
//
function CLC_CS_Mouseclick_Init() {   
   window.addEventListener("click", CLC_CS_Mouseclick_Handler, false);
}

//------------------------------------------


function CLC_CS_Focus_Handler(event) {   
   CLC_CS_LastFocusedObject = event.target;
   return;
}

function CLC_CS_Focus_Init(){   
   var framesArray = window._content.document.documentElement.getElementsByTagName("frame");
   var F;
   var csWindow;
   var i;

   for(i = 0; i < framesArray.length; i++) {
      F = framesArray[i];

      if (F.contentWindow && F.contentWindow.document && F.contentWindow.document.body) {
         F.contentWindow.document.body.addEventListener("focus", CLC_CS_Focus_Handler, true);
      }
   }

   csWindow = CLC_Window();

   if (csWindow && csWindow.document && csWindow.document.body) {
      csWindow.document.body.addEventListener("focus", CLC_CS_Focus_Handler, true);
   }

   for(i = 0; i < framesArray.length; i++) {
      F = framesArray[i];

      if (F.contentWindow && F.contentWindow.document && F.contentWindow.document.body) {
         F.contentWindow.document.body.addEventListener("blur", CLC_CS_Blur_Handler, true);
      }
   }

   csWindow = CLC_Window();

   if (csWindow && csWindow.document && csWindow.document.body) {
      csWindow.document.body.addEventListener("blur", CLC_CS_Blur_Handler, true);
   }
}


function CLC_CS_Blur_Handler(event) {   
   if (CLC_CS_LastFocusedObject == event.target) {
      CLC_CS_LastFocusedObject = 0;
   }

   return;
}

