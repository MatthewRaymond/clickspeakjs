function CLC_CS_Init() {
  CLC_Init();

  // * Ignore the auto refresh on a page.
  if (CLC_Window().document.baseURI == CLC_CS_CurrentURI) {
    return;
  }

  CLC_CS_CurrentURI = CLC_Window().document.baseURI;
  CLC_CS_Focus_Init();
  CLC_CS_Mouseclick_Init();
  CLC_CS_StopSpeaking();

  CLC_CS_CurrentAtomicObject = CLC_GetFirstAtomicObject(CLC_Window().document.body);
  CLC_CS_PrevAtomicObject = 0;   
  CLC_CS_LastFocusable = 0;      //Last object that was determined to be focusable

  //Initialize the CSS Speech Property Rules
  try {
    CLC_CS_InitSPCSSRules();
  } catch(e) {
    CLC_CS_SPCSSRules = 0;  //Something went wrong, don't use speech properties
  }
}

function CLC_CS_StopSpeaking() {
  CLC_CS_Stop = true;
  CLC_Interrupt();
}

function CLC_CS_SpeakSelection() {
  var speakEventBuffer = CLC_GetSelectedText();

  if (speakEventBuffer.length == 0) {
    if (
      CLC_CS_LastFocusedObject &&
      CLC_CS_LastFocusedObject.value &&
      CLC_CS_LastFocusedObject.selectionEnd
    ) {
      var strIndex = CLC_CS_LastFocusedObject.selectionStart;

      while (strIndex < CLC_CS_LastFocusedObject.selectionEnd) {
        speakEventBuffer = speakEventBuffer + CLC_CS_LastFocusedObject.value[strIndex];
        strIndex++;
      }
    }
  }

  try {
    var currentObjLang = CLC_Content_FindLanguage(CLC_Window().getSelection().focusNode);

    CLC_SetLanguage(currentObjLang);
  } catch(e) {
    console.log(e);
  }

  var speechProperties_array = new Array();

  speechProperties_array.push([0,-1]);
  speechProperties_array.push([0,-1]);
  speechProperties_array.push([0,-1]);

  CLC_ShoutWithProperties(speakEventBuffer, speechProperties_array, new Array());
  CLC_SetLanguage(CLC_CS_DefaultLanguage);
}

function CLC_CS_SpeakPage() {
  if (CLC_Ready()) {
    CLC_CS_Stop = false;
    CLC_Window().setTimeout(function () { CLC_CS_AutoRead(); }, 0);
  } else {
    CLC_CS_StopSpeaking();
    CLC_Window().setTimeout(function () { CLC_CS_SpeakPage(); }, 100);  
  }
}
