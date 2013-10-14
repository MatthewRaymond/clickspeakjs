var CLCUtilities = CLCUtilities || {};

CLCUtilities.XinDiff = function() {
  /*
   Additional functions taken from the official XinDiff website:
   http://xindiff.cvs.sourceforge.net/
  */

  function Dictionary(fast) {
      this.map = {};

      this.Add = fast ?
          function(key, value) {
              this.map[key] = value;
          }:
          function(key, value) {
              this.map['_' + key] = value;
          };

      this.Exists = fast ?
          function(key) {
              return this.map.hasOwnProperty(key);
          }:
          function(key) {
              return this.map.hasOwnProperty('_' + key);
          };

      this.Item = fast ?
          function(key) {
              return this.map[key];
          }:
          function(key) {
              return this.map['_' + key];
          };
  }

  this.createMap = function(fast) {
      return new Dictionary(fast);
  };

  this.splitLines = function(text) {
      var lines = [];
      var blanks = createMap(true);
      var line = '';
      var blank = '';
      var length = text.length;
      for (var i = 0; i < length; ++i) {
          var ch = text.charAt(i);
          switch (ch) {
          case '\n':
          case '\r':
          //case ' ':
          //case '\t':
              if (line != '') {
                  lines.push(line);
                  line = '';
              }
              blank += ch;
              break;
          default:
              if (blank != '') {
                  blanks.Add(lines.length, blank);
                  blank = '';
              }
              line += ch;
              break;
          }
      }
      if (line != '') {
          lines.push(line);
      }
      else if (blank != '') {
          blanks.Add(lines.length, blank);
      }
      return {'words': lines, 'symbols': blanks};
  };

  /*
   XinDiff
   XinDiff.js - A proof of concept for the algorithm in Javascript
   Copyright (C) 2006 Albert Jin <albert.jin@gmail.com>

   This software is published under the terms of LGPL.
   See the GNU Lesser General Public License for more details at
   http://www.gnu.org/copyleft/lgpl.html.
  */

  function xindiffLowerBound(array, begin, end, value) {
      if (begin <= end && array[end] >= value) {
          for (;;) {
              if ((begin == end) || (array[begin] >= value)) {
                  return begin;
              }

              var middle = begin + ((end - begin) >> 1);

              if (array[middle] < value) {
                  begin = middle + 1;
              } else if (array[middle] > value) {
                  end = middle;
              } else {
                  return middle;
              }
          }
      }

      return null;
  }

  function xindiffMatch(element, index, begin, end) {
      if (index.Exists(element)) {
          var locations = index.Item(element);
          var position = xindiffLowerBound(locations, 0, locations.length - 1, begin);
          
          if ((position != null) && (locations[position] <= end)) {
              return locations[position];
          }
      }
      
      return null;
  }

  function XinDiffLinks() {
      this.pushBack = function(range) {
          var last = this.ranges.length - 1;
          if ((last >= 0) && (this.ranges[last].second + 1 == range.first)) {
              this.ranges[last].second = range.second;
          }
          else {
              this.ranges.push(range);
          }
      };

      this.pushFront = function(range) {
          if ((this.ranges.length != 0) && (this.ranges[0].first - 1 == range.second)) {
              this.ranges[0].first = range.first;
          }
          else {
              this.ranges.unshift(range);
          }
      };

      this.appendBack = function(position, match) {
          ++this.count;
          this.pushBack({first : position, second : position});
      };

      this.appendFront = function(position, match) {
          ++this.count;
          this.pushFront({first : position, second : position});
      };

      this.merge = function(links) {
          this.count += links.count;
          this.next = links;
          return this;
      };

      this.pushBackLinks = function(links) {
          var length = links.ranges.length;
          if (length > 0) {
              this.pushBack(links.ranges[0]);
              for (var i = 1; i < length; ++i) {
                  this.ranges.push(links.ranges[i]);
              }
          }
      };

      this.pack = function(links) {
          for (var p = this; p != null; p = p.next) {
              links.pushBackLinks(p);
          }
          links.count += this.count;
          return links;
      };

      this.serialize = function(diff, output) {
          output.onBegin();
          var position0 = 0;
          var position1 = 0;
          var sequence0 = diff.sequences[0];
          var sequence1 = diff.sequences[1];
          var end0 = sequence0.length - 1;
          var end1 = sequence1.length - 1;
          var length = this.ranges.length;
          for (var id = 0; id < length; ++id) {
              var i = this.ranges[id];
              // outside the range
              if (position1 < i.first) {
                  output.onDeleted(position1, i.first - 1);
                  position1 = i.first;
              }

              // in range
              var last1 = position1;
              for (var j = position1; j <= i.second; ++j) {
                  // check inconsecutive sequence due to insertions
                  var overlap = xindiffMatch(sequence1[j], diff.index[0], position0, end0);
                  if (position0 < overlap) {
                      if (last1 < j) {
                          //output.onSame(last1, j - 1, position0 - j + last1, position0 - 1);
                          last1 = j;
                      }
                      output.onInserted(position0, overlap - 1);
                  }
                  position0 = overlap + 1;
              }
              position1 = i.second + 1;
              //if (last1 < position1) {
              //  output.onSame(last1, position1 - 1, position0 - position1 + last1, position0 - 1);
              //}
          }

          // remainder
          if (position1 <= end1) {
              output.onDeleted(position1, end1);
          }
          if (position0 <= end0) {
              output.onInserted(position0, end0);
          }
          output.onEnd();
      };

      this.count = 0;
      this.next = null;
      this.ranges = [];
  }

  this.XinDiffEngine = function(createMap) {
      this.createMap = createMap;

      this.doDiff = function() {
          var tailLinks = new XinDiffLinks();
          var begin0 = 0;
          var end0 = this.sequences[0].length - 1;
          var begin1 = 0;
          var end1 = this.sequences[1].length - 1;

          for (;;) {
              if ((end0 < begin0) || (end1 < begin1)) {
                  break;
              }

              var element0 = this.sequences[0][end0];
              var element1 = this.sequences[1][end1];

              if (element0 == element1) {
                  tailLinks.appendFront(end1, end0);
                  --end0;
                  --end1;
                  continue;
              }

              if (xindiffMatch(element0, this.index[1], begin1, end1) == null) {
                  --end0;
                  continue;
              }

              if (xindiffMatch(element1, this.index[0], begin0, end0) == null) {
                  --end1;
                  continue;
              }

              break;
          }

          return tailLinks.pack(this.diff(begin0, end0, begin1, end1, this.createMap(true), -1).pack(new XinDiffLinks()));
      };

      this.diff = function(begin0, end0, begin1, end1, cache, minLinks) {
          var key = '' + begin0 + '_' + begin1;
          if (cache.Exists(key)) {
              return cache.Item(key);
          }
          var links = new XinDiffLinks();
          cache.Add(key, links);

          var overlap0, overlap1;
          for (;;) {
              if ((end0 < begin0) || (end1 < begin1)) {
                  return links;
              }

              var sequence0 = this.sequences[0][begin0];
              var sequence1 = this.sequences[1][begin1];
              if (sequence0 == sequence1) {
                  links.appendBack(begin1, begin0);
                  ++begin0;
                  ++begin1;
                  continue;
              }

              overlap1 = xindiffMatch(sequence0, this.index[1], begin1, end1);
              if (overlap1 == null) {
                  ++begin0;
                  continue;
              }

              overlap0 = xindiffMatch(sequence1, this.index[0], begin0, end0);
              if (overlap0 == null) {
                  ++begin1;
                  continue;
              }

              break;
          }
          minLinks -= links.count;

          var linksx = null;
          var links1;
          var links0;
          
          if ((overlap0 - begin0) <= (overlap1 - begin1)) {
              links0 = this.diff(overlap0, end0, begin1, end1, cache, minLinks);
              
              if (links0.count > (end1 - overlap1)) {
                  linksx = links0;
              }
              else {
                  links1 = this.diff(begin0, end0, overlap1, end1, cache, Math.max(minLinks, links0.count));
                  linksx = (links0.count >= links1.count) ? links0 : links1;
              }
          }
          else {
              links1 = this.diff(begin0, end0, overlap1, end1, cache, minLinks);
              
              if (links1.count > (end0 - overlap0)) {
                  linksx = links1;
              }
              else {
                  links0 = this.diff(overlap0, end0, begin1, end1, cache, Math.max(minLinks, links1.count));
                  linksx = (links1.count >= links0.count) ? links1 : links0;
              }
          }

          minLinks = Math.max(minLinks, linksx.count);
          var count = Math.min(end0-begin0, end1-begin1) + 1 - minLinks;
          if (count > 1) {
              count = Math.min(count, Math.min(overlap0-begin0, overlap1-begin1) + 1);
              for (; count > 1; --count) {
                  ++begin0;
                  ++begin1;
                  var element0 = this.sequences[0][begin0];
                  var element1 = this.sequences[1][begin1];
                  if ((element0 == element1) ||
                      (xindiffMatch(element0, this.index[1], begin1, overlap1) != null) ||
                      (xindiffMatch(element1, this.index[0], begin0, overlap0) != null)) {
                      links1 = this.diff(begin0, end0, begin1, end1, cache, minLinks);
                      
                      if (links1.count > linksx.count) {
                          linksx = links1;
                      }
                      break;
                  }
              }
          }

          links.merge(linksx);
          return links;
      };

      this.assign = function(sequence, id) {
          this.index[id] = this.createMap();
          this.sequences[id] = sequence;

          var length = sequence.length;
          for (var i = 0; i < length; ++i) {
              var element = sequence[i];
              if (this.index[id].Exists(element)) {
                  this.index[id].Item(element).push(i);
              }
              else {
                  this.index[id].Add(element, [i]);
              }
          }
      };

      this.index = [this.createMap(), this.createMap()];
      this.sequences = [[], []];
  };

  this.XinDiffOutput = function(createMap) {
      this.createMap = createMap;
      this.spaces = [];
      this.html = [];

      this.getHTML = function() {
          this.fixSpaces();
          return this.html.join('');
      };

      this.fixSpaces = function() {
          var length = this.spaces.length;
          if (length > 0) {
  //            for (length -= 2; length >= 0; --length) {
  //Modification: Don't try to fix spaces
  //                this.html[this.spaces[length]] = '&nbsp;';
  //End of Modified section
  //            }
              this.spaces = [];
          }
      };

      this.escapeChar = function(ch) {
          if (ch == ' ') {
              this.spaces.push(this.html.length);
              this.html.push(' ');
              return;
          }

          this.fixSpaces();
          switch (ch) {

  //Modified section here - I don't want any character replacement as I need the raw HTML
  //Commenting out all cases except for the default
  //        case '<':
  //            this.html.push('&lt;');
  //            break;
  //        case '>':
  //            this.html.push('&gt;');
  //            break;
  //        case '&':
  //            this.html.push('&amp;');
  //            break;
  //        case '\r':
  //            break;
  //        case '\t':
  //            this.html.push('<span class="mark">&rarr;</span>');
  //            break;
  //        case '\n':
  //            this.html.push('<span class="mark">&darr;</span><br/>');
  //            break;
  //Have to do a replacement because otherwise the INS and DEL go in the wrong place.
          case '<':
              this.html.push('##&lt;##');
              break;
          case '>':
              this.html.push('##&gt;##');
              break;
  //End of Modified section

          default:
              this.html.push(ch);
              break;

          }
      };

      this.escapeText = function(text) {
          var length = text.length;
          for (var i = 0; i < length; ++i) {
              this.escapeChar(text.charAt(i));
          }
      };

      this.onBegin = function() {
          this.lastDeleted = this.symbols[1].Exists(0) ? this.symbols[1].Item(0) : null;
          this.lastInserted = this.symbols[0].Exists(0) ? this.symbols[0].Item(0) : null;
      };

      this.flushSymbols = function() {
          this.dumpDiffSymbols();
          if (this.lastDeleted != null) {
              this.html.push('<del>');
              this.escapeText(this.lastDeleted);
              this.html.push('</del>');
              this.lastDeleted = null;
          }
          else if (this.lastInserted != null) {
              this.html.push('<ins>');
              this.escapeText(this.lastInserted);
              this.html.push('</ins>');
              this.lastInserted = null;
          }
      };

      this.onEnd = this.flushSymbols;

      /*
      this.onSame = function(beginLeft, endLeft, beginRight, endRight) {
          this.flushSymbols();
          var j = beginRight;
          var i = beginLeft;
          for (;;) {
              this.escapeText(this.diff.sequences[1][i]);
              ++i; ++j;
              if (i > endLeft) {
                  this.lastDeleted = this.symbols[1].Exists(i) ? this.symbols[1].Item(i) : null;
                  this.lastInserted = this.symbols[0].Exists(j) ? this.symbols[0].Item(j) : null;
                  break;
              }
              var left = this.symbols[1].Exists(i);
              var right = this.symbols[0].Exists(j);

              if (left && right) {
                  left = this.symbols[1].Item(i);
                  right = this.symbols[0].Item(j);
                  if (left == right) {
                      this.escapeText(left);
                  }
                  else {
                      this.dumpSymbols(left, right);
                  }
              }
              else if (left) {
                  this.html.push('<del>');
                  this.escapeText(this.symbols[1].Item(i));
                  this.html.push('</del>');
              }
              else if (right) {
                  this.html.push('<ins>');
                  this.escapeText(this.symbols[0].Item(j));
                  this.html.push('</ins>');
              }
          }
      };
      */

      this.onInserted = function(begin, end) {
          this.dumpHeadSymbols();
          this.html.push('<ins>');
          if (this.lastInserted != null) {
              this.escapeText(this.lastInserted);
              this.lastInserted = null;
          }
          this.dumpSequence(begin, end, 0);
          this.html.push('</ins>');

          ++end;
          if (this.symbols[0].Exists(end)) {
              this.lastInserted = this.symbols[0].Item(end);
          }
      };

      this.onDeleted = function(begin, end) {
          this.dumpHeadSymbols();
          this.html.push('<del>');
          if (this.lastDeleted != null) {
              this.escapeText(this.lastDeleted);
              this.lastDeleted = null;
          }
          this.dumpSequence(begin, end, 1);
          this.html.push('</del>');

          ++end;
          if (this.symbols[1].Exists(end)) {
              this.lastDeleted = this.symbols[1].Item(end);
          }
      };

      this.dumpSequence = function(begin, end, id) {
          for (var i = begin;;) {
              this.escapeText(this.diff.sequences[id][i]);
              if (i == end) {
                  break;
              }
              ++i;
              if (this.symbols[id].Exists(i)) {
                  this.escapeText(this.symbols[id].Item(i));
              }
          }
      };

      this.dumpHeadSymbols = function() {
          var left = this.lastDeleted;
          var right = this.lastInserted;
          if ((left == null) || (right == null)) {
              return;
          }

          var length = Math.min(left.length, right.length);
          for (var i = 0;; ++i) {
              if (i == length) {
                  if (left.length > i) {
                      this.lastDeleted = left.substr(i);
                      this.lastInserted = null;
                  }
                  else {
                      this.lastDeleted = null;
                      this.lastInserted = right.substr(i);
                  }
                  break;
              }
              else if (left.charCodeAt(i) == right.charCodeAt(i)) {
                  this.escapeChar(left.charAt(i));
              }
              else {
                  this.lastDeleted = left.substr(i);
                  this.lastInserted = right.substr(i);
                  if (left.charCodeAt(left.length - 1) == right.charCodeAt(right.length - 1)) {
                      this.dumpSymbols(this.lastDeleted, this.lastInserted);
                  }
                  break;
              }
          }
      };

      this.dumpDiffSymbols = function() {
          if ((this.lastInserted != null) && (this.lastDeleted != null)) {
              var left = this.lastDeleted;
              var right = this.lastInserted;
              if (left == right) {
                  this.escapeText(left);
                  this.lastDeleted = null;
                  this.lastInserted = null;
              }
              else {
                  this.dumpSymbols(left, right);
              }
          }
      };

      this.dumpSymbols = function(left, right) {
          var diff = this.diff;
          var symbols = this.symbols;

          this.diff = new XinDiffEngine(this.createMap);
          this.diff.assign(right.split(''), 0);
          this.diff.assign(left.split(''), 1);
          this.symbols = [this.createMap(true), this.createMap(true)];

          this.diff.doDiff().serialize(this.diff, this);

          this.diff = diff;
          this.symbols = symbols;
      };
  };
};

