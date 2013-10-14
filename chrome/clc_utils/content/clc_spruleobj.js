//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Speech Property Object
//by Charles L. Chen

 
//This program is free software; you can redistribute it
//and/or modify it under the terms of the GNU General Public
//License as published by the Free Software Foundation;
//either version 2.1 of the License, or (at your option) any
//later version.  This program is distributed in the hope
//that it will be useful, but WITHOUT ANY WARRANTY; without
//even the implied warranty of MERCHANTABILITY or FITNESS FOR
//A PARTICULAR PURPOSE. See the GNU General Public License for
//more details.  You should have received a copy of the GNU
//General Public License along with this program; if not, look
//on the web at on the web at http://www.gnu.org/copyleft/gpl.html
//or write to the Free Software Foundation, Inc., 59 Temple Place,
//Suite 330, Boston, MA 02111-1307, USA.
 

//Last Modified Date 2/20/2005


//Speech property rule object to store the parsed 
//results of a CSS rule that is relevant to 
//speech properties.
//
//The "selectors" member is an array used to store
//the selectors for determining when a speech property
//rule is applicable. Each selector is itself an array of 
//arrays of 3 strings: [0] = tagName, [1] = id, 
//[2] = className. If a string is "*", then it matches 
//everything. It is an array of arrays since there 
//can be compound selectors.
//
//Example - "element1#id1.class1 element2#id2.class2, element3#id3.class3"
//would be stored as shown below:
// selectors[0][0][0] == element1
// selectors[0][0][1] == id1
// selectors[0][0][2] == class1
// selectors[0][1][0] == element2
// selectors[0][1][1] == id2
// selectors[0][1][2] == class2
// selectors[1][0][0] == element3
// selectors[1][0][1] == id3
// selectors[1][0][2] == class3
//
//The "properties" member is identical to the
//"speechProperties_array" used in the CLC-4-TTS 
//core and is designed so that it can be passed to
//the core as is if the rule applies.
//
//The "additional" member is identical to the
//"additionalProperties_array" used in the CLC-4-TTS 
//core and is designed so that it can be passed to
//the core as is if the rule applies.
//
//The "specialActions" member is an array used for special 
//actions that will need to be taken. [0] is the string to 
//be used for the action, [1] is the mode. For example, string 
//replacement using say-instead would be a special action. 
//Having an audio file being played by content replacement
//is another situation which might be considered be a 
//special action. 
//The special actions are indexed as follows:
//  [0] = say-instead
//



//------------------------------------------
//Constructor for the Speech Property Rule Object
//
function CLC_SPRuleObj(){
   this.selectors = new Array();
   this.properties = new Array();
   this.additional = new Array();
   this.specialActions = new Array();
   }

//------------------------------------------
//Parses a rules string for the say-instead property.
//Returns an array that contains the string specified 
//by say-instead with a mode of 1.
//Returns a null string ("") and mode -1 if there 
//is no say-instead.
//
function CLC_ParseSayInsteadProperty(rules_string){
   var property_name = "say-instead";
   var answer = new Array(2);
   answer[0] = CLC_FindValueText(property_name, rules_string);
   answer[1] = -1;
   if (answer[0]){
      answer[1] = 1;
      }
   return answer;
   }

//------------------------------------------
//Parses a rules string for the pitch property.
//Generates an array of two integers where [0] is the 
//value and [1] is the mode that represents the 
//pitch property. See CLC-4-TTS core's documentation
//on speech properties for details on the definitions
//of value and mode.
//Returns -1 for mode if the rules string did not contain
//a pitch property.
//
function CLC_ParsePitchProperty(rules_string){
   var property_name = "voice-pitch";
   var positiveArray = new Array(3);
   var negativeArray = new Array(3);
   positiveArray[0] = "medium";
   positiveArray[1] = "high";
   positiveArray[2] = "x-high";
   negativeArray[0] = "medium";
   negativeArray[1] = "low";
   negativeArray[2] = "x-low";
   return CLC_GenericPropertyParser(property_name, rules_string, positiveArray, negativeArray);
   }


