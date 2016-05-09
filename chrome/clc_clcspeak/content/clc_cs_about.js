Components.utils.import("resource://gre/modules/AddonManager.jsm");

function clc_cs_about_Load() {
  AddonManager.getAddonByID("{D1517460-5F8F-11DB-B0DE-0800200CA666}", function(addon) {
    document.getElementById('appName').value = addon.name;
    document.getElementById('versionNumber').value = document.getElementById('versionNumber').value + " " + addon.version;
  });
}