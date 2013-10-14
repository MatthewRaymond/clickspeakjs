//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Math ML Content System - Character Lookup
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
 

//Last Modified Date 3/9/2005

//These functions are for finding the appropriate text content that
//is associated with a given MathML object.
//


//Because this is basically just data entry and there are constantly
//new characters being added into the system, the interfaces for all
//functions here except the main CLC_MathML_CharacterToString function
//will NOT be frozen!

//----------------------------------------------------



function CLC_MathML_CharacterToString(targ_char){
   var code = targ_char.charCodeAt(0);
   if ((code >= 33) && (code <= 47)){
      return CLC_MathML_UnicodeToString_Symbols_33_47(code);
      }
   if ((code >= 48) && (code <= 57)){
      return CLC_MathML_UnicodeToString_Numbers(code);
      }
   if ((code >= 65) && (code <= 90)){
      return CLC_MathML_UnicodeToString_AlphabetUpper(code);
      }
   if ((code >= 97) && (code <= 122)){
      return CLC_MathML_UnicodeToString_AlphabetLower(code);
      }
   if ((code >= 913) && (code <= 937)){
      return CLC_MathML_UnicodeToString_GreekUpper(code);
      }
   if ((code >= 945) && (code <= 969)){
      return CLC_MathML_UnicodeToString_GreekLower(code);
      }
   var return_str = CLC_MathML_UnicodeToString_Misc(code);
   if (return_str){
      return return_str;
      }
   return targ_char[0];
   }



//----------------------------------------------------
//

function CLC_MathML_UnicodeToString_Numbers(code){
   if (CLC_MathML_Mode == 0){
      if (code == 48){
            return " zero ";
            }
      if (code == 49){
            return " one ";
            }
      if (code == 50){
            return " two ";
            }
      if (code == 51){
            return " three ";
            }
      if (code == 52){
            return " four ";
            }
      if (code == 53){
            return " five ";
            }
      if (code == 54){
            return " six ";
            }
      if (code == 55){
            return " seven ";
            }
      if (code == 56){
            return " eight ";
            }
      if (code == 57){
            return " nine ";
            }
      return "";
      }
  return "";
  }

//----------------------------------------------------

function CLC_MathML_UnicodeToString_AlphabetUpper(code){
   if (CLC_MathML_Mode == 0){
      return " upper " + CLC_MathML_UnicodeToString_AlphabetLower(code+32);
      }
   return "";
   }


//----------------------------------------------------

function CLC_MathML_UnicodeToString_AlphabetLower(code){
   if (CLC_MathML_Mode == 0){
      if (code == 97){
            return " a. ";
            }
      if (code == 98){
            return " b. ";
            }
      if (code == 99){
            return " c. ";
            }
      if (code == 100){
            return " d. ";
            }
      if (code == 101){
            return " e. ";
            }
      if (code == 102){
            return " f. ";
            }
      if (code == 103){
            return " g. ";
            }
      if (code == 104){
            return " h. ";
            }
      if (code == 105){
            return " i. ";
            }
      if (code == 106){
            return " j. ";
            }
      if (code == 107){
            return " k. ";
            }
      if (code == 108){
            return " l. ";
            }
      if (code == 109){
            return " m. ";
            }
      if (code == 110){
            return " n. ";
            }
      if (code == 111){
            return " o. ";
            }
      if (code == 112){
            return " p. ";
            }
      if (code == 113){
            return " q. ";
            }
      if (code == 114){
            return " r. ";
            }
      if (code == 115){
            return " s. ";
            }
      if (code == 116){
            return " t. ";
            }
      if (code == 117){
            return " u. ";
            }
      if (code == 118){
            return " v. ";
            }
      if (code == 119){
            return " w. ";
            }
      if (code == 120){
            return " x. ";
            }
      if (code == 121){
            return " y. ";
            }
      if (code == 122){
            return " z. ";
            }

      return "";
      }
  return "";
  }

//----------------------------------------------------

function CLC_MathML_UnicodeToString_GreekUpper(code){
   if (CLC_MathML_Mode == 0){
      return " upper " + CLC_MathML_UnicodeToString_GreekLower(code+32);
      }
   return "";
   }

