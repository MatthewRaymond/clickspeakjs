function CLC_CS_InitPref(){
   CLC_CS_Pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
   }

//---------------------------------
function CLC_CS_Query_PrefsChanged(){
   if(CLC_CS_Pref.prefHasUserValue("extensions.clcspeakjs.PrefsChanged")){
      return CLC_CS_Pref.getBoolPref("extensions.clcspeakjs.PrefsChanged");
      }
   return false;
   }

//---------------------------------
function CLC_CS_SetPref_PrefsChanged(bool_setting){
   CLC_CS_Pref.setBoolPref("extensions.clcspeakjs.PrefsChanged", bool_setting);
   }
   
//---------------------------------
function CLC_CS_Query_SpeechEngine(){
   if(CLC_CS_Pref.prefHasUserValue("extensions.clcspeakjs.SpeechEngine")){
      return CLC_CS_Pref.getIntPref("extensions.clcspeakjs.SpeechEngine");
      }
   return -1;
   }

//---------------------------------
function CLC_CS_SetPref_SpeechEngine(int_setting){
   CLC_CS_Pref.setIntPref("extensions.clcspeakjs.SpeechEngine", int_setting);	
   }


//---------------------------------
function CLC_CS_Query_SpeechRate(){
   if(CLC_CS_Pref.prefHasUserValue("extensions.clcspeakjs.SpeechRate")){
      return CLC_CS_Pref.getIntPref("extensions.clcspeakjs.SpeechRate");
      }
   return 0;
   }

//---------------------------------
function CLC_CS_SetPref_SpeechRate(int_setting){
   CLC_CS_Pref.setIntPref("extensions.clcspeakjs.SpeechRate", int_setting);	
   }


//---------------------------------
function CLC_CS_Query_SpeechPitch(){
   if(CLC_CS_Pref.prefHasUserValue("extensions.clcspeakjs.SpeechPitch")){
      return CLC_CS_Pref.getIntPref("extensions.clcspeakjs.SpeechPitch");
      }
   return 0;
   }

//---------------------------------
function CLC_CS_SetPref_SpeechPitch(int_setting){
   CLC_CS_Pref.setIntPref("extensions.clcspeakjs.SpeechPitch", int_setting);	
   }

