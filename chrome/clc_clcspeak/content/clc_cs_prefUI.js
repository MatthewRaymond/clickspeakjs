function CLC_CS_PrefUI_Load(){
   CLC_CS_InitPref();
   CLC_CS_PrefUI_UpdateBlanks();
}


function CLC_CS_PrefUI_Save(){
   CLC_CS_SetPref_SpeechEngine(document.getElementById("speechEngine-menulist").selectedItem.id);
   CLC_CS_SetPref_SpeechRate(document.getElementById("speechRate-menulist").selectedIndex - 2);
   CLC_CS_SetPref_SpeechPitch(document.getElementById("speechPitch-menulist").selectedIndex - 2);

   //Set a flag here so that the instance of CLiCk, Speak in the browser will know to restart 
   //CLC-4-TTS with the new properties.
   CLC_CS_SetPref_PrefsChanged(true);

   return true;
}


function CLC_CS_PrefUI_UpdateBlanks() {
   var engineId = CLC_CS_Query_SpeechEngine();
   var speechEngineMenu = document.getElementById("speechEngine-menulist");

   //Load the settings
   speechEngineMenu.selectedIndex = 0;

   if (engineId != -1){     
     while(speechEngineMenu.selectedItem.id != engineId) {
       speechEngineMenu.selectedIndex++;
     }
   }	   

   document.getElementById("speechRate-menulist").selectedIndex = CLC_CS_Query_SpeechRate() + 2;
   document.getElementById("speechPitch-menulist").selectedIndex = CLC_CS_Query_SpeechPitch() + 2;
}
