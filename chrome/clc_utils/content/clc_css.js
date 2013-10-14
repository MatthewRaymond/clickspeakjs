//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: CSS Functions
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
 

//Last Modified Date 11/28/2006

//Will return a style object for the requested targ_DOMobj.
//If there is no style object, then it returns null.
//
function CLC_GetStyle(targ_DOMobj){   
   //Make sure targ_DOMobj is valid
   if (targ_DOMobj == 0){
      return 0;
      }
   answer = 0;
   //If targ_DOMobj is the document itself, give up.
   if (targ_DOMobj.nodeName.toLowerCase() == "html"){
      return answer;
      }
   //getComputedStyle is risky and may fail for certain nodes, especially text nodes
   try{
      answer = CLC_Window().getComputedStyle(targ_DOMobj, null);
      }
   catch(e){
      answer = 0;
      }
   //No style was computed, attempt computation on parentNode.
   if (answer == 0){
      try{
         targ_DOMobj = targ_DOMobj.parentNode;
         }
      catch(e){
         return 0;
         }
      return CLC_GetStyle(targ_DOMobj);
      }
   return answer;
   }

//------------------------------------------
//Fetches the raw string of a stylesheet object if
//that is an embedded stylesheet.
//External stylesheets are not supported.
//The raw string will contain all of the CSS rules 
//in that stylesheet object.
//Stylesheets can be found in this array:
//CLC_Window().document.styleSheets[x]
//
function CLC_FetchCSSRawString(styleSheetObj){
   var styleSheetRawString;
   if (styleSheetObj.ownerNode.tagName.toLowerCase() == "style"){
      styleSheetRawString = styleSheetObj.ownerNode.innerHTML;
      }
   return styleSheetRawString;
   }

//------------------------------------------
//Strips away comments enclosed by /* and */ in
//a CSS string. 
//
function CLC_StripEnclosedComments(css_string){
   var start = css_string.indexOf("/*");
   var answer = "";
   var strIndex = 0;
   while(start != -1){
      while(strIndex < start){
         answer = answer + css_string[strIndex++];
         }
      var end = remaining.indexOf("*/",start);
      if (end == -1){
         var unclosedCommentError = new Error ("Comment started but not closed");
         throw unclosedCommentError;
         }
      strIndex = end+2;
      start = css_string.indexOf("/*",end);
      }
   while(strIndex < css_string.length){
      answer = answer + css_string[strIndex++];
      }
   return answer;
   }

//------------------------------------------
//Takes a stylesheet object and returns an 
//array with 2 subarrays; the first is an 
//array of selector texts, the second is an array
//of the rules that are to be activated by the
//selector texts.
//The comments have been stripped from the rules,
//but no real processing has taken place.
//Throws an invalidStyleSheetError if there is 
//a problem with the stylesheet object's syntax.
//
function CLC_GenerateRawCSSArray(styleSheetObj){
   var combined_array = new Array(2);
   //Parsing this manually is risky - use a try/catch to be safe
   try{

      var css_rawstring = CLC_StripEnclosedComments(CLC_FetchCSSRawString(styleSheetObj));
      var selector_array = new Array();
      for (var i=0; i < styleSheetObj.cssRules.length; i++){
         selector_array.push(styleSheetObj.cssRules[i].selectorText);
         }

      var css_rawstrings_split_array = new Array();
      var temp_string = css_rawstring;
      for (var i=0; i < selector_array.length; i++){
         //Find the start of the rule by looking for the selector text
         var start = temp_string.indexOf(selector_array[i]);
         temp_string = temp_string.substring(start, temp_string.length);
         //The rule contents are between the { immediately after the
         //start and the first }.
         start = temp_string.indexOf("{");
         temp_string = temp_string.substring(start+1, temp_string.length);
         var end = temp_string.indexOf("}");
         var rule_contents = temp_string.substring(0,end);
         css_rawstrings_split_array.push(rule_contents);
         //Cut off the first part of the string and repeat
         temp_string = temp_string.substring(end+1, temp_string.length);
         }   
      combined_array[0] = selector_array;
      combined_array[1] = css_rawstrings_split_array;

   //End of the try block
      } catch(e){  
      //Something went wrong; most likely the CSS syntax was off somewhere.
      var cssSyntaxError = new Error ("CSS syntax is invalid.");
      throw cssSyntaxError;
      }

   //Sanity check - returned array should have the 
   //same number of selector texts as rules; something 
   //is horribly wrong if this is not true.
   if (combined_array[0].length != combined_array[1].length){
      var cssSyntaxError = new Error ("CSS syntax is invalid.");
      throw cssSyntaxError;
      }

   return combined_array;
   }

//------------------------------------------
//Determines if a string contains a rule relevant 
//to CSS speech properties. True if it is; otherwise false. 
//This is only a rough check that is designed to be as
//fast as possible to narrow the search space; full parsing
//will be required to determine true relevancy.
//This function will need to be updated for the system to 
//accept newer properties.
//
function CLC_IsStringRelevantToSpeechProperties(target){
   var known_properties = new Array();

   //Add new properties here to make them recognized
   known_properties.push("voice");
   known_properties.push("speak");
   known_properties.push("pause");
   known_properties.push("rest");
   known_properties.push("cue");
   known_properties.push("mark");
   known_properties.push("phonemes");
   known_properties.push("content");
   known_properties.push("say-instead");

   for (var i=0; i < known_properties.length; i++){
      if (target.indexOf(known_properties[i]) != -1){
         return true;
         }
       }
   return false;
   }

