//All these functions assume that CLC_CS_InitPref()
//has been called and CLC_CS_Pref is ready for use.

//Failure is defined as catastrophic failure that crashes the browser.
//Non-crashing failure (such as a failure to speak) is 
//NOT considered a "failure" in this context!


//*****************************
//TTS Engine Initializer - Main
//*****************************
function CLC_CS_StartTTSEngine(){
   CLC_CS_SetPref_PrefsChanged(false);	 

   //Set the speech properties
   CLC_SetRate(CLC_CS_Query_SpeechRate(), 2); 
   CLC_SetPitch(CLC_CS_Query_SpeechPitch(), 2);

   //Try to start the TTS
   var prev_tts = CLC_CS_Query_LastWorkingTTS();

   if (prev_tts == 1) {
      CLC_CS_StartSpeakJSTTS();
      return;
   }

   //If there was nothing set, try to pick one.
   if (!CLC_CS_Query_SpeakJSFailed()) {
      CLC_CS_StartSpeakJSTTS();
      return;
   }
}


//*****************************
//TTS Engine Initializer - Specific TTS Initializers
//*****************************

function CLC_CS_StartSpeakJSTTS() {
   CLC_CS_SetPref_LastWorkingTTS(0);
   CLC_CS_SetPref_SpeakJSFailed(true);

   if(CLC_Init(1)) {
      CLC_CS_SetPref_SpeakJSFailed(false);
      CLC_CS_SetPref_LastWorkingTTS(1);
   }
}

   
//*****************************
//TTS Engine History - Records last working TTS and which ones have failed.
//*****************************

//---------------------------------
function CLC_CS_Query_LastWorkingTTS(){
   if(CLC_CS_Pref.prefHasUserValue("extensions.clcspeakjs.LastWorkingTTS")) {
      return CLC_CS_Pref.getIntPref("extensions.clcspeakjs.LastWorkingTTS");
   }

   return 0;
}

//---------------------------------
function CLC_CS_SetPref_LastWorkingTTS(int_setting) {
   CLC_CS_Pref.setIntPref("extensions.clcspeakjs.LastWorkingTTS", int_setting);	
}

//---------------------------------
function CLC_CS_Query_SpeakJSFailed(){
   if(CLC_CS_Pref.prefHasUserValue("extensions.clcspeakjs.SpeakJSFailed")) {
      return CLC_CS_Pref.getBoolPref("extensions.clcspeakjs.SpeakJSFailed");
   }

   return false;
}

//---------------------------------
function CLC_CS_SetPref_SpeakJSFailed(bool_setting){
   CLC_CS_Pref.setBoolPref("extensions.clcspeakjs.SpeakJSFailed", bool_setting);	
}
