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
  CLC_Window().addEventListener("click", CLC_CS_Mouseclick_Handler, false);
}

//------------------------------------------


function CLC_CS_Focus_Handler(event) {   
  CLC_CS_LastFocusedObject = event.target;
  return;
}

function CLC_CS_Focus_Init() {
  var csWindow = CLC_Window();
  var framesArray = csWindow.document.documentElement.getElementsByTagName("frame");

  for(var i = 0; i < framesArray.length; i++) {
    CLC_CS_Bind_Focus_Events(framesArray[i].contentWindow);
  }

  CLC_CS_Bind_Focus_Events(csWindow);
}

function CLC_CS_Bind_Focus_Events(eventWindow) {
  if (eventWindow && eventWindow.document && eventWindow.document.body) {
    var docbody = eventWindow.document.body;

    docbody.addEventListener("focus", CLC_CS_Focus_Handler, true);
    docbody.addEventListener("blur", CLC_CS_Blur_Handler, true);
  }
}

function CLC_CS_Blur_Handler(event) {   
  if (CLC_CS_LastFocusedObject == event.target) {
    CLC_CS_LastFocusedObject = 0;
  }

  return;
}
