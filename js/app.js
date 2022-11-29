//does the browser support service workers?

if ("serviceWorker" in navigator) {
  // defer service worker installation until page completes loading
  window.addEventListener("load", () => {
    //then register our service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        //display a success message
        console.log(`Service Worker Registration (Scope: ${reg.scope})`);
      })
      .catch((error) => {
        //display an error message
        console.log(`Service Worker Error (${error})`);
      });
  });
} else {
  //happens when the app isn't served over a TLS connection (HTTPS)
  // or if the browser doesn't support the service worker
  console.log("Service Worker not available");
}


//  NOTIFICATIONS ------------------------------------------------------------------------------------------------------

// NOTIF BUTTON
const notificationBtn = document.getElementById('enable');

const topNotificationArea = document.getElementById('top-notification-area');
 // Create a reference to the notifications list in the bottom of the app; we will write database messages into this list by
  // appending list items as children of this element
const note = document.getElementById('notifications');

// --------------------------------------------------COMMENTED OUT TO TEST NOTIFICATIONS ------------------------------------------------------

  // Do an initial check to see what the notification permission state is
  // if (Notification.permission === 'denied' || Notification.permission === 'default') {
  //   notificationBtn.style.display = 'block';
  // } else {
  //   notificationBtn.style.display = 'none';
  //   topNotificationArea.style.display = 'none';
  // }

    // Wire up notification permission functionality to 'Enable notifications' button
    notificationBtn.addEventListener('click', askNotificationPermission);
    

   // Ask for permission when the 'Enable notifications' button is clicked
   function askNotificationPermission() {
    // Function to actually ask the permissions
    function handlePermission(permission) {
      // Whatever the user answers, we make sure Chrome stores the information
      if (!Reflect.has(Notification, 'permission')) {
        Notification.permission = permission;
      }

      // Set the button to shown or hidden, depending on what the user answers
      if (Notification.permission === 'denied' || Notification.permission === 'default') {
        notificationBtn.style.display = 'block';
      } else {
        notificationBtn.style.display = 'none';
        topNotificationArea.style.display = 'none';

        setInterval(createNotification("Check Your Emergency Supply List"), 1500); //----------------------------------------------------
      }
    };


    // Check if the browser supports notifications
    if (!Reflect.has(window, 'Notification')) {
      console.log('This browser does not support notifications.');
    } else {
      if (checkNotificationPromise()) {
        Notification.requestPermission().then(handlePermission);
      } else {
        Notification.requestPermission(handlePermission);
      }
    }
  };

  // Check whether browser supports the promise version of requestPermission()
  // Safari only supports the old callback-based version
  function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch(e) {
      return false;
    }

    return true;
  };



  function createListItem(contents) {
    const listItem = document.createElement('li');
    listItem.textContent = contents;
    return listItem;
  };

  // Create a notification with the given title
  function createNotification(title) {
    // Create and show the notification
    const img = '/img/icons/icon-128x128.png';
    const text = `HEY! Your task "${title}" is now overdue.`;
    const notification = new Notification('To do list', { body: text, icon: img });

    // We need to update the value of notified to 'yes' in this particular data object, so the
    // notification won't be set off on it again

    // First open up a transaction
    const objectStore = db.transaction(['toDoList'], 'readwrite').objectStore('toDoList');

    // Get the to-do list object that has this title as its title
    const objectStoreTitleRequest = objectStore.get(title);

    objectStoreTitleRequest.onsuccess = () => {
      // Grab the data object returned as the result
      const data = objectStoreTitleRequest.result;

      // Update the notified value in the object to 'yes'
      data.notified = 'yes';

      // Create another request that inserts the item back into the database
      const updateTitleRequest = objectStore.put(data);

      // When this new request succeeds, run the displayData() function again to update the display
      updateTitleRequest.onsuccess = () => {
        displayData();
      };
    };
  };





