//CLC-4-TTS Firefox Extension
//Core Library Components for Text-To-Speech for Firefox
//Additional Utility Functions: Mutation Events System
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
 

//Last Modified Date 10/06/2007

//------------------------------------------
//
// Usage:
//
// 1. Call CLC_InitMutationEventsSystem(DOMObj_targ, optionsArray) 
//    with  DOMObj_targ being the object to watch for mutation 
//    events on and optionsArray being an array of options. 
//    Valid options: 
//       optionArray[0] == If "1", "off" events will not be 
//                         put into the event queue.
//    Note that child objects of DOMObj_targ 
//    will automatically be watched. Calling it on the 
//    main document ("CLC_Window().document") will watch 
//    everything. Only one DOM object can be set as
//    the object to watch; subsequent calls to this
//    function will change the target.
//
// 2. It is up to the user to check for events.
//    Checking regularly is important since there is a 
//    1000 event limit on the total number of events that 
//    will be stored; once that limit is reached, the oldest 
//    events will be dropped to make room for new events.
//    The user can call CLC_GetEventCountsAssociativeArray()
//    to check on how many events of each politeness level
//    there are in the queue. The user can call
//    CLC_GetMutationEvent() to get the earliest mutation 
//    event; this will also remove the event from the queue
//    and cause the event counts to be updated.
//    The user can also use CLC_PeekMutationEvent() which is
//    the same as CLC_GetMutationEvent() except the event will
//    NOT be removed from the queue (and so, event counts will
//    also not change).
// 
//
//------------------------------------------
var CLC_MutationEventsQueue;
var CLC_OffEventCount;
var CLC_PoliteEventCount;
var CLC_AssertiveEventCount;
var CLC_RudeEventCount;
var CLC_UnknownEventCount;

var CLC_MutationNotificationsQueue;
var CLC_OffNotificationCount;
var CLC_PoliteNotificationCount;
var CLC_AssertiveNotificationCount;
var CLC_RudeNotificationCount;


var CLC_MutationEventsWaitingTime = 10;
var CLC_MaxRawEventsCacheable = 100;
var CLC_MutationEventsLimit = 100; //Past this limit, the oldest event will automatically be removed.
var CLC_IgnoreOffEvents = false;
var CLC_UseTableCellHeuristics = false;

var CLC_RawMutationEventsBuffer;
var CLC_MutationProcessingBuffer;

var CLC_RecentlyReceivedEventsCounter;

var CLC_CurrentlyProcessingRawMutationEvents = false;

var CLC_MutationObserver;


//------------------------------------------

function CLC_RawMutationEventObj(){
   this.target = "";                    //The element that generated the event
   this.parentNode = "";                //The parent of the target element; 
                                        //this needs to be captured at the time of the 
                                        //event since it can be lost later on if the 
                                        //target node is mutated again.
   this.closestAtomicLiveRegion = "";   //The closest live region to the event.
   this.type = "";                      //"insertion" or "removal"
   this.text = "";                      //Text content of the event target
   this.politeness = "";                //Politeness setting at the time of the event
   this.atomic = false;                 //Boolean - whether it is atomic or not
   this.atomicText = "";                //Text content of the closest atomic live region, if the event is atomic
   this.relevant = "";                  //Can be any combination of "additions", "removals", 
                                        //and "text". The value "all" specifies everything.
                                        //These values are separated by a space.
   this.notify = false;                 //If true, this event is a notification and goes into
                                        //a separate queue.
   }
//------------------------------------------


function CLC_MutationEventObj(){
   this.target = "";                     //The element that generated the event
   this.parentNode = "";                 //The parent of the target element; 
                                         //this needs to be captured at the time of the 
                                         //event since it can be lost later on if the 
                                         //target node is mutated again.
   this.closestAtomicLiveRegion = "";    //The closest live region to the event.
   this.type = "";                       //"change", "insertion", or "removal"
   this.preText = "";                    //Text content right before the event
   this.postText = "";                   //Text content right after the event 
   this.politeness = "";                 //Politeness setting at the time of the event
   this.atomic = false;                  //Boolean - whether it is atomic or not
   this.atomicText = "";                 //Text content of the closest atomic live region, if the event is atomic
   this.relevant = "";                   //Can be any combination of "additions", "removals", 
                                         //and "text". The value "all" specifies everything.
                                         //These values are separated by a space.
   this.interim = false;                 //This is inside relevant, but it is represented 
                                         //directly for easier access.
   this.timestamp = 0;                   //Time when the event was added to the queue
   }
