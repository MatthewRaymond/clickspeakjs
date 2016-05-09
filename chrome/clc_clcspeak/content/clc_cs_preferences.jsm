this.EXPORTED_SYMBOLS = [
  "CLC_CS_Preferences"
];

this.CLC_CS_Preferences = {
  // * Used for accessing preferences. Be sure to initialize first!
  CLC_CS_Pref: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
  
  init: function (changeEventHandler) {
	CLC_CS_Preferences.observe = changeEventHandler;
    CLC_CS_Preferences.CLC_CS_Pref.addObserver("extensions.clcspeakjs", this, false);
    CLC_CS_Preferences.CLC_CS_Pref.addObserver("media.webspeech.synth.enabled", this, false);
  },
  
  uninit: function () {
    CLC_CS_Preferences.CLC_CS_Pref.removeObserver("media.webspeech.synth.enabled", this);
    CLC_CS_Preferences.CLC_CS_Pref.removeObserver("extensions.clcspeakjs", this);
  },

  CLC_CS_Query_NativeTTS: function () {
    return CLC_CS_Preferences.CLC_CS_Pref.getBoolPref("media.webspeech.synth.enabled");
  },
  
  CLC_CS_SetPref_NativeTTS: function (bool_setting) {
    CLC_CS_Preferences.CLC_CS_Pref.setBoolPref("media.webspeech.synth.enabled", bool_setting);	
  },

  CLC_CS_Query_SpeechRate: function () {
    if (CLC_CS_Preferences.CLC_CS_Pref.prefHasUserValue("extensions.clcspeakjs.SpeechRate")) {
      return CLC_CS_Preferences.CLC_CS_Pref.getIntPref("extensions.clcspeakjs.SpeechRate");
    }

    return 0;
  },

  CLC_CS_SetPref_SpeechRate: function (int_setting) {
    CLC_CS_Preferences.CLC_CS_Pref.setIntPref("extensions.clcspeakjs.SpeechRate", int_setting);	
  },

  CLC_CS_Query_SpeechPitch: function () {
    if (CLC_CS_Preferences.CLC_CS_Pref.prefHasUserValue("extensions.clcspeakjs.SpeechPitch")) {
      return CLC_CS_Preferences.CLC_CS_Pref.getIntPref("extensions.clcspeakjs.SpeechPitch");
    }

    return 0;
  },

  CLC_CS_SetPref_SpeechPitch: function (int_setting) {
    CLC_CS_Preferences.CLC_CS_Pref.setIntPref("extensions.clcspeakjs.SpeechPitch", int_setting);	
  }

 };
