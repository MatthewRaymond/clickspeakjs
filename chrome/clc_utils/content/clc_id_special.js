//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Element Identification System - Special Cases
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
 

//Last Modified Date 1/13/2005

//These functions are for handling especially difficult/complex 
//information gathering tasks that are needed for some elements.


//------------------------------------------
//Returns the list that the target LI element is in.
//If the LI element is not in any list, it returns 0.
//
function CLC_Li_IsInList(target){
   var temp = target;
   while (temp.parentNode){
      if ( temp.parentNode.tagName &&
           ((temp.parentNode.tagName.toLowerCase() == "ol") || (temp.parentNode.tagName.toLowerCase() == "ul"))
         ) {
         return temp.parentNode;
         }
      temp = temp.parentNode;
      }
   return 0;
   }


//------------------------------------------
//Returns the number of the target LI element in the list
//This number is positive if it is in an ordered list; 
//negative if in an unnumbered list.
//Returns 0 if the LI element is not in any list.
//
function CLC_Li_FindNum(target){
  //Determine the type of list
   var in_list = CLC_Li_IsInList(target);
   var list_type;
   if (!in_list){
      return 0;
      }
   if (in_list.tagName.toLowerCase() == "ol"){
      list_type = 1;
      }
   else {
      list_type = -1;
      }

  //Copy all LI items in the list that are not in some sublist
   var temp_list = new Array();
   for (var i=0; i < in_list.getElementsByTagName("li").length; i++){
      if ( CLC_Li_IsInList(in_list.getElementsByTagName("li")[i]) == in_list){
         temp_list.push(in_list.getElementsByTagName("li")[i]);
         }
      }
   var count = 0;
   while (temp_list[count] != target){
      count++;
      }
   count++;
   count = count * list_type; 
   return count;
   }

//------------------------------------------
//Returns the number of items directly in the target list.
//Items in sublists of the target list will not be counted.
//
function CLC_FindLiTrueCount(target){
   var nested_ol = target.getElementsByTagName("ol");
   var nested_ul = target.getElementsByTagName("ul");
   var in_nested_lists = 0;
   for (var i = 0; i < nested_ol.length; i++){
      in_nested_lists = in_nested_lists + nested_ol[i].getElementsByTagName("li").length;
      }
   for (var i = 0; i < nested_ul.length; i++){
      in_nested_lists = in_nested_lists + nested_ul[i].getElementsByTagName("li").length;
      }
   return (target.getElementsByTagName("li").length - in_nested_lists);
   }

//------------------------------------------
//Returns true if the target table is most likely a data table;
//false if the target table is most likely a layout table.
//This function is not guaranteed to be correct at guessing
//the intent of a table; however, it uses some good heuristics
//to make a pretty good guess most of the time.
//
function CLC_ProbablyDataTable(target){
  //Assume it is a data table if there is a summary attribute
   if (target.summary){
      return true;
      }
  //Assume it is a data table if there are TH elements
   else if (target.getElementsByTagName("th").length){
      return true;
      }
  //Assume it is a data table if there are TD elements that have a headers attribute in them
   else {
      for (var i = 0; i < target.getElementsByTagName("td").length; i++){
          if (target.getElementsByTagName("td")[i].headers != ""){
             return true;
             }
          }
      }
  //If the parent table has a thead, assume it is data
  var tempnode = CLC_GetClosestAncestorThatIs(target, "table");
  if (!tempnode){  //There must be a table, if there isn't, definitely not a data table
     return false;
     }
  if(tempnode.getElementsByTagName("thead").length > 0){
     return true;
     }
  //If it has not returned by now, it is probably a layout table
   return false;
   }

