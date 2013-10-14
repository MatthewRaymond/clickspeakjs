//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Element Identification System - Sub Functions 2
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
 

//Last Modified Date 1/22/2005

//All of these subfunctions are for
//generating the detailed info that is too verbose
//to present when reading through the page, but which
//should be presented to users when explicitly requested.

//------------------------------------------
//Only exists for naming convention consistency
//so that names are CLC_<Html_element>_Info2
//
function CLC_A_Info2(target){
   return CLC_Link_Info2(target);
   }

//------------------------------------------

function CLC_Link_Info2(target){
   if ( !target.hasAttribute("href") ){
      return "";
      }
   var dest = target.href.toLowerCase();

  //English
   if ((CLC_InfoLang == 1) || (CLC_InfoLang == 3)){
      var answer = "";
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      //Get the link destination info
      if ( target.href.toLowerCase().match("mailto:") ){       
         dest.replace("mailto:", " ");
         answer = answer + "This is an E-mail link that points to " + dest;
         } 
      else if ( !target.href.toLowerCase().match(target.baseURI.toLowerCase()) && target.href.toLowerCase().match("http:")){
         answer = answer + "The destination of this external link is " + dest;
         } 
      else if ( target.href.toLowerCase().match("#") ){ 
         answer = answer + "This is an internal link to section " + CLC_GetTextAfterMarker(dest, '#');
         } 
      else {
         answer = answer + "This link points to " + dest;
         } 
      return answer;
      }

  //French
   if (CLC_InfoLang == 2){
      var answer = "";
      //Get the title
      if ( target.title ){
         answer = answer + "Informations complémentaires: " + target.title + "   ";
         }
      //Get the link destination info
      if ( target.href.toLowerCase().match("mailto:") ){       
         dest.replace("mailto:", " ");
         answer = answer + "Il s'agit d'un lien vers une adresse email qui pointe vers: " + dest;
         } 
      else if ( !target.href.toLowerCase().match(target.baseURI.toLowerCase()) && target.href.toLowerCase().match("http:")){
         answer = answer + "La cible de ce lien externe est: " + dest;
         } 
      else if ( target.href.toLowerCase().match("#") ){ 
         answer = answer + "Il s'agit d'un lien de navigation interne à la page vers: " + CLC_GetTextAfterMarker(dest, '#');
         } 
      else {
         answer = answer + "La cible de ce lien est: " + dest;
         } 
      return answer;
      }
  
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_Abbr_Info2(target){
   var standsFor = "";
   if (target.hasAttribute("title")){
      standsFor = target.title;
      }
  //English
   if ((CLC_InfoLang == 1) || (CLC_InfoLang == 3)){ 
      if (standsFor){
         standsFor = " which stands for " + standsFor;
         }     
      return "Is an abbreviation" + standsFor + ". ";
      }
  //French
   if (CLC_InfoLang == 2){ 
      if (standsFor){
         standsFor = " pour " + standsFor;
         }     
      return "Il s'agit d'une abréviation" + standsFor + ". ";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_Acronym_Info2(target){
   var standsFor = "";
   if (target.hasAttribute("title")){
      standsFor = target.title;
      }
  //English
   if ((CLC_InfoLang == 1) || (CLC_InfoLang == 3)){ 
      if (standsFor){
         standsFor = " which stands for " + standsFor;
         }     
      return "Is an acronym" + standsFor + ". ";
      }
  //French
   if (CLC_InfoLang == 2){ 
      if (standsFor){
         standsFor = " pour " + standsFor;
         }     
      return "Il s'agit d'un acronyme" + standsFor + ". ";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_Blockquote_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      return CLC_Blockquote_Info1(target);
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Blockquote_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var info = CLC_Blockquote_Info1(target);
      CLC_InfoLang = 3;
      return info;
      }   
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Body_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      return CLC_Body_Info1(target);
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Body_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var info = CLC_Body_Info1(target);
      CLC_InfoLang = 3;
      return info;
      }   
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_Button_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_Button_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Button_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_Button_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_Caption_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_Caption_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Caption_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_Caption_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Div_Info2(target){
  //English
   if ((CLC_InfoLang == 1) || (CLC_InfoLang == 3)){
      var answer = "";
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_Fieldset_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_Fieldset_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Fieldset_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_Fieldset_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Frame_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      return CLC_Frame_Info1(target);
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Frame_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var info = CLC_Frame_Info1(target);
      CLC_InfoLang = 3;
      return info;
      }   
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_H1_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_H1_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_H1_Info1(target);
      }
  //Brief English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_H1_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_H2_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_H2_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_H2_Info1(target);
      }
  //Brief English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_H1_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_H3_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_H3_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_H3_Info1(target);
      }
  //Brief English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_H1_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_H4_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_H4_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_H4_Info1(target);
      }
  //Brief English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_H1_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_H5_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_H5_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_H5_Info1(target);
      }
  //Brief English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_H1_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_H6_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_H6_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_H6_Info1(target);
      }
  //Brief English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_H1_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