//------------------------------------------
//Clears out all the mutation events
//
function CLC_ClearMutationEvents() {
   CLC_RawMutationEventsBuffer = new Array();
   CLC_MutationProcessingBuffer = new Array();
   CLC_MutationEventsQueue = new Array();
   CLC_MutationNotificationsQueue = new Array();
   CLC_RecentlyReceivedEventsCounter = 0;

   CLC_UnknownEventCount = 0;
   CLC_OffEventCount = 0;
   CLC_PoliteEventCount = 0;
   CLC_AssertiveEventCount = 0;
   CLC_RudeEventCount = 0;

   CLC_OffNotificationCount = 0;
   CLC_PoliteNotificationCount = 0;
   CLC_AssertiveNotificationCount = 0;
   CLC_RudeNotificationCount = 0;

   if (CLC_MutationObserver !== 'undefined' && CLC_MutationObserver !== null) {
     CLC_MutationObserver.disconnect();
   }

   CLC_MutationObserver = null;
}

//------------------------------------------
//Initialize the mutation event system to watch a specific DOM object.
//This object can be the entire document if you want to watch everything.
//
function CLC_InitMutationEventsSystem(DOMObj_targ, optionsArray){
   CLC_IgnoreOffEvents = false;
   CLC_UseTableCellHeuristics = false;
   try{
      if (optionsArray){
         if (optionsArray.length > 0){
            if (optionsArray[0] == 1){
               CLC_IgnoreOffEvents = true;
               }
            }
         if (optionsArray.length > 1){
            if (optionsArray[1] == 1){
               CLC_UseTableCellHeuristics = true;
               }
            }
         }
      }
   catch(e){
      }
   CLC_ClearMutationEvents();
   CLC_CurrentlyProcessingRawMutationEvents = false;

   CLC_MutationObserver = new window.MutationObserver(CLC_MutationPreHandler);
   CLC_MutationObserver.observe(DOMObj_targ, { childList: true, characterData: true });
}
//------------------------------------------

function CLC_MutationPreHandler(mutations) {
  mutations.forEach(function(mutation) {
    switch (characterData) {
      case "childList":
        var i;

        for (i = 0; i < mutation.addedNodes.length; i++) {
          CLC_MutationHandler(mutation.addedNodes[i], "insertion");
        }

        for (i = 0; i < mutation.removedNodes.length; i++) {
          CLC_MutationHandler(mutation.removedNodes[i], "removal");
        }

        break;

      case "characterData":
        CLC_MutationHandler(mutation.target, "change");
        break;

      default:
        break;
    }
  });
}



//------------------------------------------