//------------------------------------------
//Returns the string that is marked as the col heading for the cell.
//If there is nothing marked explicitly as the col heading,
//the return value will be null.
//If this returns null, use CLC_GuessColHeading to 
//return a guessed value that might be the col heading.
//
function CLC_GetColHeading(target){
  var tempnode = CLC_GetClosestAncestorThatIs(target, "td");
  //Use the headers attribute if available
  if (!tempnode){  
     tempnode = CLC_GetClosestAncestorThatIs(target, "th");
     }
  if (!tempnode){  //There must be a td or a th cell, if there isn't, something is seriously wrong
     return "";
     }
  if (tempnode.headers){
     var headersIDArray = tempnode.headers.split(' ');
     var theRow = CLC_GetClosestAncestorThatIs(tempnode, "tr");
     var headingText = "";
     for (var i=0; i<headersIDArray.length; i++){
        var theHeader = CLC_Window().document.getElementById(headersIDArray[i]);
        if (theHeader && !CLC_AcontainsB(theRow, theHeader) && (theHeader.scope != 'row')){
           headingText = headingText + CLC_GetTextContent(theHeader);
           }
        }
     if (headingText){
        return headingText;
        }
     }

  var row_index = target.cellIndex;
  //Try to get the information from the thead if one exists
  tempnode = CLC_GetClosestAncestorThatIs(target, "table");
  if (!tempnode){  //There must be a table, if there isn't, something is seriously wrong
     return "";
     }
  var theThead = tempnode.getElementsByTagName("thead")[0];
  if (theThead){
     if (theThead.getElementsByTagName("th").length > row_index){
        if (theThead.getElementsByTagName("th")[row_index].scope == 'row'){
          return "";
          }
        return CLC_GetTextContent(theThead.getElementsByTagName("th")[row_index]);
        }
     if (theThead.getElementsByTagName("td").length > row_index){
        return CLC_GetTextContent(theThead.getElementsByTagName("td")[row_index]);
        }
     }
  //No thead, try to use th within the tbody
  tempnode = target;
  while (tempnode && tempnode.localName.toLowerCase() != "tbody"){
     tempnode = tempnode.parentNode;
     }
  if (!tempnode){
     return "";
     }
  var rows = tempnode.getElementsByTagName("tr"); 
  if (!rows[0]){
     return "";
     }
   if (!rows[0].cells[row_index]){
     return "";
     }   
   if (!(rows[0].cells[row_index].localName.toLowerCase() == "th")){
      return "";
      }
   if (CLC_AcontainsB(rows[0].cells[row_index], target)){
     return "";
     }
   if (rows[0].cells[row_index].scope == 'row'){
     return "";
     }
   return CLC_GetTextContent(rows[0].cells[row_index]);
   }

//------------------------------------------
//Returns the string that is guessed to be the col heading for the cell.
//If there is no guess that makes sense, the return value will be null.
//Note: If the table is guessed to be a layout table, then there will
//be no sensible guess and null will be returned.
//
function CLC_GuessColHeading(target){
  //If this has a real ROW heading, then not having a 
  //col heading means that this was not intended to have a col heading.
  //Don't bother guessing.
  if (CLC_GetRowHeading(target)){
     return "";
     }
  var row_index = target.cellIndex;
  var tempnode = target;
  while (tempnode && tempnode.localName.toLowerCase() != "tbody"){
     tempnode = tempnode.parentNode;
     }
  if (!tempnode){
     return "";
     }
  if (!CLC_ProbablyDataTable(tempnode)){
     return "";
     }
  var rows = tempnode.getElementsByTagName("tr"); 
  if (!rows[0]){
     return "";
     }
   if (!rows[0].cells[row_index]){
     return "";
     }   
   if (rows[0].cells[row_index].scope == 'row'){
     return "";
     }   
   return rows[0].cells[row_index].textContent;
   }


