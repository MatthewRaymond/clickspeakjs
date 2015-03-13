var CLC_SPEAKJS_SpeakWorker;

try {
  CLC_SPEAKJS_SpeakWorker = new Worker('chrome://clc_tts/content/speakWorker.js');
} catch(e) {
  CLC_SPEAKJS_SpeakWorker = null;
}

function CLC_SPEAKJS_Speak(text, audioCtx, args) {
  var PROFILE = 1;
  var source = audioCtx.createBufferSource();

  function WriteToConsole(message) {
    myclass = Components.classes['@mozilla.org/consoleservice;1'];
    myservice = myclass.getService(Components.interfaces.nsIConsoleService);
    myservice.logStringMessage(message);
  }

  function playSound(streamBuffer) {
    audioCtx.playing = true;
    audioCtx.source = source;

    audioCtx.decodeAudioData(
      streamBuffer,
      function(audioData) {
        source.addEventListener("ended", function() {
          audioCtx.playing = false;
          audioCtx.source = null;
          //WriteToConsole("speakClient.js: Your audio has finished playing");
        });

        source.buffer = audioData;
        source.connect(audioCtx.destination);
        source.start();

        /*
        var duration = audioData.duration;
        var delay = (duration) ? Math.ceil(duration * 1000) : 100;

        delay += 100;

        setTimeout(function () {
          audioCtx.playing = false;
          audioCtx.source = null;
        }, delay);

        */
      }
    );
  }

  function handleWav(wav) {
    var buffer = new ArrayBuffer(wav.length);

    new Uint8Array(buffer).set(wav);

    playSound(buffer);
  }

  // * Fix an error that occurs when the "text" string starts with a minus.
  if (text[0] == "-") {
    text = "negative " + text.substring(1);
  }

  if (CLC_SPEAKJS_SpeakWorker == null || (args && args.noWorker)) {
    // Do everything right now. speakGenerator.js must have been loaded.
    var wav = generateSpeech(text, args);

    handleWav(wav);
  } else {
    audioCtx.Waiting = true;

    // Call the worker, which will return a wav that we then play
    CLC_SPEAKJS_SpeakWorker.onmessage = function(event) {
      if (audioCtx.Waiting) {
        handleWav(event.data);
        audioCtx.Waiting = false;
      }
    };

    CLC_SPEAKJS_SpeakWorker.postMessage({ text: text, args: args });
  }
}

