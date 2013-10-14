//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Element Identification System - Sub Functions
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
//generating the basic info that is appropriate
//to present when reading through the page.



//------------------------------------------
//Only exists for naming convention consistency
//so that names are CLC_<HTMLELEMENT>_Info1
//
function CLC_A_Info1(target){
   return CLC_Link_Info1(target);
   }
//------------------------------------------
function CLC_Link_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      if ( !target.hasAttribute("href") ){
         return "";
         }
      if ( target.href.toLowerCase().match("mailto:") ){
         return "E-mail Link";
         } 
      else if ( !target.href.toLowerCase().match(target.baseURI.toLowerCase()) && target.href.toLowerCase().match("http:")){
         return "External Link";
         } 
      else if ( target.href.toLowerCase().match("#") ){
         return "Internal Link";
         } 
      else {
         return "Link";
         } 
      }
  //French
   if (CLC_InfoLang == 2){
      if ( !target.hasAttribute("href") ){
         return "";
         }
      if ( target.href.toLowerCase().match("mailto:") ){
         return "Adresse email";
         } 
      else if ( !target.href.toLowerCase().match(target.baseURI.toLowerCase()) && target.href.toLowerCase().match("http:")){
         return "Lien externe";
         } 
      else if ( target.href.toLowerCase().match("#") ){
         return "Lien interne";
         } 
      else {
         return "Lien";
         } 
      }  
  //Brief - English
   if (CLC_InfoLang == 3){
      if ( !target.hasAttribute("href") ){
         return "";
         }
      return "Link";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Abbr_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "";
      }
  //French
   if (CLC_InfoLang == 2){
      return "";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_Acronym_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "";
      }
  //French
   if (CLC_InfoLang == 2){
      return "";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Blockquote_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "Block quote";
      }
  //French
   if (CLC_InfoLang == 2){
      return "bloc de citation";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_Body_Info1(target){
   var numheadings = target.getElementsByTagName("H1").length + 
                     target.getElementsByTagName("H2").length +
                     target.getElementsByTagName("H3").length +
                     target.getElementsByTagName("H4").length + 
                     target.getElementsByTagName("H5").length +
                     target.getElementsByTagName("H6").length;
   var numlinks = 0;
   var aelements = target.getElementsByTagName("a");
   for (var i=0; i < aelements.length; i++){
      if (aelements[i].hasAttribute("href") ){
         numlinks++;
         }
      } 

  //English
   if (CLC_InfoLang == 1){
      return "Body with " + numheadings + " headings and " + numlinks + " links.";
      }
  //French
   if (CLC_InfoLang == 2){
      return "page avec " + numheadings + " titres et " + numlinks + " liens.";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }

  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_Button_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "Button";
      }
  //French
   if (CLC_InfoLang == 2){
      return "bouton";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "Button";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }
//------------------------------------------

function CLC_Caption_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "Caption";
      }
  //French
   if (CLC_InfoLang == 2){
      return "Titre du tableau";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Div_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "";
      }
  //French
   if (CLC_InfoLang == 2){
      return "";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }


//------------------------------------------

function CLC_Fieldset_Info1(target){
   var legend = CLC_Fieldset_FindLegend(target);
   var legendText = "";
   if (legend){
      legendText = legend.textContent;
      }
  //English
   if (CLC_InfoLang == 1){
      var msg = "Fieldset ";
      if (legendText){
         msg = msg + "Legend: " + legendText;
         }
      else {
         msg = msg + "has no legend.";
         }
      return msg;
      }
  //French
   if (CLC_InfoLang == 2){
      var msg = "";
      if (legendText){
         msg = "Titre du groupe de champs: " + legendText;
         }
      else {
         msg = "Le groupe de champs n'a pas de titre.";
         }
      return msg;
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }

  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }


//------------------------------------------

function CLC_Frame_Info1(target){
   var title = target.title + ' ' + target.name + " " + target.contentDocument.title;
   if (!CLC_IsSpeakableString(title)){
      title = "";
      }
  //English
   if (CLC_InfoLang == 1){
      var msg = "";
      if (title){
         msg = title;
         }
      else {
         msg = "Untitled frame. Frame source: " + target.src;
         }
      return msg;
      }
  //French
   if (CLC_InfoLang == 2){
      var msg = "";
      if (title){
         msg = title;
         }
      else {
         msg = "cadre sans nom. adresse du cadre: " + target.src;
         }
      return msg;
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      var msg = "";
      if (title){
         msg = title;
         }
      else {
         msg = "";
         }
      return msg;
      }

  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }



//------------------------------------------