//----------------------------------------------------

function CLC_MathML_UnicodeToString_GreekLower(code){
   if (CLC_MathML_Mode == 0){
      if (code == 945){
            return " alpha ";
            }
      if (code == 946){
            return " beta ";
            }
      if (code == 947){
            return " gamma ";
            }
      if (code == 948){
            return " delta ";
            }
      if (code == 949){
            return " epsilon ";
            }
      if (code == 950){
            return " zeta ";
            }
      if (code == 951){
            return " eta ";
            }
      if (code == 952){
            return " theta ";
            }
      if (code == 953){
            return " iota ";
            }
      if (code == 954){
            return " kappa ";
            }
      if (code == 955){
            return " lambda ";
            }
      if (code == 956){
            return " mu ";
            }
      if (code == 957){
            return " nu ";
            }
      if (code == 958){
            return " xi ";
            }
      if (code == 959){
            return " omicron ";
            }
      if (code == 960){
            return " pi ";
            }
      if (code == 961){
            return " rho ";
            }
      if (code == 962){
            return " sigma ";
            }
      if (code == 963){
            return " sigma ";
            }
      if (code == 964){
            return " tau ";
            }
      if (code == 965){
            return " upsilon ";
            }
      if (code == 966){
            return " phi ";
            }
      if (code == 967){
            return " ki ";
            }
      if (code == 968){
            return " psi ";
            }
      if (code == 969){
            return " omega ";
            }
      return "";
      }
  return "";
  }

//----------------------------------------------------
function CLC_MathML_UnicodeToString_Symbols_33_47(code){
   if (CLC_MathML_Mode == 0){
      if (code == 33){
            return " shriek ";      //exclamation mark
            }
      if (code == 34){
            return " quote ";
            }
      if (code == 35){
            return " cross hatch ";
            }
      if (code == 36){
            return " dollar ";
            }
      if (code == 37){
            return " percent ";
            }
      if (code == 38){
            return " ampersand ";
            }
      if (code == 39){
            return " apostrophe ";
            }
      if (code == 40){
            return " L pare ";
            }
      if (code == 41){
            return " R pare ";
            }
      if (code == 42){
            return " star ";
            }
      if (code == 43){
            return " plus ";
            }
      if (code == 44){
            return " comma ";
            }
      if (code == 45){
            return " minus ";
            }
      if (code == 46){
            return " point ";
            }
      if (code == 47){
            return " slash ";
            }
      return "";
      }
  return "";
  }

//----------------------------------------------------

function CLC_MathML_UnicodeToString_Misc(code){
   if (CLC_MathML_Mode == 0){
      if (code == 60){
            return " less ";      
            }
      if (code == 61){
            return " equals ";
            }
      if (code == 62){
            return " greater ";
            }
      if (code == 91){
            return " L brack ";
            }
      if (code == 93){
            return " R brack ";
            }
      if (code == 123){
            return " L brace ";
            }
      if (code == 125){
            return " R brace ";
            }
      if (code == 162){
            return " cent ";
            }
      if (code == 163){
            return " pound ";
            }
      if (code == 176){
            return " degree ";
            }
      if (code == 177){
            return " plus or minus ";
            }
      if (code == 247){
            return " divide ";
            }
      if (code == 729){
            return " dot ";
            }
      if (code == 8709){
            return " empty set ";
            }
      if (code == 8721){
            return " summation ";
            }
      if (code == 8722){
            return " minus ";
            }
      if (code == 8734){
            return " infinity ";
            }
      if (code == 8736){
            return " angle ";
            }
      if (code == 8745){
            return " cap ";
            }
      if (code == 8746){
            return " cup ";
            }
      if (code == 8747){
            return " integral ";
            }
      if (code == 8800){
            return " not equal ";
            }
      if (code == 8804){
            return " less equal ";
            }
      if (code == 8805){
            return " greater equal ";
            }
      if (code == 8814){
            return " not less ";
            }
      if (code == 8815){
            return " not greater ";
            }
      return "";
      }
  return "";
  }