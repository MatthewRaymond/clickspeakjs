const addOnID = "{D1517460-5F8F-11DB-B0DE-0800200CA666}";

content.addEventListener("pageshow", CLC_CS_Init, true); //initializes the system
content.addEventListener("close", CLC_Shutdown, true);   //stop speaking when moving on

addMessageListener(addOnID + ":CLC_CS_SpeakSelection", function(message) {
  CLC_CS_SpeakSelection();
});

addMessageListener(addOnID + ":CLC_CS_SpeakPage", function(message) {
  CLC_CS_SpeakPage();
});

addMessageListener(addOnID + ":CLC_CS_StopSpeaking", function(message) {
  CLC_CS_StopSpeaking();
});

addMessageListener(addOnID + ":CLC_Stop", function(message) {
  CLC_Stop();
});

addMessageListener(addOnID + ":CLC_Reset", function(message) {
  CLC_Reset();
  CLC_SetRate(message.rate, 2);
  CLC_SetPitch(message.pitch, 2);
});

CLC_CS_Init();