function CLC_MutationHandler(target,theType){
   var currentEventObj = new CLC_RawMutationEventObj();
   currentEventObj.target = target;
   currentEventObj.parentNode = target.parentNode;
   currentEventObj.closestAtomicLiveRegion = CLC_GetClosestAtomicLiveRegion(currentEventObj.target);
   currentEventObj.type = theType;
   currentEventObj.text = CLC_GetTextContent(target);

   if (!currentEventObj.text) {
      return;
   }

   var isBusy = CLC_GetClosestNSAttributeOf(target, "http://www.w3.org/2005/07/aaa", "busy");

   if (!isBusy) {
      isBusy = CLC_GetClosestAttributeOf(target, "aria-busy");
   }

   if (isBusy && isBusy.toLowerCase && (isBusy.toLowerCase() == "true")){
      return;
   }

   currentEventObj.politeness = CLC_GetClosestNSAttributeOf(target, "http://www.w3.org/2005/07/aaa", "live");

   if (!currentEventObj.politeness) {
      currentEventObj.politeness = CLC_GetClosestAttributeOf(target, "aria-live");
   }

   if (!currentEventObj.politeness && CLC_GetClosestAncestorWithRole(target, "alert")) {
      currentEventObj.politeness = "rude";
   }

   var isAtomic = CLC_GetClosestNSAttributeOf(target, "http://www.w3.org/2005/07/aaa", "atomic");

   if (!isAtomic) {
      isAtomic = CLC_GetClosestAttributeOf(target, "aria-atomic");
   }

   if (isAtomic && isAtomic.toLowerCase && (isAtomic.toLowerCase() == "true")) {
      currentEventObj.atomic = true;
   } else {
      currentEventObj.atomic = false;
   }

   currentEventObj.relevant = CLC_GetClosestNSAttributeOf(target, "http://www.w3.org/2005/07/aaa", "relevant");

   if (!currentEventObj.relevant) {
      currentEventObj.relevant = CLC_GetClosestAttributeOf(target, "aria-relevant");
   }

   if (currentEventObj.atomic) {
      var targObj = target;

      while (targObj){
         if (targObj.hasAttributeNS && targObj.hasAttributeNS("http://www.w3.org/2005/07/aaa", "atomic")) {
            this.atomicText = CLC_GetTextContent(targObj);
            break;
         }

         if (targObj.hasAttribute && targObj.hasAttribute("aria-atomic")) {
            this.atomicText = CLC_GetTextContent(targObj);
            break;
         }

         targObj = targObj.parentNode;
      }
   }

   var isNotification = CLC_GetClosestNSAttributeOf(target, "http://www.w3.org/2005/07/aaa", "channel");

   if (!isNotification){
      isNotification = CLC_GetClosestAttributeOf(target, "aria-channel");
   }

   if (isNotification && isNotification.toLowerCase && (isNotification.toLowerCase() == "notify")) {
      currentEventObj.notify = true;
   } else {
      currentEventObj.notify = false;
   }

   CLC_RawMutationEventsBuffer.push(currentEventObj);
   CLC_RecentlyReceivedEventsCounter++;
   window.setTimeout(function(){CLC_RawMutationEventsProcessor();}, CLC_MutationEventsWaitingTime);
}
//------------------------------------------

