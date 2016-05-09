//Globals
var CLC_CS_CurrentURI = "";      //Remember the current URI so that the user will not lose their place because of reinitialization if the page auto refreshes.

var CLC_CS_DebugStringDump = "";   //CLC_CS_DumpToDebug will dump messages here.
var CLC_CS_CurrentAtomicObject = 0;
var CLC_CS_PrevAtomicObject = 0;

var CLC_CS_Stop = true;             //Used to stop the auto reader

var CLC_CS_SPCSSRules;            //Array of CSS Speech Property rule objects for the current page


var CLC_CS_UseCursorMatching = true;  //Used for determining if the reader should attempt to match 
                                      //the current cursor position. Should be true except when there is
                                      //no other way to get out of a looping situation.

var CLC_CS_HttpRequestObjectArray;       //HTTP Request Objects need an array since there could be multiple external stylesheets
var CLC_CS_ExternalStyleSheetsArray;     //External Stylesheets need an array since there could be multiple external stylesheets
var CLC_CS_ExternalStyleSheetsProcessed;  //Don't try to reprocess stylesheets for a page that is already being processed

var CLC_CS_SentencesArray;                //Array of holding the set of sentences generated from CLC_CS_CurrentAtomicObject.
var CLC_CS_SentencesArrayIndex = -1;      //Current position in the CLC_CS_SentencesArray. -1 indicates that this is a new array that has not been used yet.

var CLC_CS_LastFocusedObject;       //Last object that received focus

var CLC_CS_EndOfDocument = "End Of Document.";

var CLC_CS_DefaultLanguage = "en/en-us";

var CLC_CS_WasCaretEnabled = true;

function CLC_CS_Query_SpeechRate() {
  var results = sendSyncMessage(addOnID + ":CLC_CS_Query_SpeechRate");

  return results[0].result;
}

function CLC_CS_Query_SpeechPitch() {
  var results = sendSyncMessage(addOnID + ":CLC_CS_Query_SpeechPitch");

  return results[0].result;
}