//------------------------------------------
//Parses a rules string for the pitch range property.
//Generates an array of two integers where [0] is the 
//value and [1] is the mode that represents the 
//pitch property. See CLC-4-TTS core's documentation
//on speech properties for details on the definitions
//of value and mode.
//Returns -1 for mode if the rules string did not contain
//a pitch property.
//
function CLC_ParsePitchRangeProperty(rules_string){
   var property_name = "voice-pitch-range";
   var positiveArray = new Array(3);
   var negativeArray = new Array(3);
   positiveArray[0] = "medium";
   positiveArray[1] = "high";
   positiveArray[2] = "x-high";
   negativeArray[0] = "medium";
   negativeArray[1] = "low";
   negativeArray[2] = "x-low";
   return CLC_GenericPropertyParser(property_name, rules_string, positiveArray, negativeArray);
   }

//------------------------------------------
//Parses a rules string for the rate property.
//Generates an array of two integers where [0] is the 
//value and [1] is the mode that represents the 
//pitch property. See CLC-4-TTS core's documentation
//on speech properties for details on the definitions
//of value and mode.
//Returns -1 for mode if the rules string did not contain
//a pitch property.
//
function CLC_ParseRateProperty(rules_string){
   var property_name = "voice-rate";
   var positiveArray = new Array(3);
   var negativeArray = new Array(3);
   positiveArray[0] = "medium";
   positiveArray[1] = "fast";
   positiveArray[2] = "x-fast";
   negativeArray[0] = "medium";
   negativeArray[1] = "slow";
   negativeArray[2] = "x-slow";
   return CLC_GenericPropertyParser(property_name, rules_string, positiveArray, negativeArray);
   }

//------------------------------------------
//Parses a rules string for the volume property.
//Generates an array of two integers where [0] is the 
//value and [1] is the mode that represents the 
//pitch property. See CLC-4-TTS core's documentation
//on speech properties for details on the definitions
//of value and mode.
//Returns -1 for mode if the rules string did not contain
//a pitch property.
//
function CLC_ParseVolumeProperty(rules_string){
   var property_name = "voice-volume";
   var positiveArray = new Array(3);
   var negativeArray = new Array(4);
   positiveArray[0] = "medium";
   positiveArray[1] = "loud";
   positiveArray[2] = "x-loud";
   negativeArray[0] = "medium";
   negativeArray[1] = "soft";
   negativeArray[2] = "x-soft";
   negativeArray[3] = "silent";
   return CLC_GenericPropertyParser(property_name, rules_string, positiveArray, negativeArray);
   }

//------------------------------------------
//Generic parser that parses a rules string for the property.
//See the CLC_MatchCSSEnumeration function for an explanation
//of positiveArray and negativeArray.
//Assumes that the rule is one with standard modes (absolute,
//percentage, and enumeration).
//Generates an array of two integers where [0] is the 
//value and [1] is the mode that represents the 
//pitch property. See CLC-4-TTS core's documentation
//on speech properties for details on the definitions
//of value and mode.
//Returns -1 for mode if the rules string did not contain
//a pitch property.
//
function CLC_GenericPropertyParser(property_name, rules_string, positiveArray, negativeArray){
   var answer = new Array(2);
   answer[0] = 0;
   answer[1] = -1;
   var value_str = CLC_FindValueText(property_name, rules_string);
   //No value for property
   if (value_str == ""){
      return answer;
      }
   //Check for percentage
   var percentage_sign = value_str.indexOf("%");
   if (percentage_sign != -1){
      value_str = value_str.substring(0, percentage_sign);
      //If there are + or - signs, then the percentage value is
      //as 100% +/- x%, as opposed to just simply x%
      if ( (value_str.indexOf("+") != -1) || (value_str.indexOf("-") != -1) ){
         answer[0] = parseFloat(value_str) + 100;
         }
      else {
         answer[0] = parseFloat(value_str);
         }
      if (!isNaN(answer[0])){
         answer[1] = 1;
         }
      return answer;
      }
   //Check for absolute value
   answer[0] = parseFloat(value_str);
   if (!isNaN(answer[0])){
      answer[1] = 0;
      return answer;
      }
   answer[0] = 0;
   //Check for enumeration
   answer[0] = CLC_MatchCSSEnumeration(value_str, positiveArray, negativeArray);
   if (!isNaN(answer[0])){
      answer[1] = 2;
      }
   else {
      answer[0] = 0;
      }
   return answer;
   }


