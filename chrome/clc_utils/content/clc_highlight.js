//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Highlighter
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
 

//Last Modified Date 1/6/2005



//------------------------------------------
//Globals needed for highlighting and unhighlighting
//These variables MUST NOT be touched by anyone using this library!
var CLC_highlight_bg_color = "black";
var CLC_highlight_font_color = "yellow";
var CLC_highlight_font_weight = "bold";
var CLC_highlight_font_size = "";

var CLC_unhighlight_bg_color = "";
var CLC_unhighlight_font_color = "";
var CLC_unhighlight_font_weight = "";
var CLC_unhighlight_font_size = "";

var CLC_last_highlighted_obj = 0;


//------------------------------------------
//Sets the highlighting style.
//All parameters must be text strings.
//If you wish to disable changing something entirely, 
//set that parameter to a null string (ie, "").
//
//If this function is not used, highlighting will be done 
//using the default values. The defaults are:
//BG Color is "black"
//Font Color is "yellow"
//Font Weight is "bold"
//Font Size is "" (left unchanged).
//
function CLC_ConfigHighlight(bgcolor, fontcolor, fontweight, fontsize){
   CLC_highlight_bg_color = bgcolor;
   CLC_highlight_font_color = fontcolor;
   CLC_highlight_font_weight = fontweight;
   CLC_highlight_font_size = fontsize;
   }

//------------------------------------------
//The "target" object will be higlighted according
//to the highlighting settings.
//
function CLC_Highlight(target){
   //Make sure target can be highlighted
   if(!target.style){
      alert("Cannot highlight specified target because it cannot have style defined.");
      return;
      }

   //Save info about highlighted object
   CLC_last_highlighted_obj = target;
   CLC_unhighlight_bg_color = target.style.backgroundColor;   
   CLC_unhighlight_font_color = target.style.color;
   CLC_unhighlight_font_weight = target.style.fontWeight;
   CLC_unhighlight_font_size = target.style.fontSize;

   //Highlight
   if(CLC_highlight_bg_color){
      target.style.backgroundColor = CLC_highlight_bg_color;
      }
   if(CLC_highlight_font_color){
      target.style.color = CLC_highlight_font_color;
      }
   if(CLC_highlight_font_weight){
      target.style.fontWeight = CLC_highlight_font_weight;
      }
   if(CLC_highlight_font_size){
      target.style.fontSize = CLC_highlight_font_size;   
      }
   }

//------------------------------------------
//The last highlighted object will be restored
//to its unhighlighted state.
//
function CLC_Unhighlight(){
   if(CLC_last_highlighted_obj){
      CLC_last_highlighted_obj.style.backgroundColor = CLC_unhighlight_bg_color;
      CLC_last_highlighted_obj.style.color = CLC_unhighlight_font_color;
      CLC_last_highlighted_obj.style.fontWeight = CLC_unhighlight_font_weight;
      CLC_last_highlighted_obj.style.fontSize = CLC_unhighlight_font_size;
      }
   CLC_last_highlighted_obj = 0;
   }