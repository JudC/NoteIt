/**
 * for debugging using console log
 *
 * @type       {boolean}
 */

 var tabURL;

 var getURL = function(){
    chrome.tabs.query({'active': true, 'currentWindow':true}, function(tab){
        if (tab[0]){
            tabURL = tab[0].url;
            console.log('url retrieved:' + tabURL);
        } else {
            document.body.innerHTML = "URL undefined"
        }
    });
}


/**
 * Sets the textarea to editable
 */
 var setEditable = function() {
    var notes =  document.getElementById('notes');
    notes.readOnly = false;
    notes.style.backgroundColor = "white";
}

/**
 * Sets the textarea to uneditable
 */
 var setUneditable = function(){
    var notes = document.getElementById('notes');
    notes.readOnly = true;
}

/**
 * When textarea loses focus, set it to uneditable
 */
 var listenForFocus = function(){
    var notes = document.getElementById('notes');

    notes.onblur = function () {
     console.log('blurred');
     saveFunction();
     setUneditable();
 }
 notes.onclick = function() {
    setEditable();
}
}

/**
 * Saves value inside textarea to chrome storage
 */
 var saveFunction = function(){
    var value = document.getElementById('notes').value;
    if (!value){
        console.log('nothing to save');
        return;
    }
    chrome.storage.sync.set({[tabURL]: value}, function(){
        notes.style.backgroundColor = "lightyellow";
        console.log('the value stored was:' + tabURL + ',' + value);
    });
}


var listenForButton = function(){
    var deletes = document.getElementById('delete');

    deletes.onclick = function(){
        chrome.storage.sync.remove(tabURL,function(){
            document.getElementById('notes').value = "";
            setEditable();
            console.log('deleted value for key:' + tabURL);
        });
    }
}

var loadFunction = function(){
    chrome.storage.sync.get(tabURL,function(items){
        console.log('retrieved value was:' + tabURL + ',' + items[tabURL]);
        if (!items[tabURL]){
            console.log('nothing to retrieve for key ' + tabURL);
            return;
        }
        document.getElementById('notes').value = items[tabURL];
        setUneditable();
    });
}



var listenForLoad = function() {
    addEventListener('load', function(event){
       loadFunction();
   }, true);
}


/*var listenForChange = function (){
    chrome.storage.onChanged.addListener(function(changes, sync) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
          'Old value was "%s", new value is "%s".',
          key,
          sync,
          storageChange.oldValue,
          storageChange.newValue);
      saveFunction(key);
  });
}*/

document.addEventListener('DOMContentLoaded', function () {
    getURL();
    listenForButton();
    listenForFocus();
    listenForLoad();
   // chrome.storage.sync.clear(function(){});
   chrome.storage.sync.get(null, function(items) {
    console.log(items);
});
});