//------------------------------------------
//Tries to match the target for an enumeration (such as
//"x-low", "low", "medium", "high", "x-high", etc.).
//The positive enumerations to be matched against are in
//positiveArray; the negative ones are in negativeArray.
//The value to be returned is the index of the array (multiplied
//by -1 in the case of the negativeArray).
//An example of a valid set of arrays would be:
//   var positiveArray = new Array(3);
//   var negativeArray = new Array(3);
//   positiveArray[0] = "medium";
//   positiveArray[1] = "high";
//   positiveArray[2] = "x-high";
//   negativeArray[0] = "medium";
//   negativeArray[1] = "low";
//   negativeArray[2] = "x-low";
//
//Note that medium is used twice since it is the 0 value in both cases.
//Returns NaN if there is no match.
//
function CLC_MatchCSSEnumeration(target, positiveArray, negativeArray){
   var cleaned = CLC_RemoveSpaces(target);
   for (var i = 0; i < positiveArray.length; i++){
      if (cleaned == positiveArray[i]){
         return i;
         }
      }
   for (var i = 0; i < negativeArray.length; i++){
      if (cleaned == negativeArray[i]){
         return (-1*i);
         }
      }
   return parseFloat("nomatch");
   }

   

//------------------------------------------
//Tries to generate a Speech Property Rule Object
//from the given selector_string and rules_string.
//Returns null if it fails to generate.
//
function CLC_GenerateSPRuleObj(selector_string, rule_string){
   var mySPRuleObj = new CLC_SPRuleObj();
   mySPRuleObj.selectors = CLC_CreateSelectorsMember(selector_string);

   //Parse for the "properties" member
   var tempArray = CLC_ParsePitchProperty(rule_string);
   mySPRuleObj.properties.push(tempArray);
   tempArray = CLC_ParsePitchRangeProperty(rule_string);
   mySPRuleObj.properties.push(tempArray);
   tempArray = CLC_ParseRateProperty(rule_string);
   mySPRuleObj.properties.push(tempArray);
   tempArray = CLC_ParseVolumeProperty(rule_string);
   mySPRuleObj.properties.push(tempArray);

   //Parse for the "specialActions" member
   tempArray = CLC_ParseSayInsteadProperty(rule_string);
   mySPRuleObj.specialActions.push(tempArray);

   //See if any valid rules were picked up   
   var failed = true;
   for (var i=0; i < mySPRuleObj.properties.length; i++){
      if (mySPRuleObj.properties[i][1] != -1){
         failed = false;
         }
      }
   for (var i=0; i < mySPRuleObj.specialActions.length; i++){
      if (mySPRuleObj.specialActions[i][1] != -1){
         failed = false;
         }
      }
   if (failed){
      mySPRuleObj = 0; //Clear it if it failed
      }
   return mySPRuleObj;
   }

