var CLC_SPEAKJS_SpeakWorker;

try {
  CLC_SPEAKJS_SpeakWorker = new Worker('chrome://clc_tts/content/speakWorker.js');
} catch(e) {
  CLC_SPEAKJS_SpeakWorker = null;
}

function CLC_SPEAKJS_Speak(text, audioElement, args) {
  var PROFILE = 1;

  function parseWav(wav) {
    function readInt(i, bytes) {
      var ret = 0;
      var shft = 0;

      while (bytes) {
        ret += wav[i] << shft;
        shft += 8;
        i++;
        bytes--;
      }

      return ret;
    }

    if (readInt(20, 2) != 1) {
      throw 'Invalid compression code, not PCM';
    }

    if (readInt(22, 2) != 1) {
      throw 'Invalid number of channels, not 1';
    }

    return {
      sampleRate: readInt(24, 4),
      bitsPerSample: readInt(34, 2),
      samples: wav.subarray(44)
    };
  }

  function playHTMLAudioElement(wav) {
    function encode64(data) {
      var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      var PAD = '=';
      var ret = '';
      var leftchar = 0;
      var leftbits = 0;

      for (var i = 0; i < data.length; i++) {
        leftchar = (leftchar << 8) | data[i];
        leftbits += 8;

        while (leftbits >= 6) {
          var curr = (leftchar >> (leftbits-6)) & 0x3f;
          leftbits -= 6;
          ret += BASE[curr];
        }
      }

      if (leftbits == 2) {
        ret += BASE[(leftchar&3) << 4];
        ret += PAD + PAD;
      } else if (leftbits == 4) {
        ret += BASE[(leftchar&0xf) << 2];
        ret += PAD;
      }

      return ret;
    }

    return "data:audio/x-wav;base64,"+encode64(wav);

    //document.getElementById("audio").innerHTML=("<audio id=\"player\" src=\"data:audio/x-wav;base64,"+encode64(wav)+"\">");
    //document.getElementById("player").play();
  }

  /*
  function playAudioDataAPI(data) {
    try {
      var output = new Audio();

      output.mozSetup(1, data.sampleRate);

      var num = data.samples.length;
      var buffer = data.samples;
      var f32Buffer = new Float32Array(num);

      for (var i = 0; i < num; i++) {
        var value = buffer[i<<1] + (buffer[(i<<1)+1]<<8);
        if (value >= 0x8000) value |= ~0x7FFF;
        f32Buffer[i] = value / 0x8000;
      }

      output.mozWriteAudio(f32Buffer);
      return true;
    } catch(e) {
      return false;
    }
  }
  */

  function handleWav(wav) {
    var data = parseWav(wav); // validate the data and parse it

    // TODO: try playAudioDataAPI(data), and fallback if failed
    return playHTMLAudioElement(wav);
  }

  //function WriteToConsole(message) {
  //  myclass = Components.classes['@mozilla.org/consoleservice;1'];
  //  myservice = myclass.getService(Components.interfaces.nsIConsoleService);
  //  myservice.logStringMessage(message);
  //}

  // * Fix an error that occurs when the "text" string starts with a minus.
  if (text[0] == "-") {
    text = "negative " + text.substring(1);
  }

  if (CLC_SPEAKJS_SpeakWorker == null || (args && args.noWorker)) {
    // Do everything right now. speakGenerator.js must have been loaded.
    var wav = generateSpeech(text, args);

    audioElement.src = handleWav(wav);
    audioElement.play();
  } else {
    audioElement.Waiting = true;

    // Call the worker, which will return a wav that we then play
    CLC_SPEAKJS_SpeakWorker.onmessage = function(event) {
      if (audioElement.Waiting) {
        audioElement.src = handleWav(event.data);
        audioElement.play();
        audioElement.Waiting = false;
      }
    };

    CLC_SPEAKJS_SpeakWorker.postMessage({ text: text, args: args });
  }
}