function CLC_RawMutationEventsProcessor(){
   //Put off doing any more processing until the current processing task is done.
   if (CLC_CurrentlyProcessingRawMutationEvents) {
      window.setTimeout(function(){CLC_RawMutationEventsProcessor();}, CLC_MutationEventsWaitingTime);
      return;
   }

   CLC_RecentlyReceivedEventsCounter--;

   //Don't do any processing until there is a pause in raw events;
   //however, ignore this if there are simply too many events.
   if ((CLC_RecentlyReceivedEventsCounter > 0) && (CLC_RecentlyReceivedEventsCounter < CLC_MaxRawEventsCacheable)) {
      return;
   }

   CLC_CurrentlyProcessingRawMutationEvents = true;

   //Make a deep copy of the raw mutation event buffer and 
   //then clear the raw mutation event buffer before starting
   //so that new raw mutation events can continue to be received.
   CLC_MutationProcessingBuffer = CLC_RawMutationEventsBuffer.slice(0);
   CLC_RawMutationEventsBuffer = new Array();
   var i = 0;

   while (i < CLC_MutationProcessingBuffer.length) {
      var currentEventObj = new CLC_MutationEventObj();

      //Handle "change" and "removal" types
      if (CLC_MutationProcessingBuffer[i].type == "removal") {
         //Detect if the "removal" is really a "change" - if so, there is really only ONE event here and not two.
         //Using nodeName == "#text" as a check is actually not 100% perfect,
         //but it seems to be the best way available as changing the text removes
         //the original text node and inserts a new text node and the removed text node
         //does not have a parent that can be compared to the inserted text node's parent.
         if (((i+1) < CLC_MutationProcessingBuffer.length) && 
              (CLC_MutationProcessingBuffer[i+1].type == "insertion") &&
              (CLC_MutationProcessingBuffer[i].target.nodeName == "#text") &&
              (CLC_MutationProcessingBuffer[i+1].target.nodeName == "#text")) {
            currentEventObj.target = CLC_MutationProcessingBuffer[i+1].target;
            currentEventObj.parentNode = CLC_MutationProcessingBuffer[i+1].parentNode;
            currentEventObj.closestAtomicLiveRegion = CLC_MutationProcessingBuffer[i+1].closestAtomicLiveRegion;
            currentEventObj.type = "change";  
            currentEventObj.preText = CLC_MutationProcessingBuffer[i].text;
            currentEventObj.postText = CLC_MutationProcessingBuffer[i+1].text;  
            currentEventObj.politeness = CLC_MutationProcessingBuffer[i+1].politeness;
            currentEventObj.atomic = CLC_MutationProcessingBuffer[i+1].atomic;
            currentEventObj.atomicText = CLC_MutationProcessingBuffer[i+1].atomicText;
            currentEventObj.relevant = CLC_MutationProcessingBuffer[i+1].relevant;

            if (currentEventObj.relevant.indexOf && (currentEventObj.relevant.indexOf("interim") != -1)) {
               currentEventObj.interim = true; 
            } else {
               currentEventObj.interim = false; 
            }

            i++;
         } else {
           //Was really just a "removal"
            currentEventObj.target = CLC_MutationProcessingBuffer[i].target;
            currentEventObj.parentNode = CLC_MutationProcessingBuffer[i].parentNode;
            currentEventObj.closestAtomicLiveRegion = CLC_MutationProcessingBuffer[i].closestAtomicLiveRegion;
            currentEventObj.type = "removal";  
            currentEventObj.preText = CLC_MutationProcessingBuffer[i].text;
            currentEventObj.postText = "";  
            currentEventObj.politeness = CLC_MutationProcessingBuffer[i].politeness;
            currentEventObj.atomic = CLC_MutationProcessingBuffer[i].atomic;
            currentEventObj.atomicText = CLC_MutationProcessingBuffer[i].atomicText;
            currentEventObj.relevant = CLC_MutationProcessingBuffer[i].relevant;

            if (currentEventObj.relevant.indexOf && (currentEventObj.relevant.indexOf("interim") != -1)) {
               currentEventObj.interim = true; 
            } else {
               currentEventObj.interim = false; 
            }
         }
      } else if(CLC_MutationProcessingBuffer[i].type == "insertion") {
         //Handle "insertion" type
         currentEventObj.target = CLC_MutationProcessingBuffer[i].target;
         currentEventObj.parentNode = CLC_MutationProcessingBuffer[i].parentNode;
         currentEventObj.closestAtomicLiveRegion = CLC_MutationProcessingBuffer[i].closestAtomicLiveRegion;
         currentEventObj.type = "insertion";  
         currentEventObj.preText = "";
         currentEventObj.postText = CLC_MutationProcessingBuffer[i].text;  
         currentEventObj.politeness = CLC_MutationProcessingBuffer[i].politeness;
         currentEventObj.atomic = CLC_MutationProcessingBuffer[i].atomic;
         currentEventObj.atomicText = CLC_MutationProcessingBuffer[i].atomicText;
         currentEventObj.relevant = CLC_MutationProcessingBuffer[i].relevant;

         if (currentEventObj.relevant.indexOf && (currentEventObj.relevant.indexOf("interim") != -1)) {
            currentEventObj.interim = true; 
         } else {
            currentEventObj.interim = false; 
         }
      } else if(CLC_MutationProcessingBuffer[i].type == "change") {
         //Handle "change" type
         currentEventObj.target = CLC_MutationProcessingBuffer[i].target;
         currentEventObj.parentNode = CLC_MutationProcessingBuffer[i].parentNode;
         currentEventObj.closestAtomicLiveRegion = CLC_MutationProcessingBuffer[i].closestAtomicLiveRegion;
         currentEventObj.type = "change";  
         currentEventObj.preText = "";
         currentEventObj.postText = CLC_MutationProcessingBuffer[i].text;  
         currentEventObj.politeness = CLC_MutationProcessingBuffer[i].politeness;
         currentEventObj.atomic = CLC_MutationProcessingBuffer[i].atomic;
         currentEventObj.atomicText = CLC_MutationProcessingBuffer[i].atomicText;
         currentEventObj.relevant = CLC_MutationProcessingBuffer[i].relevant;

         if (currentEventObj.relevant.indexOf && (currentEventObj.relevant.indexOf("interim") != -1)) {
            currentEventObj.interim = true; 
         } else {
            currentEventObj.interim = false; 
         }
      }
      //else{
      //   //Unknown mutation type, ignore it for now
      //}

      CLC_UpdateMutationEventPolitenessBasedOnRelevance(currentEventObj);

      if (CLC_MutationProcessingBuffer[i].notify) {
         CLC_AddProcessedMutationNotificationToQueue(currentEventObj);
      } else {
         CLC_AddProcessedMutationEventToQueue(currentEventObj);
      }

      i++;
   }

   CLC_CurrentlyProcessingRawMutationEvents = false;
}