//------------------------------------------
//Generates one parsed selector array of the form
//[0] = element, [1] = id, [2] = className from a selector string
//that only contains a simple selector. This will NOT work for
//compound selectors (separated by space) or multiple selectors 
//(separated by comma); instead, it must be called multiple times
//to handle those cases.
//
function CLC_ParseSimpleSelector(rawSelectorString){
   var parsed_selector = new Array(3);
   parsed_selector[0] = "*";
   parsed_selector[1] = "*";
   parsed_selector[2] = "*";
   //Get the element
   if ((rawSelectorString.charAt(0) != "#") && (rawSelectorString.charAt(0) != ".")) {
      var pos = rawSelectorString.indexOf("#");
      if (pos == -1){
         pos = rawSelectorString.indexOf(".");
         }
      if (pos == -1){
         parsed_selector[0] = rawSelectorString;
         }
      else {
         parsed_selector[0] = CLC_RemoveSpaces( rawSelectorString.substring(0, pos) );
         rawSelectorString = CLC_RemoveLeadingSpaces( rawSelectorString.substring(pos, rawSelectorString.length) );
         }
      }
   //Check for id (#)
   if (rawSelectorString.charAt(0) == "#"){
      rawSelectorString = rawSelectorString.substring(1, rawSelectorString.length);
      var pos = rawSelectorString.indexOf("."); 
      if (pos == -1){
         parsed_selector[1] = rawSelectorString;
         }
      else {
         parsed_selector[1] = CLC_RemoveSpaces( rawSelectorString.substring(0, pos) );
         rawSelectorString = CLC_RemoveLeadingSpaces( rawSelectorString.substring(pos, rawSelectorString.length) );
         }
      }
   //Check for className (.)
   if (rawSelectorString.charAt(0) == "."){
      parsed_selector[2] = CLC_RemoveSpaces( rawSelectorString.substring(1, rawSelectorString.length) );
      }
   return parsed_selector;
   }

//------------------------------------------
//Generates the "selectors" member of a 
//SPRuleObject from a selector_string.
//
function CLC_CreateSelectorsMember(selector_string){
   var rawSelectors = CLC_SplitSelectors(selector_string);
   var parsedSelectors = new Array();
   for (var k = 0; k < rawSelectors.length; k++){
      var selector_rule = new Array();
      var raw_selector_rule = CLC_DecomposeCompoundSelector(rawSelectors[k]);   
      for (var j = 0; j < raw_selector_rule.length; j++){   
         var temparray = CLC_ParseSimpleSelector(raw_selector_rule[j]);
         selector_rule.push(temparray);
         }
      parsedSelectors.push(selector_rule);
      }
   return parsedSelectors;
   }

//------------------------------------------
//Returns true if the target DOM object matches 
//the SP rule object; else, false.
//
function CLC_DoesDOMObjMatchRuleObj(targ_DOMObj, targ_SPRuleObj){
   for (var i=0; i < targ_SPRuleObj.selectors.length; i++){
      var tempObj = targ_DOMObj;
      //Start on the last part of the compound selector
      var j = targ_SPRuleObj.selectors[i].length - 1;
      tempObj = CLC_FindMatchingDOMObjForSimpleSelector(tempObj, targ_SPRuleObj.selectors[i][j]);
      while (tempObj){
         j--;
         //If the rule conditions are exhausted, then it matched.
         if (j < 0){
            return true;
            }
         tempObj = tempObj.parentNode;
         tempObj = CLC_FindMatchingDOMObjForSimpleSelector(tempObj, targ_SPRuleObj.selectors[i][j]);
         }
      }
   //All possible selectors have failed to match
   return false;
   }


//------------------------------------------
//Sythensizes an SPRUleObj for the target DOM object
//from an array of SPRule objects. This is not a simple
//match as multiple rules may match, resulting in an
//SPRuleObj that is some combination of the matching
//rules. If none of the rules match, an SPRuleObj cannot 
//be generated, so it returns 0.
//
function CLC_SynthesizeSPRuleObj(targ_DOMObj, SPRuleSet){
   var matchingRules = new Array();
   for (var i=0; i < SPRuleSet.length; i++){
      if (CLC_DoesDOMObjMatchRuleObj(targ_DOMObj, SPRuleSet[i])){
         matchingRules.push(SPRuleSet[i]);
         }
      }
   if (matchingRules.length < 1){
      return 0;
      }
   var myRuleObj = matchingRules[0];
   for (var i=1; i < matchingRules.length; i++){
      for (var j=0; j < matchingRules[i].properties.length; j++){
         if (matchingRules[i].properties[j][1] != -1){
            myRuleObj.properties[j] = matchingRules[i].properties[j];
            }
         }
      }
   for (var i=1; i < matchingRules.length; i++){
      for (var j=0; j < matchingRules[i].specialActions.length; j++){
         if (matchingRules[i].specialActions[j][1] != -1){
            myRuleObj.specialActions[j] = matchingRules[i].specialActions[j];
            }
         }
      }
   return myRuleObj;
   }

//------------------------------------------








