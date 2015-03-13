//Temporary cursor hackaround fix for https://bugzilla.mozilla.org/show_bug.cgi?id=351491
function CLC_CS_FFCursorFix() {
   var framesArray = window.content.document.documentElement.getElementsByTagName("frame");

   for(var i = 0; i < framesArray.length; i++){
      framesArray[i].contentWindow.focus();
   }
}

function CLC_CS_Init(){      
   CLC_CS_RememberCaretSetting();

   if (CLC_CS_WasCaretEnabled){
      CLC_CS_FFCursorFix(); //This is to fix a problem with the Firefox 2.0 cursor.
                            //See https://bugzilla.mozilla.org/show_bug.cgi?id=351491
      }

   //Ignore the auto refresh on a page
   if (CLC_Window().document.baseURI == CLC_CS_CurrentURI){
      return;
      }
   CLC_CS_InitPref();
   CLC_CS_CurrentURI = CLC_Window().document.baseURI;
   CLC_CS_Focus_Init();
   CLC_CS_Mouseclick_Init();
   if (!CLC_CS_Started){
      CLC_CS_Started = true;      
      CLC_CS_StartTTSEngine();
      }
   CLC_CS_StopSpeaking();
   CLC_CS_CurrentAtomicObject = CLC_GetFirstAtomicObject(CLC_Window().document.body);
   CLC_CS_PrevAtomicObject = 0;   
   CLC_CS_LastFocusable = 0;      //Last object that was determined to be focusable

   //Initialize the CSS Speech Property Rules
   try{
      CLC_CS_InitSPCSSRules();
      } catch(e){
        CLC_CS_SPCSSRules = 0;  //Something went wrong, don't use speech properties
      }

   CLC_CS_RestoreCaretSetting();
   }

function CLC_CS_StopSpeaking(){
   CLC_CS_RestoreCaretSetting();
   CLC_CS_Stop = true;
   CLC_Interrupt();
   }

function CLC_CS_SpeakSelection(){
   if (CLC_CS_Query_PrefsChanged()){
     CLC_CS_StartTTSEngine();
   }
   CLC_CS_RestoreCaretSetting();
   CLC_CS_SpeakEventBuffer = CLC_GetSelectedText();
   if (CLC_CS_SpeakEventBuffer.length == 0){
      if (CLC_CS_LastFocusedObject && CLC_CS_LastFocusedObject.value &&
           CLC_CS_LastFocusedObject.selectionEnd){
         var strIndex = CLC_CS_LastFocusedObject.selectionStart;
         while (strIndex < CLC_CS_LastFocusedObject.selectionEnd){
            CLC_CS_SpeakEventBuffer = CLC_CS_SpeakEventBuffer + CLC_CS_LastFocusedObject.value[strIndex];
            strIndex++;
            }
         }
      }
   try{
      var currentObjLang = CLC_Content_FindLanguage(CLC_Window().getSelection().focusNode);
      CLC_SetLanguage(currentObjLang);
      }
   catch(e){
      }
   var speechProperties_array = new Array();
   speechProperties_array.push([0,-1]);   
   speechProperties_array.push([0,-1]);   
   speechProperties_array.push([0,-1]);   

   CLC_ShoutWithProperties(CLC_CS_SpeakEventBuffer, speechProperties_array, new Array());
   CLC_SetLanguage(CLC_CS_DefaultLanguage);
   }


function CLC_CS_SpeakPage() {
   if (CLC_CS_Query_PrefsChanged()) {
     CLC_CS_StartTTSEngine();
   }

   CLC_CS_RememberCaretSetting();

   if(!CLC_Ready()) {
     CLC_CS_StopSpeaking();
     window.setTimeout(function(){CLC_CS_SpeakPage();}, 100);  
     return;
   }

   CLC_CS_Stop = false;
   window.setTimeout(function(){CLC_CS_AutoRead();}, 0);   
}



function CLC_CS_RememberCaretSetting(){
   CLC_CS_WasCaretEnabled = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("").getBoolPref("accessibility.browsewithcaret");
   }

function CLC_CS_RestoreCaretSetting(){
   Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("").setBoolPref("accessibility.browsewithcaret",CLC_CS_WasCaretEnabled);
   }