//------------------------------------------
//

function CLC_UpdateMutationEventPolitenessBasedOnRelevance(theMutationEvent){
   if (!theMutationEvent.relevant){
      if (theMutationEvent.type == "removal"){
         theMutationEvent.politeness = "off";
         }
      return;
      }

   if ( theMutationEvent.relevant.indexOf && 
        (theMutationEvent.relevant.indexOf("removals") == -1) && 
        (theMutationEvent.relevant.indexOf("all") == -1)    ){
      if (theMutationEvent.type == "removal"){
         theMutationEvent.politeness = "off";
         }
      }

   if ( theMutationEvent.relevant.indexOf && 
        (theMutationEvent.relevant.indexOf("additions") == -1) && 
        (theMutationEvent.relevant.indexOf("all") == -1)    ){
      if (theMutationEvent.type == "insertion"){
         theMutationEvent.politeness = "off";
         }
      }

   if ( theMutationEvent.relevant.indexOf && 
        (theMutationEvent.relevant.indexOf("text") == -1) && 
        (theMutationEvent.relevant.indexOf("all") == -1)    ){
      if (theMutationEvent.type == "change"){
         theMutationEvent.politeness = "off";
         }
      }
   }

//------------------------------------------
//Add event to queue - updates the counters too
function CLC_AddProcessedMutationEventToQueue(theMutationEvent){
   //Do not add an event if nothing actually happened
   if (theMutationEvent.preText == theMutationEvent.postText){
      return;
      }
   //Update the counters for the various politeness levels
   if (theMutationEvent.politeness.toLowerCase && theMutationEvent.politeness.toLowerCase() == "rude"){
      theMutationEvent.politeness = "rude";
      CLC_RudeEventCount++;
      }
   else if (theMutationEvent.politeness.toLowerCase && theMutationEvent.politeness.toLowerCase() == "assertive"){
      theMutationEvent.politeness = "assertive";
      CLC_AssertiveEventCount++;
      }
   else if (theMutationEvent.politeness.toLowerCase && theMutationEvent.politeness.toLowerCase() == "polite"){
      theMutationEvent.politeness = "polite";
      CLC_PoliteEventCount++;
      }
   else if (theMutationEvent.politeness.toLowerCase && theMutationEvent.politeness.toLowerCase() == "off"){
      if(CLC_IgnoreOffEvents){
         return;
         }
      theMutationEvent.politeness = "off";
      CLC_OffEventCount++;
      }
   else{
      //Check to see if the web developer was relying on defaults.
      //if there is at least one WAI-ARIA property in the lineage of
      //the target, then the developer knows about WAI-ARIA and is using it;
      //therefore, obey WAI-ARIA strictly and treat no politeness as live="off".
      if (theMutationEvent.closestAtomicLiveRegion){
         theMutationEvent.politeness = "off";
         CLC_OffEventCount++;
         }
      //The web developer did not use WAI-ARIA; mark politeness as unknown 
      //and use best guess heuristics where appropriate.
      else{
         theMutationEvent.politeness = "unknown";
         CLC_UnknownEventCount++;
         //If this is an untagged table cell, use the heuristics if that option was specified
         if (CLC_UseTableCellHeuristics){
            var tempTDelement = CLC_GetClosestAncestorThatIs(theMutationEvent.target, "td");         
            if (tempTDelement && tempTDelement.textContent && (tempTDelement.textContent.length < 72)){
               theMutationEvent.atomic = true;
               theMutationEvent.closestAtomicLiveRegion = tempTDelement;
               }
            }
         }
      }

   var dateObj = new Date();
   theMutationEvent.timestamp = dateObj.getTime();

   //Add it to the event queue and move on
   CLC_MutationEventsQueue.push(theMutationEvent);
     
   //Throw away old events in the queue if the limit is exceeded
   while (CLC_MutationEventsQueue.length > CLC_MutationEventsLimit){
      CLC_GetMutationEvent();
      }
   }

