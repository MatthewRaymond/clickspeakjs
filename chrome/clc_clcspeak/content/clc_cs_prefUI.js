var CLC_CS_Preferences = Components.utils.import("chrome://clc_clcspeak/content/clc_cs_preferences.jsm", {}).CLC_CS_Preferences;

function CLC_CS_PrefUI_Load(){
   CLC_CS_Preferences.init();
   CLC_CS_PrefUI_UpdateBlanks();
}

function CLC_CS_PrefUI_Unload(){
   CLC_CS_Preferences.uninit();
}

function CLC_CS_PrefUI_Save(){
   CLC_CS_Preferences.CLC_CS_SetPref_NativeTTS(document.getElementById("nativeTTS-checkbox").checked);
   CLC_CS_Preferences.CLC_CS_SetPref_SpeechRate(document.getElementById("speechRate-menulist").selectedIndex - 2);
   CLC_CS_Preferences.CLC_CS_SetPref_SpeechPitch(document.getElementById("speechPitch-menulist").selectedIndex - 2);

   return true;
}

function CLC_CS_PrefUI_UpdateBlanks() {
  document.getElementById("nativeTTS-checkbox").checked = CLC_CS_Preferences.CLC_CS_Query_NativeTTS();
  document.getElementById("speechRate-menulist").selectedIndex = CLC_CS_Preferences.CLC_CS_Query_SpeechRate() + 2;
  document.getElementById("speechPitch-menulist").selectedIndex = CLC_CS_Preferences.CLC_CS_Query_SpeechPitch() + 2;
}