function CLC_H1_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "Heading Level 1";
      }
  //French
   if (CLC_InfoLang == 2){
      return "titre de niveau 1";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "Heading";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_H2_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "Heading Level 2";
      }
  //French
   if (CLC_InfoLang == 2){
      return "titre de niveau 2";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "Heading";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_H3_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "Heading Level 3";
      }
  //French
   if (CLC_InfoLang == 2){
      return "titre de niveau 3";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "Heading";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_H4_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "Heading Level 4";
      }
  //French
   if (CLC_InfoLang == 2){
      return "titre de niveau 4";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "Heading";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_H5_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "Heading Level 5";
      }
  //French
   if (CLC_InfoLang == 2){
      return "titre de niveau 5";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "Heading";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_H6_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "Heading Level 6";
      }
  //French
   if (CLC_InfoLang == 2){
      return "titre de niveau 6";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "Heading";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
function CLC_Html_Info1(target){
   var title = "";
   var head = target.getElementsByTagName("head");
   if (head[0]){
      temp = head[0].getElementsByTagName("title");
      if (temp[0] && temp[0].textContent){
         title =  temp[0].textContent;
         }
      }
   var frames = window._content.document.documentElement.getElementsByTagName("frame");
   
  //English
   if (CLC_InfoLang == 1){
      var msg = "";
      if (title){
         msg = "H T M L title. " + title;
         }
      else {
         msg = "Untitled page.";
         }

      if (frames.length != 0){
         msg = msg + " This page uses frames.";
         }
      return msg;
      }
  //French
   if (CLC_InfoLang == 2){
      var msg = "";
      if (title){
         msg = "titre de la page H T M L." + title;
         }
      else {
         msg = "page H T M L sans titre.";
         }

      if (frames.length != 0){
         msg = msg + " This page uses frames.";
         }
      return msg;
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      var msg = "";
      if (title){
         msg = title;
         }
      else {
         msg = "Untitled page.";
         }
      if (frames.length != 0){
         msg = msg + " This page uses frames.";
         }
      return msg;
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Iframe_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "I Frame ";
      }
  //French
   if (CLC_InfoLang == 2){
      return "I Frame ";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "I Frame ";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Img_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      if ( target.hasAttribute("alt") && target.alt == "" ){
         return "";
         }
      else {
         return "Graphic ";
         }
      }
  //French
   if (CLC_InfoLang == 2){
      if ( target.hasAttribute("alt") && target.alt == "" ){
         return "";
         }
      else {
         return "image ";
         }
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
function CLC_Input_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      if (target.type.toLowerCase() == "radio"){
         return "Radio button";
         }
      if (target.type.toLowerCase() == "text"){
         return "Text field";
         }
      if (target.type.toLowerCase() == "password"){
         return "Password field";
         }
      if (target.type.toLowerCase() == "button"){
         return "Button";
         }
      if (target.type.toLowerCase() == "submit"){
         return "Submit button";
         }
      if (target.type.toLowerCase() == "reset"){
         return "Reset button";
         }
      if (target.type.toLowerCase() == "checkbox"){
         return "Checkbox";
         }
      return "";
      }
  //French
   if (CLC_InfoLang == 2){
      if (target.type.toLowerCase() == "radio"){
         return "bouton radio";
         }
      if (target.type.toLowerCase() == "text"){
         return "champ de saisie";
         }
      if (target.type.toLowerCase() == "password"){
         return "champ de mot de passe";
         }
      if (target.type.toLowerCase() == "button"){
         return "bouton";
         }
      if (target.type.toLowerCase() == "submit"){
         return "bouton de validation";
         }
      if (target.type.toLowerCase() == "reset"){
         return "bouton d'annulation";
         }
      if (target.type.toLowerCase() == "checkbox"){
         return "case à cocher";
         }
      return "";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      if (target.type.toLowerCase() == "radio"){
         return "Radio button";
         }
      if (target.type.toLowerCase() == "text"){
         return "Text field";
         }
      if (target.type.toLowerCase() == "password"){
         return "Password field";
         }
      if (target.type.toLowerCase() == "button"){
         return "Button";
         }
      if (target.type.toLowerCase() == "submit"){
         return "Submit button";
         }
      if (target.type.toLowerCase() == "reset"){
         return "Reset button";
         }
      if (target.type.toLowerCase() == "checkbox"){
         return "Checkbox";
         }
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }



//------------------------------------------
//Labels should NOT be identified on the first read through!
//Their text will automatically be read by the input blank
//when content is retrieved! Do NOT attempt to announce
//labels until the user queries for it!
//
function CLC_Label_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return ""
      }
  //French
   if (CLC_InfoLang == 2){
      return ""
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }


//------------------------------------------
//Legends should NOT be identified on the first read through!
//Their text will automatically be read by the fieldset announcement!
//Do NOT attempt to announce legends!
//
function CLC_Legend_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return ""
      }
  //French
   if (CLC_InfoLang == 2){
      return ""
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }


//------------------------------------------