//------------------------------------------
//Add event to queue - updates the counters too
function CLC_AddProcessedMutationNotificationToQueue(theMutationEvent){
   //Do not add an event if nothing actually happened
   if (theMutationEvent.preText == theMutationEvent.postText){
      return;
      }
   //Update the counters for the various politeness levels
   if (theMutationEvent.politeness.toLowerCase && theMutationEvent.politeness.toLowerCase() == "rude"){
      theMutationEvent.politeness = "rude";
      CLC_RudeNotificationCount++;
      }
   else if (theMutationEvent.politeness.toLowerCase && theMutationEvent.politeness.toLowerCase() == "assertive"){
      theMutationEvent.politeness = "assertive";
      CLC_AssertiveNotificationCount++;
      }
   else if (theMutationEvent.politeness.toLowerCase && theMutationEvent.politeness.toLowerCase() == "polite"){
      theMutationEvent.politeness = "polite";
      CLC_PoliteNotificationCount++;
      }
   else if (theMutationEvent.politeness.toLowerCase && theMutationEvent.politeness.toLowerCase() == "off"){
      if(CLC_IgnoreOffEvents){
         return;
         }
      theMutationEvent.politeness = "off";
      CLC_OffNotificationCount++;
      }
   else{
      //Do nothing - if it was notify, the author did know about WAI-ARIA
      //If this else block is reached, something has gone wrong and it should just return
      //without doing anything.
      return;
      }

   var dateObj = new Date();
   theMutationEvent.timestamp = dateObj.getTime();

   //Add it to the event queue and move on
   CLC_MutationNotificationsQueue.push(theMutationEvent);
     
   //Throw away old events in the queue if the limit is exceeded
   while (CLC_MutationNotificationsQueue.length > CLC_MutationEventsLimit){
      CLC_GetMutationNotification();
      }
   }

//------------------------------------------
//Returns an associative array that has the number
//of events of each politeness level in the queue.
function CLC_GetEventCountsAssociativeArray(){
   var eventCountsArray = new Array();
   eventCountsArray["unknown"] = CLC_UnknownEventCount;
   eventCountsArray["off"] = CLC_OffEventCount;
   eventCountsArray["polite"] = CLC_PoliteEventCount;
   eventCountsArray["assertive"] = CLC_AssertiveEventCount;
   eventCountsArray["rude"] = CLC_RudeEventCount;
   return eventCountsArray;
   }

//------------------------------------------
//Returns an associative array that has the number
//of notifications of each politeness level in the queue.
function CLC_GetNotificationCountsAssociativeArray(){
   var eventCountsArray = new Array();
   eventCountsArray["unknown"] = 0;
   eventCountsArray["off"] = CLC_OffNotificationCount;
   eventCountsArray["polite"] = CLC_PoliteNotificationCount;
   eventCountsArray["assertive"] = CLC_AssertiveNotificationCount;
   eventCountsArray["rude"] = CLC_RudeNotificationCount;
   return eventCountsArray;
   }