function CLC_Html_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      return CLC_Html_Info1(target);
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Html_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var info = CLC_Html_Info1(target);
      CLC_InfoLang = 3;
      return info;
      }   
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
function CLC_Iframe_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      return CLC_Iframe_Info1(target);
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Iframe_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var info = CLC_Iframe_Info1(target);
      CLC_InfoLang = 3;
      return info;
      }   
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }


//------------------------------------------
function CLC_Img_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = "";
      answer = CLC_Img_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      var answer = "";
      answer = CLC_Img_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " titre: " + target.title + "   ";
         }
      return answer;
      }
  //Brief English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = "";
      answer = CLC_Img_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
function CLC_Input_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_Input_Info1(target) + " " + CLC_GetStatus(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Input_Info1(target) + " " + CLC_GetStatus(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_Input_Info1(target) + " " + CLC_GetStatus(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
function CLC_Label_Info2(target){
  //English
   if ((CLC_InfoLang == 1) || (CLC_InfoLang == 3)){
      var answer = "Label " + target.textContent;
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //English
   if (CLC_InfoLang == 2){
      return "étiquette " + target.textContent;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
function CLC_Legend_Info2(target){
  //English
   if ((CLC_InfoLang == 1) || (CLC_InfoLang == 3)){
      return "";
      }
  //French
   if (CLC_InfoLang == 2){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Li_Info2(target){
   var Li_num = CLC_Li_FindNum(target);

  //English
   if ((CLC_InfoLang == 1) || (CLC_InfoLang == 3)){      
      if (Li_num > 0){
         return "This is number " + Li_num + " in an ordered list.";
         }
      else if (Li_num < 0){
         Li_num = Li_num * -1;
         return "This is number " + Li_num + " in an unnumbered list.";
         }
      return "This is a bullet item.";
      }
  //French
   if (CLC_InfoLang == 2){      
      if (Li_num > 0){
         return "élément numéro " + Li_num + " dans une liste ordonnée.";
         }
      else if (Li_num < 0){
         Li_num = Li_num * -1;
         return "élément numéro " + Li_num + " dans une liste non ordonnée.";
         }
      return "Il s'agit d'un élément de liste.";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Ol_Info2(target){
  //English
   if (CLC_InfoLang == 1){
       return CLC_Ol_Info1(target);
      }
  //French
   if (CLC_InfoLang == 2){
       return CLC_Ol_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var info = CLC_Ol_Info1(target);
      CLC_InfoLang = 3;
      return info;
      }   
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Select_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_Select_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
       return CLC_Select_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_Select_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Span_Info2(target){
  //English
   if ((CLC_InfoLang == 1) || (CLC_InfoLang == 3)){
      var answer = "";
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_Table_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var answer = CLC_Table_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      return answer;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Table_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var answer = CLC_Table_Info1(target);
      //Get the title
      if ( target.title ){
         answer = answer + " Title: " + target.title + "   ";
         }
      CLC_InfoLang = 3;
      return answer;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }


//------------------------------------------

function CLC_Td_Info2(target){
   col_num = CLC_FindColNumber(target);
   row_num = CLC_FindRowNumber(target);

  //English
   if ((CLC_InfoLang == 1) || (CLC_InfoLang == 3)){
      var title_text = "";
      //Get the title
      if ( target.title ){
         title_text = "Title: " + target.title + "   ";
         }
      var location_text = " This cell is in column " + col_num + ", row " + row_num + ". ";
      var col_heading_text = CLC_GetColHeading(target);
      if (col_heading_text){
         col_heading_text = " Column heading is " + col_heading_text + ". ";
         }
      var row_heading_text = CLC_GetRowHeading(target);
      if (row_heading_text){
         row_heading_text = " Row heading is " + row_heading_text + ". ";
         }
      if (!col_heading_text && !CLC_GetRowHeading(target) && CLC_GuessColHeading(target)){
         col_heading_text = " Guessed column heading " + CLC_GuessColHeading(target);
         }  
      if (!row_heading_text && !CLC_GetColHeading(target) && CLC_GuessRowHeading(target)){
         row_heading_text = " Guessed row heading " + CLC_GuessRowHeading(target);
         }  
      if (!col_heading_text && !row_heading_text){
         return title_text + "This is a cell that is probably in a layout table. " + location_text;
         }
      return title_text + col_heading_text + row_heading_text + location_text;
      }
  //French
   if (CLC_InfoLang == 1){
      var location_text = "cette cellule est dans la colonne " + col_num + " et dans la ligne " + row_num + ". ";
      var col_heading_text = CLC_Td_Info1(target);
      if (!col_heading_text){
         return "Il s'agit d'une cellule qui est probablement dans un tableau de mise en forme. " + location_text;
         }
      var row_heading_text = CLC_GetRowHeading(target);
      if (!row_heading_text){
         row_heading_text = "en-tête déduite automatiquement: " + CLC_GuessRowHeading(target);
         }      
      return "en-tête de colonne " + CLC_Td_Info1(target) + ". ligne d'en-tête " + row_heading_text + ". " + location_text;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
function CLC_Textarea_Info2(target){
  //English
   if (CLC_InfoLang == 1){
      var title_text = "";
      //Get the title
      if ( target.title ){
         title_text = "Title: " + target.title + "   ";
         }
      return title_text + CLC_Textarea_Info1(target) + " has value " + target.value;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Textarea_Info1(target) + " has value " + target.value;
      }
  //Brief English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var title_text = "";
      //Get the title
      if ( target.title ){
         title_text = "Title: " + target.title + "   ";
         }
      var info = title_text + CLC_Textarea_Info1(target) + " has value " + target.value;
      CLC_InfoLang = 3;
      return info;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
function CLC_Th_Info2(target){
   col_num = CLC_FindColNumber(target);
   row_num = CLC_FindRowNumber(target);

  //English
   if ((CLC_InfoLang == 1) || (CLC_InfoLang == 3)){
      var title_text = "";
      //Get the title
      if ( target.title ){
         title_text = "Title: " + target.title + "   ";
         }
      var location_text = " This header is in column " + col_num + ", row " + row_num + ". ";
      var col_heading_text = CLC_GetColHeading(target);
      if (col_heading_text){
         col_heading_text = " Column heading is " + col_heading_text + ". ";
         }
      var row_heading_text = CLC_GetRowHeading(target);
      if (row_heading_text){
         row_heading_text = " Row heading is " + row_heading_text + ". ";
         }

      if (!col_heading_text && !CLC_GetRowHeading(target) && CLC_GuessColHeading(target)){
         col_heading_text = " Guessed column heading " + CLC_GuessColHeading(target);
         }  
      if (!row_heading_text && !CLC_GetColHeading(target) && CLC_GuessRowHeading(target)){
         row_heading_text = " Guessed row heading " + CLC_GuessRowHeading(target);
         }  
      return title_text + col_heading_text + row_heading_text + location_text;
      }
  //French
   if (CLC_InfoLang == 2){
      return CLC_Th_Info1(target);
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Ul_Info2(target){
  //English
   if (CLC_InfoLang == 1){
       return CLC_Ul_Info1(target);
      }
  //French
   if (CLC_InfoLang == 2){
       return CLC_Ul_Info1(target);
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      CLC_InfoLang = 1;
      var info = CLC_Ul_Info1(target);
      CLC_InfoLang = 3;
      return info;
      }   
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------