function CLC_Li_Info1(target){
  var Li_num = CLC_Li_FindNum(target);
  //English
   if (CLC_InfoLang == 1){      
      if (Li_num > 0){
         return Li_num;
         }
      else{
         return "Bullet";
         }
      }
  //French
   if (CLC_InfoLang == 2){
      if (Li_num > 0){
         return Li_num;
         }
      else{
         return "élément de liste";
         }
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Ol_Info1(target){
   var true_item_count = CLC_FindLiTrueCount(target);
  //English
   if (CLC_InfoLang == 1){
       return "Ordered list " + target.title + "with " + true_item_count + " items";
      }
  //French
   if (CLC_InfoLang == 2){
       return "liste ordonnée " + target.title + "avec " + true_item_count + " éléments";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Select_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "Select box";
      }
  //French
   if (CLC_InfoLang == 2){
      return "liste déroulante";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "Select box";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Span_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      return "";
      }
  //French
   if (CLC_InfoLang == 2){
      return "";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
       return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Table_Info1(target){
   var rows = target.rows.length;
   var cols = target.rows[0].cells.length;
  //English
   if (CLC_InfoLang == 1){
      var summary = "";
      if (target.summary){
         summary = "Summary: " + target.summary;
         } 
      else if ( CLC_ProbablyDataTable(target) ){
         summary = "No summary available";
         } 
      return summary + " Table with " + cols + " columns and " + rows + " rows.";
      }
  //French
   if (CLC_InfoLang == 2){
      var summary = "";
      if (target.summary){
         summary = "résumé du tableau: " + target.summary;
         } 
      else if ( CLC_ProbablyDataTable(target) ){
         summary = "Aucun résumé disponible.";
         } 
      return summary + " Ce tableau contient " + cols + " colonnes et " + rows + " lignes.";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
       return "Table";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }


//------------------------------------------

function CLC_Td_Info1(target){
   var HasColHeading = true;
   var col_heading_text = CLC_GetColHeading(target);      
   if (!col_heading_text){
      HasColHeading = false;
      col_heading_text = CLC_GuessColHeading(target);
      }
   if (!col_heading_text){
      return "";
      }
  //English
   if (CLC_InfoLang == 1){
      if (!HasColHeading){
         col_heading_text = "Guessed Heading " + col_heading_text;
         }
      return col_heading_text  + ". ";
      }
  //French
   if (CLC_InfoLang == 2){
      if (!HasColHeading){
         col_heading_text = "en-tête déduite automatiquement: " + col_heading_text;
         }
      return col_heading_text  + ". ";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      if (!HasColHeading){
         return "";
         }
      return col_heading_text  + ". ";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Textarea_Info1(target){
  //English
   if (CLC_InfoLang == 1){
       return "Text area";
      }
  //French
   if (CLC_InfoLang == 2){
       return "zone de texte";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
       return "Text area";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------
function CLC_Th_Info1(target){
  //English
   if (CLC_InfoLang == 1){
      var type = "";
      var additional_col_info = CLC_GetColHeading(target); 

      if (target.scope.toLowerCase() == "col"){
         type = " Column ";
         }
      else if (target.scope.toLowerCase() == "row"){
         type = " Row ";
         if (CLC_FindRowNumber(target) > 1){
            var col_heading_text = CLC_GetColHeading(target);      
            if (!col_heading_text){ 
               col_heading_text = CLC_GuessColHeading(target);
               additional_col_info = "Guessed Heading " + col_heading_text + ". ";
               }
            else {
               additional_col_info = col_heading_text + ". ";
               }
            if (!col_heading_text){
               additional_col_info =  "";
               }
            }
         }
      return additional_col_info + type + " header";
      }
  //French
   if (CLC_InfoLang == 2){
      var type = "";
      var additional_col_info = "";                   //Use this if it is a row header inside a table
                                                      //and the header is under some column
      if (target.scope.toLowerCase() == "col"){
         type = "en-tête de colonne ";
         }
      else if (target.scope.toLowerCase() == "row"){
         type = "ligne d'en-tête ";
         if (CLC_FindRowNumber(target) > 1){
            var col_heading_text = CLC_GetColHeading(target);      
            if (!col_heading_text){ 
               col_heading_text = CLC_GuessColHeading(target);
               additional_col_info = "en-tête déduite automatiquement: " + col_heading_text + ". ";
               }
            else {
               additional_col_info = col_heading_text + ". ";
               }
            if (!col_heading_text){
               additional_col_info =  "";
               }
            }
         }
      return additional_col_info + type;
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      var type = "";
      var additional_col_info = CLC_GetColHeading(target); 

      if (target.scope.toLowerCase() == "col"){
         type = " Column ";
         }
      else if (target.scope.toLowerCase() == "row"){
         type = " Row ";
         if (CLC_FindRowNumber(target) > 1){
            var col_heading_text = CLC_GetColHeading(target);      
            if (!col_heading_text){ 
               return "";
               }
            else {
               additional_col_info = col_heading_text + ". ";
               }
            if (!col_heading_text){
               additional_col_info =  "";
               }
            }
         }
      return additional_col_info + type + " header";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------

function CLC_Ul_Info1(target){
   var true_item_count = CLC_FindLiTrueCount(target);
  //English
   if (CLC_InfoLang == 1){
      return "Unnumbered list " + target.title + "with " + true_item_count + " items";
      }
  //French
   if (CLC_InfoLang == 2){
      return "Liste non ordonnée " + target.title + "avec " + true_item_count + " éléments";
      }
  //Brief - English
   if (CLC_InfoLang == 3){
      return "";
      }
  //Insert other languages here

  //Info messages are off
   else {
      return "";
      }
   }

//------------------------------------------












