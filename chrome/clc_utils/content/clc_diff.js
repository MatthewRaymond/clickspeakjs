//Copyright (C) 2005
//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Diff
//by Charles L. Chen
//Modified by Matthew Raymond
 
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
 

//Last Modified Date 09/23/2012

//Note: This uses XinDiff.js, a LGPL JavaScript diff 
//program created by Albert Jin <albert.jin@gmail.com>.


//------------------------------------------
//Returns an array that lists the results of the diff.
//
// Values for "mode": 
// 0 == "additions"
// 1 == "deletions"
//
//
function CLC_GetDiffsByLine(prev_string, current_string, mode){
    var left = CLCUtilities.XinDiff.splitLines(prev_string);
    var right = CLCUtilities.XinDiff.splitLines(current_string);

    var diff = new CLCUtilities.XinDiff.XinDiffEngine(CLCUtilities.XinDiff.createMap);
    diff.assign(left.words, 1);
    diff.assign(right.words, 0);

    var output = new CLCUtilities.XinDiff.XinDiffOutput(CLCUtilities.XinDiff.createMap);
    output.diff = diff;
    output.symbols = [right.symbols, left.symbols];

    diff.doDiff().serialize(diff, output);

    var diffHTML = output.getHTML();

    var startTag = "<ins>";
    var endTag = "</ins>";
    
    if (mode == 1) {
       startTag = "<del>";
       endTag = "</del>";
    }

    var pos = diffHTML.indexOf(startTag);
    var answerArray = new Array();
    
    while (pos != -1){
       var endPos = diffHTML.indexOf(endTag, pos);
       
       if (endTag == -1){
          //Something went really wrong here, 
          //return what has already been gathered
          return answerArray;
       }
       
       var tempStr = diffHTML.substring(pos+startTag.length, endPos);
       answerArray.push(tempStr);
       pos = diffHTML.indexOf(startTag, endPos);
    }

    var i = 0;
    
    for (i = 0; i<answerArray.length; i++) {
       pos = 0;
       pos = answerArray[i].indexOf("##&lt;##", pos);
       while (pos != -1){
          answerArray[i] = answerArray[i].replace("##&lt;##", "       <");
          pos = answerArray[i].indexOf("##&lt;##", pos);
       }
    }
    
    for (i = 0; i<answerArray.length; i++) {
       pos = 0;
       pos = answerArray[i].indexOf("##&gt;##", pos);
       while (pos != -1){
          answerArray[i] = answerArray[i].replace("##&gt;##", ">       ");
          pos = answerArray[i].indexOf("##&gt;##", pos);
       }
    }

    return answerArray;
}
