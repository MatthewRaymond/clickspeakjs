//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Segment
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
 

//Last Modified Date 4/29/2006



//------------------------------------------
//Takes a text_string and returns it in 
//segmented form as an array of strings.
//
function CLC_MakeSegments(text_string){
   var tempString = text_string;
   var segmentsArray = new Array();
   while (tempString){
      var cutpoint = CLC_GetFirstSplitPos(tempString);
      var tempSeg;
      if (cutpoint != -1){
         tempSeg = tempString.substring(0,cutpoint+1);
         tempString = tempString.substring(cutpoint+1);
         }
      else{
         tempSeg = tempString;
         tempString = "";
         }
      segmentsArray.push(tempSeg);
      }
   return segmentsArray;
   }


//------------------------------------------
//Returns the index of the text_string that is
//a split point for segmenting the text_string.
//If there is no split point, returns -1.
//
function CLC_GetFirstSplitPos(text_string){
   for (var i=0; i < text_string.length; i++){
      if (CLC_IsSplitPoint(text_string, i)){
         return i;
         }
      }
   return -1;
   }


//------------------------------------------
//
function CLC_IsSplitPoint(text_string, index_int){

   //Do a sanity check first. In addition to the obvious
   //restrictions that index_int must be positive and
   //must be within bounds of the text_string, it is also
   //true that index_int must not be the first or last 
   //character of the text_string since there is no point in
   //splitting in such a case.
   if ( (index_int < 1) || (index_int >= (text_string.length-1)) ){
      return false;
      }


   //Check for sentence ending punctuation  . ? ! and run
   //some simple heuristics.
   if ( (text_string[index_int] == ".") ||
        (text_string[index_int] == "?") ||
        (text_string[index_int] == "!")    ){
      //Check for big whitespaces (linebreaks, carriage returns, tabs) 
      //that are segmentation points. Big whitespaces have priority if they are there.
      if ( (text_string[index_int+1] == "\n") ||
           (text_string[index_int+1] == "\r") ||
           (text_string[index_int+1] == "\t")   ){
         return true;
         }
      //If the next character is not a space, then it's 
      //obviously not the end of a sentence.
      if (text_string[index_int+1] != " "){
         return false;
         }
      //If the preceding character is a space, then it's 
      //probably used in some discussion on punctuation
      //and not actually used as the end of a sentence.
      if (text_string[index_int-1] == " "){
         return false;
         }
      //Check for a double space or a space followed by a big whitespace.
      //These should always be considered segmentation points.
      if ((index_int+2) < text_string.length){
         if (text_string[index_int+1] == " ") {
            if ( (text_string[index_int+2] == " ")  ||
                 (text_string[index_int+2] == "\n") ||
                 (text_string[index_int+2] == "\r") ||
                 (text_string[index_int+2] == "\t")   ){
               return true;
               }
            }
         }

      //If it hasn't returned by this point and it was indeed
      //a ? or a !, then it should be safe to assume that it 
      //was the end of the sentence. Handle the . case later 
      //on as that is trickier.
      if ( (text_string[index_int] == "?") || (text_string[index_int] == "!") ){
         return true;
         }
      }



   //Handle " marks.
   if (text_string[index_int] == '"'){
      //Check for a big whitespace after the quote. 
      //If there is one, it must be a segmentation point.
      if ( (text_string[index_int+1] == "\n") || (text_string[index_int+1] == "\r") || (text_string[index_int+1] == "\t") ){
         return true;
         }
      //Anything except a whitespace immediately after " indicates 
      //that a quote is starting.
      if (text_string[index_int+1] != " "){
         return false;
         }
      //A . inside the quote means that the sentence 
      //must have ended on a quote.
      if (text_string[index_int-1] == "."){
         return true;
         }
      //Only ? and ! could have ended a sentence besides .
      //so if it is not one of those, then it is not a sentence ender.
      if ((text_string[index_int-1] != "?") && (text_string[index_int-1] != "!")){
         return false;
         }
      //? and ! can be quoted and still not end a sentence so
      //try to do one more test by checking for whether or not the 
      //next word is capitalized. 
      //As a simplification, ignore the case of 
      //  "What was that?" Charles asked.
      //and consider segmenting that as acceptable.      
      if ((index_int+2) < text_string.length){
         return CLC_IsPossibleSentenceStarter(text_string[index_int+2]);
         }
      //Anything else should be treated as meaning the 
      //quote is in the middle of a sentence and not the end.
      return false;
      }

   //Handle the . case.
   if (text_string[index_int] == "."){
      //If it's lowercase, it's definitely not a sentence starter.
      if ( ((index_int+2) < text_string.length) && CLC_IsLower(text_string[index_int+2]) ){
         return false;
         }

      //Get the word right before the period
      var wordStart = text_string.indexOf(' ');
      //No space before the current position indicates that
      //this . is with the very first word of the text_string.
      //Therefore, do not treat it as a segmentation point.
      if ((wordStart == -1) || (wordStart > index_int)){
         return false;
         } 
      var word = text_string.substring(0, index_int+1);
      word = word.substring(wordStart+1);

      //Whittle it down to make sure that only one word is being retrieved.
      wordStart = word.indexOf(' ');
      while (wordStart != -1){
         word = word.substring(wordStart+1);
         wordStart = word.indexOf(' ');
         }

      //Be conservative and do not attempt to end the sentence 
      //if the . belongs to an abbreviation. It is better to get  
      //two sentences together than to split it between a title 
      //and a name.
      if ( CLC_IsPossiblePeriodForAbbr(word) ){
         return false;
         }

      //If it has passed up to this point, see if the next word is a possible sentence starter.
      //If it is, then assume that the . ends a sentence.
      if ((index_int+2) < text_string.length){
         return CLC_IsPossibleSentenceStarter(text_string[index_int+2]);
         }
      }

   return false;
   }


//------------------------------------------
//
function CLC_IsPossibleSentenceStarter(target_char){
   if (CLC_IsUpper(target_char)){
      return true;
      }
   if (CLC_StringIsAllNumber(target_char)){
      return true;
      }
   if ( (target_char == '"') ||
        (target_char == '(') ||
        (target_char == '#') ||
        (target_char == '[') ||
        (target_char == '{') ||
        (target_char == '<') ||
        (target_char == '$') ||
        (target_char == '*') ||
        (target_char == '-') ||
        (target_char == '+') ||
        (target_char == "'")    ){
      return true;
      }
   return false;
   }


//------------------------------------------
//
function CLC_IsPossiblePeriodForAbbr(target_string){
   var targ = target_string.toLowerCase();
   var abbrList = new Array("apr.", "aug.", "capt.", "col.", "comdr.", "cpl.", "dec.", "dept.", "dr.", "drs.", "feb.", "fr.", "gen.", "gov.", "hon.", "jan.", "jul.", "jun.", "lib.", "lt.", "mar.", "mr.", "mrs.", "mt.", "no.", "nov.", "oct.", "op.", "prof.", "rev.", "sen.", "sep.", "sept.", "sgt.", "st.", "univ.", "u.s.", "vol.", "vs.");
   for (var i=0; i < abbrList.length; i++){
      if (targ == abbrList[i]){
         return true;
         }
      }
   return false;
   }


//------------------------------------------