//------------------------------------------
//Takes a raw CSS array as generated by 
//CLC_GenerateRawCSSArray(styleSheetObj) and
//returns a copy of the array that only has
//the rules which are relevant to speech properties;
//the other rules are removed.
//
function CLC_OnlyRulesRelevantToSpeechProperties(rawcssarray){
   var relevant_array = new Array(2);
   var selector_array = new Array();
   var rules_array = new Array();
   for (var i=0; i < rawcssarray[1].length; i++){
      if ( CLC_IsStringRelevantToSpeechProperties(rawcssarray[1][i]) ){
         selector_array.push(rawcssarray[0][i]);
         rules_array.push(rawcssarray[1][i]);
         }
      }
   relevant_array[0] = selector_array; 
   relevant_array[1] = rules_array;
   return relevant_array;
   }

//------------------------------------------
//Finds the value text of the target CSS 
//property in a rule string.
//
//CSS properties are of the form:
//   property_name: value_text;
//If there are multiple properties, then
//the end of value_text must have the ; mark, 
//otherwise the ; mark is optional.
//
//Returns the substring that contains the value_text
//if the rule_string contains that property_name.
//If the rule_string contains multiple instances of
//property_name, this will find the value_text of
//the last instance.
//If the rule_string contains no instances of
//property_name, this will return null.
//
//Note that the value_text is a string; further
//processing will be necessary for most properties.
//
function CLC_FindValueText(property_name, rule_string){
   //Get to the : of the desired rule
   var start = rule_string.indexOf(property_name+":");
   if (start == -1){
      start = rule_string.indexOf(property_name+" ");
      }
   if (start == -1){
      return "";
      }
   var remaining = rule_string.substring((start+property_name.length), rule_string.length);

   //Remove the :
   start = remaining.indexOf(":");
   if (start == -1){
      return "";
      }
   remaining = remaining.substring(start+1, remaining.length);

   //Find the end of the value which is either ; or nothing
   var end = remaining.indexOf(";");
   if (end == -1){
      return remaining;
      }
   var value_text = remaining.substring(0,end);

   //Search again because the last occurrence takes precedence
   remaining = remaining.substring(end+1, remaining.length);
   var next_occurrence = (CLC_FindValueText(property_name, remaining));
   if (next_occurrence){
      value_text = next_occurrence;
      }
   return value_text;
   }

//------------------------------------------
//Splits a selector string up into an array of selectors
//
function CLC_SplitSelectors(selector_string){
   var remaining = CLC_RemoveLeadingSpaces(selector_string); 
   var selectors = new Array();
   var comma_pos = remaining.indexOf(","); 

   while (comma_pos != -1){
      var firsthalf = CLC_RemoveLeadingSpaces( remaining.substring(0, comma_pos) );
      selectors.push(firsthalf);
      remaining = remaining.substring(comma_pos+1, remaining.length);
      comma_pos = remaining.indexOf(","); 
      }
   selectors.push(remaining);

   return selectors;
   }

//------------------------------------------
//Decomposes a compound selector string into an 
//array of the simple selectors that make form it
//
function CLC_DecomposeCompoundSelector(selector_string){
   var remaining = CLC_RemoveLeadingSpaces(selector_string); 
   var selectors = new Array();
   var space_pos = remaining.indexOf(" "); 

   while (space_pos != -1){
      var firsthalf = CLC_RemoveLeadingSpaces( remaining.substring(0, space_pos) );
      selectors.push(firsthalf);
      remaining = remaining.substring(space_pos+1, remaining.length);
      space_pos = remaining.indexOf(" "); 
      }
   selectors.push(remaining);

   return selectors;
   }


//------------------------------------------
//Finds the matching DOM object for a simple selector, given
//a starting target DOM object. Returns 0 if there is no match.
//If you have a compound selector, you have to start from the
//last part of the compound selector, and then move on to the
//previous part of the compound selector.
//
function CLC_FindMatchingDOMObjForSimpleSelector(targ_DOMObj, simpleSelector){

   var match = false;

   while (!match){   
      match = true;

      //Something is wrong here, give up 
      if (!targ_DOMObj){
         return 0;
         }
      //Should have a tagName; if not, go to the parentNode
      while (!targ_DOMObj.tagName){
         targ_DOMObj = targ_DOMObj.parentNode;      
         if (!targ_DOMObj){         
           return 0;
           }
         }
   
      //Check className
      if (simpleSelector[2] != "*") {  
         if (targ_DOMObj.className != simpleSelector[2]){ 
            match = false;      
            }
         }
   
   //Check id
      if (simpleSelector[1] != "*") {   
         if (targ_DOMObj.id != simpleSelector[1]){      
            match = false;         
            }
         }
   
   //Check tagName
   if (simpleSelector[0] != "*") {  
      if (targ_DOMObj.tagName.toLowerCase() != simpleSelector[0].toLowerCase()){
            match = false;   
            }      
         }
      //Give up if you are at the HTML element
      if (targ_DOMObj.tagName.toLowerCase() == "html"){
         return 0;
         }   
      //Try parent object
      if (!match){   
        targ_DOMObj = targ_DOMObj.parentNode;      
        }
      }

   //There was a match, return it
   return targ_DOMObj;
   }
//------------------------------------------
