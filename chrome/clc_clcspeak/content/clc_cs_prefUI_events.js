//------------------------------------------
//These functions are all designed specifically
//for the "clc_clcspeak_pref_ui.xul" dialogue.
//------------------------------------------

var CLC_CS_VoiceTestSentence = "Thank you for using click, speak JS.";

function CLC_Window() {
  return window;
}

function CLC_CS_PrefUI_PopUpHiddenHandler() {
  var speechRate = document.getElementById("speechRate-menulist").selectedIndex - 2;
  var speechPitch = document.getElementById("speechPitch-menulist").selectedIndex - 2;

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