//------------------------------------------
//Returns the earliest mutation event in the queue.
//This will automatically remove the event from the 
//queue as well as update the event counts.
//Returns null if there is nothing.
function CLC_GetMutationEvent(){
   if (CLC_MutationEventsQueue.length < 1){
      return "";
      }
   if (CLC_MutationEventsQueue[0].politeness == "rude"){ CLC_RudeEventCount--;}
   else if (CLC_MutationEventsQueue[0].politeness == "assertive"){ CLC_AssertiveEventCount--;}
   else if (CLC_MutationEventsQueue[0].politeness == "polite"){ CLC_PoliteEventCount--;}
   else if (CLC_MutationEventsQueue[0].politeness == "off"){ CLC_OffEventCount--;}
   else { CLC_UnknownEventCount--;}
   return CLC_MutationEventsQueue.shift();
   }

//------------------------------------------
//Returns the earliest mutation event in the queue.
//This will automatically NOT remove the event from the 
//queue so it will also NOT update the event counts.
//Returns null if there is nothing.
function CLC_PeekMutationEvent(){
   if (CLC_MutationEventsQueue.length < 1){
      return "";
      }
   return CLC_MutationEventsQueue[0];
   }
   


//------------------------------------------
//Returns the earliest mutation notification in the queue.
//This will automatically remove the notification from the 
//queue as well as update the notification counts.
//Returns null if there is nothing.
function CLC_GetMutationNotification(){
   if (CLC_MutationNotificationsQueue.length < 1){
      return "";
      }
   if (CLC_MutationNotificationsQueue[0].politeness == "rude"){ CLC_RudeNotificationCount--;}
   else if (CLC_MutationNotificationsQueue[0].politeness == "assertive"){ CLC_AssertiveNotificationCount--;}
   else if (CLC_MutationNotificationsQueue[0].politeness == "polite"){ CLC_PoliteNotificationCount--;}
   else if (CLC_MutationNotificationsQueue[0].politeness == "off"){ CLC_OffNotificationCount--;}
   return CLC_MutationNotificationsQueue.shift();
   }

//------------------------------------------
//Returns the earliest notification event in the queue.
//This will automatically NOT remove the notification from the 
//queue so it will also NOT update the notification counts.
//Returns null if there is nothing.
function CLC_PeekMutationNotification(){
   if (CLC_MutationNotificationsQueue.length < 1){
      return "";
      }
   return CLC_MutationNotificationsQueue[0];
   }

//------------------------------------------
//Returns the closest atomic live region.

function CLC_GetClosestAtomicLiveRegion(targObj){
  var isAtomic = false;
  var atomicStr = CLC_GetClosestNSAttributeOf(targObj, "http://www.w3.org/2005/07/aaa", "atomic");
  if (!atomicStr){
     atomicStr = CLC_GetClosestAttributeOf(targObj, "aria-atomic");
     }
  if (atomicStr && atomicStr.toLowerCase && (atomicStr.toLowerCase() == "true")){
     isAtomic = true;
     }
  while (1){
    if (!targObj){
      return "";
      }

    //See if the target object has a WAI-ARIA live region attribute
    if (targObj.hasAttributeNS){
      //Get the live region with the atomic property if the event is atomic
      if (isAtomic){
        if (targObj.hasAttributeNS("http://www.w3.org/2005/07/aaa", "atomic")){
          return targObj;
          }
        }
      //Otherwise, just get the closest node with any live region property
      else if ( targObj.hasAttributeNS("http://www.w3.org/2005/07/aaa", "live")   || 
                targObj.hasAttributeNS("http://www.w3.org/2005/07/aaa", "atomic") || 
                targObj.hasAttributeNS("http://www.w3.org/2005/07/aaa", "relevant")  ){
        return targObj;
        }
      }

    //Redo the above if the author has simply written in aaa without using namespaces
    if (targObj.hasAttribute){
      //Get the live region with the atomic property if the event is atomic
      if (isAtomic){
        if (targObj.hasAttribute("aria-atomic")){
          return targObj;
          }
        }
      else if ( targObj.hasAttribute("aria-live")   || 
           targObj.hasAttribute("aria-atomic") || 
           targObj.hasAttribute("aria-relevant")  ){
        return targObj;
        }
      }

    targObj = targObj.parentNode;
    }

    return "";
  }

//------------------------------------------
//