//------------------------------------------
//These functions are all designed specifically
//for the "clc_clcspeak_pref_ui.xul" dialogue.
//------------------------------------------


//------------------------------------------
//Note that this is for keys within the "clc_firevox_pref_ui.xul" dialogue only!
//
function CLC_CS_PrefUI_PopUpHiddenHandler() {
   var engineId = document.getElementById("speechEngine-menulist").selectedItem.id;
   var speechRate = document.getElementById("speechRate-menulist").selectedIndex - 2;
   var speechPitch = document.getElementById("speechPitch-menulist").selectedIndex - 2;

   if (engineId == 1){
     CLC_CS_StartSpeakJSTTS();
   }

   var pitchArray = new Array();
   pitchArray.push(speechPitch);
   pitchArray.push(2); //Enumeration

   var pitchRangeArray = new Array();
   pitchRangeArray.push(0);
   pitchRangeArray.push(-1); //Ignore pitch range

   var rateArray = new Array();
   rateArray.push(speechRate);
   rateArray.push(2); //Enumeration

   var speechPropertiesArray = new Array();
   speechPropertiesArray.push(pitchArray);
   speechPropertiesArray.push(pitchRangeArray);
   speechPropertiesArray.push(rateArray);

   var dummyArray = new Array();

   CLC_ShoutWithProperties(CLC_CS_VoiceTestSentence, speechPropertiesArray, dummyArray); 
}
