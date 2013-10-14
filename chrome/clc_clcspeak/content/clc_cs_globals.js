//Globals
var CLC_CS_CurrentURI = "";      //Remember the current URI so that the user will not lose their place because of reinitialization if the page auto refreshes.

var CLC_CS_DebugStringDump = "";   //CLC_CS_DumpToDebug will dump messages here.
var CLC_CS_CurrentAtomicObject = 0;
var CLC_CS_PrevAtomicObject = 0;

var CLC_CS_LastScrollable = 0;      //Last object that was determined to be scrollable


var CLC_CS_SpeakEventBuffer = "";   //Must use buffering! Else the string is deallocated
                                    //before CLC_Say can get it!  

var CLC_CS_Stop = true;             //Used to stop the auto reader

var CLC_CS_Started = false;         //Used to determine if Fire Vox has been initialized

var CLC_CS_Pref;              //Used for accessing preferences. Be sure to initialize first!

var CLC_CS_SPCSSRules;            //Array of CSS Speech Property rule objects for the current page


var CLC_CS_UseCursorMatching = true;  //Used for determining if the reader should attempt to match 
                                      //the current cursor position. Should be true except when there is
                                      //no other way to get out of a looping situation.

var CLC_CS_HttpRequestObjectArray;       //HTTP Request Objects need an array since there could be multiple external stylesheets
var CLC_CS_ExternalStyleSheetsArray;     //External Stylesheets need an array since there could be multiple external stylesheets
var CLC_CS_ExternalStyleSheetsProcessed;  //Don't try to reprocess stylesheets for a page that is already being processed
var CLC_CS_ExternalCSSProcessingTimeOut = 1000; //Set timeout to 1 second for processing external css stylesheets; better to quit than to bog the system.

var CLC_CS_SentencesArray;                //Array of holding the set of sentences generated from CLC_CS_CurrentAtomicObject.
var CLC_CS_SentencesArrayIndex = -1;      //Current position in the CLC_CS_SentencesArray. -1 indicates that this is a new array that has not been used yet.

var CLC_CS_DefaultLanguage = "en";  //Specifies the default language that CLC Speak should use


var CLC_CS_WasCaretEnabled = true;  //Specifies whether the user had caret enabled or not
var CLC_CS_LastFocusedObject;       //Last object that received focus

var CLC_CS_StringBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
var CLC_CS_StringBundle = CLC_CS_StringBundleService.createBundle("chrome://clc_clcspeak/locale/clc_clcspeak.properties");
var CLC_CS_EndOfDocument = CLC_CS_StringBundle.GetStringFromName("EndOfDocument");
var CLC_CS_VoiceTestSentence = CLC_CS_StringBundle.GetStringFromName("VoiceTestSentence");

