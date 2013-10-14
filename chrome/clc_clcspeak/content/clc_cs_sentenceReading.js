//------------------------------------------
//Reads the sentence using the properties of 
//the atomic DOM object that it came from.
//
function CLC_CS_ReadSentenceUsingProperties(targ_atomicObj, targ_string){
   var currentObjLang = CLC_Content_FindLanguage(CLC_CS_CurrentAtomicObject);

   CLC_SetLanguage(currentObjLang);

   try {
      var currentSPRule = CLC_SynthesizeSPRuleObj(targ_atomicObj, CLC_CS_SPCSSRules);

      if (currentSPRule) {
         var theTextContent = targ_string;

         if (currentSPRule.specialActions[0] && (currentSPRule.specialActions[0][1] == 1) ) {
            theTextContent = currentSPRule.specialActions[0][0];
         }

         CLC_ReadWithProperties(targ_atomicObj, theTextContent, currentSPRule.properties, currentSPRule.additional);
      } else {
         CLC_CS_ReadSentenceUsingProperties_CatchOrNoRule(targ_atomicObj, targ_string);
      }
   } catch(e) {
      CLC_CS_ReadSentenceUsingProperties_CatchOrNoRule(targ_atomicObj, targ_string);
   }

   CLC_SetLanguage(CLC_CS_DefaultLanguage);
}

function CLC_CS_ReadSentenceUsingProperties_CatchOrNoRule(targ_atomicObj, targ_string)
{
  var speechProperties_array = new Array();
  
  speechProperties_array.push([0,-1]);
  speechProperties_array.push([0,-1]);
  speechProperties_array.push([0,-1]);

  CLC_ReadWithProperties(targ_atomicObj, targ_string, speechProperties_array, new Array());
}


//------------------------------------------
//Moves to the next sentence in the sentence array;
//if this causes the index to be out of bounds, it is
//assumed that CLC_CS_ReadContentBySentence will fix it.
//
function CLC_CS_MoveForwardOneSentence(){
   if (CLC_CS_SentencesArrayIndex == -1){
      CLC_CS_SentencesArrayIndex = 0;
      return;
      }
   CLC_CS_SentencesArrayIndex++;
   }

//------------------------------------------
//Tries to read a sentence in the forward direction.
//If it succeeds, it will return true;
//if it fails, it will return false.
//
function CLC_CS_TryToReadSentence(){
   CLC_CS_MoveForwardOneSentence();

   if (CLC_CS_SentencesArray && CLC_CS_SentencesArray[CLC_CS_SentencesArrayIndex]){ 
      if (!CLC_IsSpeakableString(CLC_CS_SentencesArray[CLC_CS_SentencesArrayIndex])){
         return CLC_CS_TryToReadSentence();
         }
      CLC_SelectSentence(CLC_CS_CurrentAtomicObject, CLC_CS_SentencesArray, CLC_CS_SentencesArrayIndex);
      CLC_CS_SentenceScroll();
      CLC_CS_ReadSentenceUsingProperties(CLC_CS_CurrentAtomicObject, CLC_CS_SentencesArray[CLC_CS_SentencesArrayIndex]);
      return true;
      }
   return false;
   }


//------------------------------------------
//Reads forward through the content.
//Reading will be done by sentences rather than chunks.
//
function CLC_CS_ReadContentBySentence(){
   if (!CLC_Ready()){
      CLC_Interrupt();
      }
   //Read the next sentence if the user has not somehow changed the position AND if it's possible;
   //otherwise, reset the sentences array and start over.
   //Note: The comparison must be done in this order since trying to read the next 
   //sentence will cause it to be read - something which should NOT happen if the 
   //user has changed the position already.
   if (!CLC_CS_UseCursorMatching && CLC_CS_TryToReadSentence()){
      return;
      }
   else {
      CLC_CS_SentencesArray = 0;
      CLC_CS_SentencesArrayIndex = -1;
      }
   CLC_Unhighlight();
   CLC_CS_SetCurrentAtomicObject();
   if (CLC_CS_CurrentAtomicObject){
      //Cursor matching is known to be risky and can 
      //lead to unintentional looping. 
      //Until the user intentionally moves the cursor, 
      //this should be false.
      CLC_CS_UseCursorMatching = false;

      CLC_CS_AdjustScreen();

      //Setup the sentence array
      //Handle MathML differently. Since the generated sentence is not the same as what is displayed,
      //lump the whole thing as one sentence.
      if (CLC_CS_CurrentAtomicObject.tagName && CLC_CS_CurrentAtomicObject.tagName.toLowerCase() == "math"){
         CLC_CS_SentencesArray = new Array();
         CLC_CS_SentencesArray.push(CLC_GetTextContent(CLC_CS_CurrentAtomicObject));
         }
      //If it is not MathML, handle it normally.
      else{
         CLC_CS_SentencesArray = CLC_MakeSegments(CLC_GetTextContent(CLC_CS_CurrentAtomicObject));
         }

      //Try to read the sentence
      CLC_CS_TryToReadSentence();

      //If there is no way to read the next sentence, then announce the status if applicable.
      if ( CLC_CS_SentencesArray && !CLC_CS_SentencesArray[CLC_CS_SentencesArrayIndex + 1] ){
         try{
            //Say the object's status if it has a status
            var CurrentAtomicObjectStatus = CLC_GetStatus(CLC_CS_CurrentAtomicObject);
            if (CurrentAtomicObjectStatus){
               CLC_Say(CurrentAtomicObjectStatus, 0);
               }
            }
         catch(e){}
         }
      }
   else {
      CLC_Say(CLC_CS_EndOfDocument, 0); 
   }
}


//------------------------------------------
