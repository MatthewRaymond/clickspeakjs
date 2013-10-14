//Functions for dealing with CSS Speech Properties



//-----------------------------------------------
//Initializes the CLC_CS_SPCSSRules global variable.
//
function CLC_CS_InitSPCSSRules(){
   CLC_CS_SPCSSRules = new Array();

   for (var i=0; i < CLC_Window().document.styleSheets.length; i++) {
      //Use a try block here since an external (or incorrectly defined) stylesheet
      //would cause an exception when processed. An error in one stylesheet
      //should not prevent subsequent stylesheets from being processed.
      try {
         var styleSheetObj1 = CLC_Window().document.styleSheets[i];
         var css_array = CLC_GenerateRawCSSArray(styleSheetObj1);
         css_array = CLC_OnlyRulesRelevantToSpeechProperties(css_array);

         for (var j=0; j < css_array[0].length; j++) {
            var myRuleObj = CLC_GenerateSPRuleObj(css_array[0][j], css_array[1][j]);
            if (myRuleObj){
               CLC_CS_SPCSSRules.push(myRuleObj);
            }         
         }
      } catch(e) {
      }
   }

   //Process any external stylesheets 
   CLC_CS_ExternalStyleSheetsProcessed = false;
   CLC_CS_ExternalStyleSheetsArray = new Array();
   CLC_CS_ExternalStyleSheetsTextArray = new Array();
   CLC_CS_HttpRequestObjectArray = new Array();

   for (var k=0; k < CLC_Window().document.styleSheets.length; k++){
      var styleSheetObj2 = CLC_Window().document.styleSheets[k];

      if (styleSheetObj2.href != CLC_Window().document.baseURI){
         CLC_CS_GetExternalCSS(styleSheetObj2);
      }
   }
}

//-----------------------------------------------
//Tries to apply the appropriate CSS speech property rule
//to the targ_atomicObj and calls CLC_ReadWithProperties.
//If it is unable to apply the speech property (no property or
//some fault has occurred), it will read it without properties.
//
function CLC_CS_ReadUsingProperties(targ_atomicObj){
   try{
      var currentSPRule = CLC_SynthesizeSPRuleObj(targ_atomicObj, CLC_CS_SPCSSRules);
      if (currentSPRule){
         var theTextContent = CLC_GetTextContent(targ_atomicObj);
         if (currentSPRule.specialActions[0] && (currentSPRule.specialActions[0][1] == 1) ){
            theTextContent = currentSPRule.specialActions[0][0];
            }
         CLC_ReadWithProperties(targ_atomicObj, theTextContent, currentSPRule.properties, currentSPRule.additional);
         }
      else {
         CLC_Read(targ_atomicObj,CLC_GetTextContent(targ_atomicObj), 0);
         }
      } catch(e){
         CLC_Read(targ_atomicObj,CLC_GetTextContent(targ_atomicObj), 0);
      }
   }

//-----------------------------------------------

function CLC_CS_GetExternalCSS(styleSheetObj){
   var targ_url = styleSheetObj.href;
   var HttpRequestObject = new XMLHttpRequest();
   HttpRequestObject.open("GET", targ_url, true);
   HttpRequestObject.send(null);
   CLC_CS_HttpRequestObjectArray.push(HttpRequestObject);
   CLC_CS_ExternalStyleSheetsArray.push(styleSheetObj);

   //It would seem sensible to give each of the HttpRequest objects its own handler,
   //but this next line doesn't work correctly because the earlier arguments are lost
   //and only the last argument counts.
   //CLC_CS_HttpRequestObjectArray[CLC_CS_HttpRequestObjectArray.length-1].onreadystatechange = function() {     CLC_CS_ProcessExternalCSS(CLC_CS_ExternalStyleSheetsArray[CLC_CS_ExternalStyleSheetsArray.length-1],
      CLC_CS_HttpRequestObjectArray[CLC_CS_HttpRequestObjectArray.length-1];
   //};
   //Therefore, run the function with no arguments and simply have that function 
   //iterate through all the HttpRequest objects in the global CLC_CS_HttpRequestObjectArray.

   CLC_CS_HttpRequestObjectArray[CLC_CS_HttpRequestObjectArray.length-1].onreadystatechange = CLC_CS_StartExternalCSSProcessing;

   }

//-----------------------------------------------
//Inject a delay to make sure that all the stylesheets have loaded before doing anything
//
function CLC_CS_StartExternalCSSProcessing() {
   if (CLC_CS_ExternalStyleSheetsProcessed) {
      return;
   }

   window.setTimeout(function(){CLC_CS_ProcessExternalCSS();}, 100); 
   CLC_CS_ExternalStyleSheetsProcessed = true;
}

//-----------------------------------------------
function CLC_CS_ProcessExternalCSS() {
  for (var i=0; i < CLC_CS_HttpRequestObjectArray.length; i++) {
    //Do all of this in a try block. One bad stylesheet should not stop the rest from loading.
    try {
      var HttpRequestObject = CLC_CS_HttpRequestObjectArray[i];
      var styleSheetObj = CLC_CS_ExternalStyleSheetsArray[i];

      //Build a dummy stylesheet object from the response text
      //so that the embedded CSS parsing code can be used.   
      var styleSheets = CLC_Window().document.createElement("style");
      styleSheets.textContent = HttpRequestObject.responseText;
      var dummyStyleSheetObj = new Object();
      dummyStyleSheetObj.ownerNode = styleSheets;

      //The code for parsing embedded CSS relies on having the selector text.
      //Copy this over to the dummy stylesheet
      dummyStyleSheetObj.cssRules = styleSheetObj.cssRules;

      //Treat it as a normal embedded stylesheet object    
      var css_array = CLC_GenerateRawCSSArray(dummyStyleSheetObj);
      css_array = CLC_OnlyRulesRelevantToSpeechProperties(css_array);

      for (var j=0; j < css_array[0].length; j++){
        var myRuleObj = CLC_GenerateSPRuleObj(css_array[0][j], css_array[1][j]);

        if (myRuleObj) {
          CLC_CS_SPCSSRules.push(myRuleObj);
        }
      }
    } catch(e) {
    }
  }

  CLC_CS_ProcessingExternalStyleSheets = false;
} 

//-----------------------------------------------
