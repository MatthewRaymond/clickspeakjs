const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource:///modules/CustomizableUI.jsm");

var globalMM = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIMessageListenerManager);

let CLC_CLICKSPEAKJS = {
  //console: Cu.import("resource://gre/modules/Console.jsm", {}).console,
  addOnID: "{D1517460-5F8F-11DB-B0DE-0800200CA666}",
  lastUpdated: "20160505",
  //LoadSubScript : function(url) {
  //  Services.scriptloader.loadSubScript(url);
  //},
  hiddenWin: null,
  CLC_CS_Preferences : null,
  stringBundle: null,
  
  LoadFrameScript : function(url) {
    globalMM.loadFrameScript(url + "?lastUpdated=" + this.lastUpdated, true, true);
  },

  UnloadFrameScript : function(url) {
    globalMM.removeDelayedFrameScript(url + "?lastUpdated=" + this.lastUpdated);
  },

  FrameScriptLoad : function () {
    this.LoadFrameScript("chrome://clc_clcspeak/content/clc_cs_globalsFrame.js");

    this.LoadFrameScript("chrome://clc_utils/content/clc_window.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_fetch.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_text.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_id_special.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_id_subfunc_1.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_id_subfunc_2.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_id_main.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_cursor.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_content_main.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_status_main.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_mathml_char_lookup.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_mathml_main.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_spruleobj.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_css.js");
    this.LoadFrameScript("chrome://clc_utils/content/clc_segment.js");

    this.LoadFrameScript("chrome://clc_tts/content/clc_tts.js");
    this.LoadFrameScript("chrome://clc_tts/content/clc_tts_using_properties.js");
    this.LoadFrameScript("chrome://clc_tts/content/speakClient.js");

    this.LoadFrameScript("chrome://clc_clcspeak/content/clc_cs_currentAtomicObjAdjust.js");
    this.LoadFrameScript("chrome://clc_clcspeak/content/clc_cs_misc.js");
    this.LoadFrameScript("chrome://clc_clcspeak/content/clc_cs_mouseclickHandler.js");
    this.LoadFrameScript("chrome://clc_clcspeak/content/clc_cs_sentenceReading.js");
    this.LoadFrameScript("chrome://clc_clcspeak/content/clc_cs_spCSSFunc.js");
    this.LoadFrameScript("chrome://clc_clcspeak/content/clc_cs_windowAdjust.js");
    this.LoadFrameScript("chrome://clc_clcspeak/content/clc_cs_autoRead.js");
    this.LoadFrameScript("chrome://clc_clcspeak/content/clc_cs_interface.js");

    this.LoadFrameScript("chrome://clc_clcspeak/content/clc_cs_frameScript.js");
  },

  FrameScriptUnload : function () {
    this.UnloadFrameScript("chrome://clc_clcspeak/content/clc_cs_frameScript.js");

    this.UnloadFrameScript("chrome://clc_clcspeak/content/clc_cs_interface.js");
    this.UnloadFrameScript("chrome://clc_clcspeak/content/clc_cs_autoRead.js");
    this.UnloadFrameScript("chrome://clc_clcspeak/content/clc_cs_windowAdjust.js");
    this.UnloadFrameScript("chrome://clc_clcspeak/content/clc_cs_spCSSFunc.js");
    this.UnloadFrameScript("chrome://clc_clcspeak/content/clc_cs_sentenceReading.js");
    this.UnloadFrameScript("chrome://clc_clcspeak/content/clc_cs_mouseclickHandler.js");
    this.UnloadFrameScript("chrome://clc_clcspeak/content/clc_cs_misc.js");
    this.UnloadFrameScript("chrome://clc_clcspeak/content/clc_cs_currentAtomicObjAdjust.js");

    this.UnloadFrameScript("chrome://clc_tts/content/speakClient.js");
    this.UnloadFrameScript("chrome://clc_tts/content/clc_tts_using_properties.js");
    this.UnloadFrameScript("chrome://clc_tts/content/clc_tts.js");

    this.UnloadFrameScript("chrome://clc_utils/content/clc_segment.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_css.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_spruleobj.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_mathml_main.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_mathml_char_lookup.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_status_main.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_content_main.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_cursor.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_id_main.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_id_subfunc_2.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_id_subfunc_1.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_id_special.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_text.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_fetch.js");
    this.UnloadFrameScript("chrome://clc_utils/content/clc_window.js");
	
    this.UnloadFrameScript("chrome://clc_clcspeak/content/clc_cs_globalsFrame.js");
  },

  AttachMessageListeners : function() {
    globalMM.addMessageListener(CLC_CLICKSPEAKJS.addOnID + ":CLC_CS_Query_SpeechRate", this.onCLC_CS_Query_SpeechRate);
    globalMM.addMessageListener(CLC_CLICKSPEAKJS.addOnID + ":CLC_CS_Query_SpeechPitch", this.onCLC_CS_Query_SpeechPitch);
    globalMM.addMessageListener(CLC_CLICKSPEAKJS.addOnID + ":CLC_Interrupt", this.onCLC_Interrupt);
  },

  RemoveMessageListeners : function() {
    globalMM.removeMessageListener(CLC_CLICKSPEAKJS.addOnID + ":CLC_Interrupt", this.onCLC_Interrupt);
    globalMM.removeMessageListener(CLC_CLICKSPEAKJS.addOnID + ":CLC_CS_Query_SpeechPitch", this.onCLC_CS_Query_SpeechPitch);
    globalMM.removeMessageListener(CLC_CLICKSPEAKJS.addOnID + ":CLC_CS_Query_SpeechRate", this.onCLC_CS_Query_SpeechRate);
  },

  onCommandSpeak : function(aEvent) {
    let thisDOMWindow = aEvent.target.ownerDocument.defaultView;
    let browser = thisDOMWindow.gBrowser;
    let browserMM = browser.selectedBrowser.messageManager;

    if (browserMM) {
      browserMM.sendAsyncMessage(CLC_CLICKSPEAKJS.addOnID + ":CLC_CS_SpeakSelection");
    }
  },

  onCommandAutoRead : function(aEvent) {
    let thisDOMWindow = aEvent.target.ownerDocument.defaultView;
    let browser = thisDOMWindow.gBrowser;
    let browserMM = browser.selectedBrowser.messageManager;

    if (browserMM) {
      browserMM.sendAsyncMessage(CLC_CLICKSPEAKJS.addOnID + ":CLC_CS_SpeakPage");
    }
  },

  onCommandStop : function(aEvent) {
    let thisDOMWindow = aEvent.target.ownerDocument.defaultView;
    let browser = thisDOMWindow.gBrowser;
    let browserMM = browser.selectedBrowser.messageManager;

    if (browserMM) {
      browserMM.sendAsyncMessage(CLC_CLICKSPEAKJS.addOnID + ":CLC_CS_StopSpeaking");
    }
  },

  onOpenWindow: function (aXULWindow) {
    // Wait for the window to finish loading
    let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);

    aDOMWindow.addEventListener("load", function () {
      aDOMWindow.removeEventListener("load", arguments.callee, false);
      CLC_CLICKSPEAKJS.loadIntoWindow(aDOMWindow, aXULWindow);
    }, false);
  },

  onCloseWindow: function (aXULWindow) {},
  
  onWindowTitleChange: function (aXULWindow, aNewTitle) {},
  
  onCLC_CS_Query_SpeechRate : function (message) {
	return { result: CLC_CLICKSPEAKJS.CLC_CS_Preferences.CLC_CS_Query_SpeechRate() };
  },

  onCLC_CS_Query_SpeechPitch : function (message) {
	return { result: CLC_CLICKSPEAKJS.CLC_CS_Preferences.CLC_CS_Query_SpeechPitch() };
  },

  onCLC_Interrupt : function (message) {
	if (globalMM)
		globalMM.broadcastAsyncMessage(CLC_CLICKSPEAKJS.addOnID + ":CLC_Stop");
  },
  
  onPrefObserve : function(aSubject, aTopic, aData) {
	if (globalMM) {
	  globalMM.broadcastAsyncMessage(CLC_CLICKSPEAKJS.addOnID + ":CLC_Reset", {
        rate: CLC_CLICKSPEAKJS.CLC_CS_Preferences.CLC_CS_Query_SpeechRate(),
		pitch: CLC_CLICKSPEAKJS.CLC_CS_Preferences.CLC_CS_Query_SpeechPitch()
      });
	}
  },
  
  register: function () {
    // Load into any existing windows
    let XULWindows = Services.wm.getXULWindowEnumerator(null);

    while (XULWindows.hasMoreElements()) {
      let aXULWindow = XULWindows.getNext();
      let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);

      CLC_CLICKSPEAKJS.loadIntoWindow(aDOMWindow, aXULWindow);
    }

    // Listen to new windows
    Services.wm.addListener(CLC_CLICKSPEAKJS);
  },
  
  unregister: function () {
    // Unload from any existing windows
    let XULWindows = Services.wm.getXULWindowEnumerator(null);

    while (XULWindows.hasMoreElements()) {
      let aXULWindow = XULWindows.getNext();
      let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);

      CLC_CLICKSPEAKJS.unloadFromWindow(aDOMWindow, aXULWindow);
    }

    //Stop listening so future added windows dont get this attached
    Services.wm.removeListener(CLC_CLICKSPEAKJS);
  },
  
  //END - DO NOT EDIT HERE
  loadIntoWindow: function (aDOMWindow, aXULWindow) {
    if (aDOMWindow) {
	  var doc = aDOMWindow.document;
      var contentAreaContextMenu = doc.getElementById("contentAreaContextMenu");

      if (contentAreaContextMenu) {
        var menuSeperatorCLC = doc.createElement("menuseparator");
        var menuItemSpeak = doc.createElement("menuitem");
        var menuItemAuto = doc.createElement("menuitem");
        var menuItemStop = doc.createElement("menuitem");

        menuSeperatorCLC.setAttribute("id", "clc-clickspeak-seperator");

        menuItemSpeak.setAttribute("id", "clc-clickspeak-speak-menuitem");
        menuItemSpeak.setAttribute("label", CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_speak_menuitem_label'));
        menuItemSpeak.setAttribute("class", "menuitem-iconic");
        menuItemSpeak.setAttribute("image", "chrome://clc_clcspeak/skin/clc-clcspeak-button-speak-32.png");
        menuItemSpeak.addEventListener("command", CLC_CLICKSPEAKJS.onCommandSpeak, false);

        menuItemAuto.setAttribute("id", "clc-clickspeak-auto-menuitem");
        menuItemAuto.setAttribute("label", CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_auto_menuitem_label'));
        menuItemAuto.setAttribute("class", "menuitem-iconic");
        menuItemAuto.setAttribute("image", "chrome://clc_clcspeak/skin/clc-clcspeak-button-go-32.png");
        menuItemAuto.addEventListener("command", CLC_CLICKSPEAKJS.onCommandAutoRead, false);

        menuItemStop.setAttribute("id", "clc-clickspeak-stop-menuitem");
        menuItemStop.setAttribute("label", CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_stop_menuitem_label'));
        menuItemStop.setAttribute("class", "menuitem-iconic");
        menuItemStop.setAttribute("image", "chrome://clc_clcspeak/skin/clc-clcspeak-button-stop-32.png");
        menuItemStop.addEventListener("command", CLC_CLICKSPEAKJS.onCommandStop, false);

        contentAreaContextMenu.appendChild(menuSeperatorCLC);
        contentAreaContextMenu.appendChild(menuItemSpeak);
        contentAreaContextMenu.appendChild(menuItemAuto);
        contentAreaContextMenu.appendChild(menuItemStop);
      }
    }

    return;
  },
  
  unloadFromWindow: function (aDOMWindow, aXULWindow) {
    if (aDOMWindow) {
      var contentAreaContextMenu = aDOMWindow.document.getElementById("contentAreaContextMenu");

      if (contentAreaContextMenu) {
        var menuSeperatorCLC = aDOMWindow.document.getElementById("clc-clickspeak-seperator");
        var menuItemSpeak = aDOMWindow.document.getElementById("clc-clickspeak-speak-menuitem");
        var menuItemAuto = aDOMWindow.document.getElementById("clc-clickspeak-auto-menuitem");
        var menuItemStop = aDOMWindow.document.getElementById("clc-clickspeak-stop-menuitem");

        menuItemSpeak.removeEventListener("command", CLC_CLICKSPEAKJS.onCommandSpeak, false);
        menuItemAuto.removeEventListener("command", CLC_CLICKSPEAKJS.onCommandAutoRead, false);
        menuItemStop.removeEventListener("command", CLC_CLICKSPEAKJS.onCommandStop, false);

        contentAreaContextMenu.removeChild(menuSeperatorCLC);
        contentAreaContextMenu.removeChild(menuItemSpeak);
        contentAreaContextMenu.removeChild(menuItemAuto);
        contentAreaContextMenu.removeChild(menuItemStop);
      }
    }

    return;
  },
  
  init : function() {
    function setAttributes(aNode, aAttrs) {
      let doc = aNode.ownerDocument;
	  
      for (let [name, value] of Iterator(aAttrs)) {
        if (!value) {
          if (aNode.hasAttribute(name))
            aNode.removeAttribute(name);
        } else {
          if (name == "shortcutId") {
            continue;
          }
          //if (name == "label" || name == "tooltiptext") {
          //  let stringId = (typeof value == "string") ? value : name;
          //  let additionalArgs = [];
          //  if (aAttrs.shortcutId) {
          //    let shortcut = doc.getElementById(aAttrs.shortcutId);
          //    if (doc) {
          //      additionalArgs.push(ShortcutUtils.prettifyShortcut(shortcut));
          //    }
          //  }
          //  value = CustomizableUI.getLocalizedProperty({id: aAttrs.id}, stringId, additionalArgs);
          //}
          aNode.setAttribute(name, value);
        }
      }
    }

    function updateCombinedWidgetStyle(aNode, aArea, aModifyCloseMenu) {
      let inPanel = (aArea == CustomizableUI.AREA_PANEL);
      let cls = inPanel ? "panel-combined-button" : "toolbarbutton-1 toolbarbutton-combined";
      let attrs = {class: cls};
  
      if (aModifyCloseMenu) {
        attrs.closemenu = inPanel ? "none" : null;
      }
  
      attrs["cui-areatype"] = aArea ? CustomizableUI.getAreaType(aArea) : null;
  
      for (let i = 0, l = aNode.childNodes.length; i < l; ++i) {
        if (aNode.childNodes[i].localName == "separator")
          continue;
  
        setAttributes(aNode.childNodes[i], attrs);
      }
    }

	CLC_CLICKSPEAKJS.stringBundle = Services.strings.createBundle('chrome://clc_clcspeak/locale/clc_clcspeak.properties?' + Math.random()); // Randomize URI to work around bug 719376
	  
	const kNSXUL = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
	
    let io = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);

    // the 'style' directive isn't supported in chrome.manifest for boostrapped
    // extensions, so this is the manual way of doing the same.
    this._ss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
    this._uri = io.newURI("chrome://clc_clcspeak/skin/clc_clickspeak.css", null, null);
    this._ss.loadAndRegisterSheet(this._uri, this._ss.USER_SHEET);

	/*
    // create widget and add it to the main toolbar.
    CustomizableUI.createWidget(
      {
        id: "clickspeakjs-controls",
        type: "custom",
        label: CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clickspeakjs_controls_label'),
        defaultArea: CustomizableUI.AREA_PANEL,
        onBuild: function(aDocument) {
          let buttons = [{
            id: "clc-clickspeak-speak-button",
            label: CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_speak_button_label'),
            tooltiptext: CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_speak_button_tooltip'),
            onCommand : CLC_CLICKSPEAKJS.onCommandSpeak
          }, {
            id: "clc-clickspeak-auto-button",
            label: CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_auto_button_label'),
            tooltiptext: CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_auto_button_tooltip'),
            onCommand : CLC_CLICKSPEAKJS.onCommandAutoRead
          }, {
            id: "clc-clickspeak-stop-button",
            label: CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_stop_button_label'),
            tooltiptext: CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_stop_button_tooltip'),
            onCommand : CLC_CLICKSPEAKJS.onCommandStop
          }];

          let node = aDocument.createElementNS(kNSXUL, "toolbaritem");
          node.setAttribute("id", "clickspeakjs-controls");
          node.setAttribute("label", CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clickspeakjs_controls_label'));
          node.setAttribute("title", CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clickspeakjs_controls_title'));
          //CustomizableUI.getLocalizedProperty(this, "label"));
          //node.setAttribute("title", CustomizableUI.getLocalizedProperty(this, "tooltiptext"));
          // Set this as an attribute in addition to the property to make sure we can style correctly.
          node.setAttribute("removable", "true");
          node.classList.add("chromeclass-toolbar-additional");
          node.classList.add("toolbaritem-combined-buttons");
          node.classList.add("panel-wide-item");

          buttons.forEach(function(aButton, aIndex) {
            if (aIndex !== 0)
              node.appendChild(aDocument.createElementNS(kNSXUL, "separator"));
            let btnNode = aDocument.createElementNS(kNSXUL, "toolbarbutton");
            setAttributes(btnNode, aButton);
            node.appendChild(btnNode);
          });

          updateCombinedWidgetStyle(node, this.currentArea);

          let listener = {
            onWidgetAdded: function(aWidgetId, aArea, aPosition) {
              if (aWidgetId != this.id)
                return;
              updateCombinedWidgetStyle(node, aArea);
            }.bind(this),

            onWidgetRemoved: function(aWidgetId, aPrevArea) {
              if (aWidgetId != this.id)
                return;
              // When a widget is demoted to the palette ('removed'), it's visual
              // style should change.
              updateCombinedWidgetStyle(node);
            }.bind(this),

            onWidgetReset: function(aWidgetNode) {
              if (aWidgetNode != node)
                return;
              updateCombinedWidgetStyle(node, this.currentArea);
            }.bind(this),

            onWidgetMoved: function(aWidgetId, aArea) {
              if (aWidgetId != this.id)
                return;
              updateCombinedWidgetStyle(node, aArea);
            }.bind(this),

            onWidgetInstanceRemoved: function(aWidgetId, aDoc) {
              if (aWidgetId != this.id || aDoc != aDocument)
                return;
              CustomizableUI.removeListener(listener);
            }.bind(this),

            onWidgetDrag: function(aWidgetId, aArea) {
              if (aWidgetId != this.id)
                return;
              aArea = aArea || this.currentArea;
              updateCombinedWidgetStyle(node, aArea);
            }.bind(this)
          };
          CustomizableUI.addListener(listener);

          return node;
        }
      }
    );
	*/

    CustomizableUI.createWidget({
      id : "clc-clickspeak-speak-button-separate",
      label : CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_speak_menuitem_label'),
      tooltiptext : CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_speak_button_tooltip'),
      onCommand : CLC_CLICKSPEAKJS.onCommandSpeak
    });

    CustomizableUI.createWidget({
      id : "clc-clickspeak-auto-button-separate",
      label : CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_auto_menuitem_label'),
      tooltiptext : CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_auto_button_tooltip'),
      onCommand : CLC_CLICKSPEAKJS.onCommandAutoRead
    });

    CustomizableUI.createWidget({
      id : "clc-clickspeak-stop-button-separate",
      label : CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_stop_menuitem_label'),
      tooltiptext : CLC_CLICKSPEAKJS.stringBundle.GetStringFromName('clc_clickspeak_stop_button_tooltip'),
      onCommand : CLC_CLICKSPEAKJS.onCommandStop
    });
	
	CLC_CLICKSPEAKJS.CLC_CS_Preferences = Cu.import("chrome://clc_clcspeak/content/clc_cs_preferences.jsm", {}).CLC_CS_Preferences;
	CLC_CLICKSPEAKJS.CLC_CS_Preferences.init(CLC_CLICKSPEAKJS.onPrefObserve);
	
    CLC_CLICKSPEAKJS.FrameScriptLoad();
    CLC_CLICKSPEAKJS.AttachMessageListeners();
    CLC_CLICKSPEAKJS.register();
  },

  uninit : function() {
    CLC_CLICKSPEAKJS.unregister();
    CLC_CLICKSPEAKJS.RemoveMessageListeners();

    // * Prevent the frame script from loading on any other frames.
    CLC_CLICKSPEAKJS.FrameScriptUnload();

    //CLC_CS_StopTTSEngine();
	CLC_CLICKSPEAKJS.CLC_CS_Preferences.uninit();
	CLC_CLICKSPEAKJS.CLC_CS_Preferences = null;
    Cu.unload("chrome://clc_clcspeak/content/clc_cs_preferences.jsm");

    //CustomizableUI.destroyWidget("clickspeakjs-controls");
    CustomizableUI.destroyWidget("clc-clickspeak-speak-button-separate");
    CustomizableUI.destroyWidget("clc-clickspeak-auto-button-separate");
    CustomizableUI.destroyWidget("clc-clickspeak-stop-button-separate");

    if (this._ss.sheetRegistered(this._uri, this._ss.USER_SHEET)) {
      this._ss.unregisterSheet(this._uri, this._ss.USER_SHEET);
    }
	
	CLC_CLICKSPEAKJS.stringBundle = null;
  }
};

function install(aData, aReason) {}

function uninstall(aData, aReason) {}

function startup(aData, aReason) {
  CLC_CLICKSPEAKJS.init();
}

function shutdown(aData, aReason) {
  CLC_CLICKSPEAKJS.uninit();
}