//------------------------------------------
//Returns the string that is marked as the row heading for the cell.
//If there is nothing marked explicitly as the row heading,
//the return value will be null.
//If this returns null, use CLC_GuessRowHeading to 
//return a guessed value that might be the row heading.
//
function CLC_GetRowHeading(target){
  var tempnode = CLC_GetClosestAncestorThatIs(target, "td");
  //Use the headers attribute if available
  if (!tempnode){  
     tempnode = CLC_GetClosestAncestorThatIs(target, "th");
     }
  if (!tempnode){  //There must be a td or a th cell, if there isn't, something is seriously wrong
     return "";
     }
  if (tempnode.headers){
     var headersIDArray = tempnode.headers.split(' ');
     var theRow = CLC_GetClosestAncestorThatIs(tempnode, "tr");
     var headingText = "";
     for (var i=0; i<headersIDArray.length; i++){
        var theHeader = CLC_Window().document.getElementById(headersIDArray[i]);
        if (theHeader && CLC_AcontainsB(theRow, theHeader) && (theHeader.scope != 'col')){
           headingText = headingText + CLC_GetTextContent(theHeader);
           }
        }
     if (headingText){
        return headingText;
        }
     }

  var tempnode = target;
  while (tempnode && tempnode.localName.toLowerCase() != "tr"){
     tempnode = tempnode.parentNode;
     }
  if (!tempnode){
     return "";
     }
  var rowheader = tempnode.getElementsByTagName("th"); 
  if (!rowheader[0]){
     return "";
     }
   if (CLC_AcontainsB(rowheader[0], target)){
     return "";
     }
   if (rowheader[0].scope == 'col'){
     return "";
     }
   return rowheader[0].textContent;
   }

//------------------------------------------
//Returns the string that is guessed to be the row heading for the cell.
//If there is no guess that makes sense, the return value will be null.
//Note: If the table is guessed to be a layout table, then there will
//be no sensible guess and null will be returned.
//
function CLC_GuessRowHeading(target){
  //If this has a real COL heading, then not having a 
  //row heading means that this was not intended to have a row heading.
  //Don't bother guessing.
  if (CLC_GetColHeading(target)){
     return "";
     }
  //Check if this is a data table first
  var tempnode = target;
  while (tempnode && tempnode.localName.toLowerCase() != "tbody"){
     tempnode = tempnode.parentNode;
     }
  if (!CLC_ProbablyDataTable(tempnode)){
     return "";
     }
  //Guess the row heading by assuming that it is the first cell in the row
  tempnode = target;
  while (tempnode && tempnode.localName.toLowerCase() != "tr"){
     tempnode = tempnode.parentNode;
     }
  if (!tempnode){
     return "";
     }
  var cells = tempnode.getElementsByTagName("td"); 
  if (cells.length < 1){
     return "";
     }
  if (cells[0].scope == 'col'){
     return "";
     }   
   return cells[0].textContent;
   }

//------------------------------------------
//Returns the row number of the cell.
//Note that row counting will start at 1 
//(ie, the normal human way) for easier use.
//
function CLC_FindRowNumber(target){
  row = target;
  while (row && row.localName.toLowerCase() != "tr"){
     row = row.parentNode;
     }
  if (!row){
     return "";
     }
  table = row;
  while (table && table.localName.toLowerCase() != "tbody"){
     table = table.parentNode;
     }
  if (!table){
     return "";
     }
  var allrows = table.getElementsByTagName("tr"); 
  var count = 0;
  while (allrows[count] && (allrows[count] != row) ){
     count++;
     }
   count++;
   return count;
   }


//------------------------------------------
//Returns the column number of the cell.
//Note that column counting will start at 1 
//(ie, the normal human way) for easier use.
//
function CLC_FindColNumber(target){
   return target.cellIndex + 1;
   }


//------------------------------------------
//Returns the Fieldset that the target Legend element is in.
//If the Legend element is not in any fieldset, it returns 0.
//
function CLC_Legend_IsInFieldset(target){
   var temp = target;
   while (temp.parentNode){
      if ( temp.parentNode.tagName &&
           (temp.parentNode.tagName.toLowerCase() == "fieldset")
         ) {
         return temp.parentNode;
         }
      temp = temp.parentNode;
      }
   return 0;
   }

//------------------------------------------
//Finds the Legend DOM obj of the target Fieldset
//Returns 0 if there is no legend for it.
//
function CLC_Fieldset_FindLegend(target){
   var legendArray = target.getElementsByTagName("legend");
   for (var i = 0; i < legendArray.length; i++){
      if (CLC_Legend_IsInFieldset(legendArray[i]) == target){
         return legendArray[i];
         }
       }
   return 0;
   }

//------------------------------------------
