const staticCache = "Static-cache-v36";
const dynamicCache = "Dynamic-cache-v36";

const assets = [
  "/",
  "/index.html",
  "/pages/fallback.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/materialize.min.css",
  "/css/app.css",
  "/img/ftl-logo.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons"
];

// Cache SIZE LIMIT

const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener("install", function (event) {
  //fires when the browser install the app
  //here we're just logging the event and the contents of the object passed to the event.
  //the purpose of this event is to give the service worker a place to setup the local
  //environment after the installation completes.
  console.log(`Serv.Worker: Event fired: ${event.type}`);
  event.waitUntil(
    caches.open(staticCache).then(function (cache) {
      console.log("Serv.Worker: Precaching App shell");
      cache.addAll(assets);
      console.log("Serv.Worker: Precaching App shell Finished");
    })
  );
});

self.addEventListener("activate", function (event) {
  //fires after the service worker completes its installation.
  // It's a place for the service worker to clean up from
  // previous service worker versions.
  // console.log(`Serv.Worker: Event fired: ${event.type}`);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          // .filter((key) => key !== staticCache)
          .filter((key) => key !== staticCache && key !== dynamicCache)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", function (event) {
  //fires whenever the app requests a resource (file or data)
  // console.log(`Serv.Worker: Fetching ${event.request.url}`);
  //next, go get the requested resource from the network

  // IF URL CONTAINS "firestore.googleapis.com" DON'T EXECUTE CODE
  if (event.request.url.indexOf("firestore.googleapis.com") === -1) {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          return (
            response ||
            fetch(event.request).then((fetchResult) => {
              return caches.open(dynamicCache).then((cache) => {
                cache.put(event.request.url, fetchResult.clone());
                limitCacheSize(dynamicCache, 18); // cache.put(key, value)  = REQUEST IS THE "KEY", RESPONNSE IS THE "VALUE"
                // E.g. = cache.put(event.request.url, fetchResult.clone())
                return fetchResult;
              });
            })
          );
        })
        .catch(() => caches.match("/pages/fallback.html"))
    );
  }
});

// ------------------------------------------------------------------------------------------------------- ONLINE//OFFLINE TEST

// Test this by running the code snippet below and then
// use the "Offline" checkbox in DevTools Network panel

// window.addEventListener('online', handleConnection);
// window.addEventListener('offline', handleConnection);

// function handleConnection() {
//   if (navigator.onLine) {
//     isReachable(getServerUrl()).then(function(online) {
//       if (online) {
//         // handle online status
//         console.log('online');
//       } else {
//         console.log('no connectivity');
//       }
//     });
//   } else {
//     // handle offline status
//     console.log('offline');
//   }
// }

// function isReachable(url) {
//   /**
//    * Note: fetch() still "succeeds" for 404s on subdirectories,
//    * which is ok when only testing for domain reachability.
//    *
//    * Example:
//    *   https://google.com/noexist does not throw
//    *   https://noexist.com/noexist does throw
//    */
//   return fetch(url, { method: 'HEAD', mode: 'no-cors' })
//     .then(function(resp) {
//       return resp && (resp.ok || resp.type === 'opaque');
//     })
//     .catch(function(err) {
//       console.warn('[conn test failure]:', err);
//     });
// }

// function getServerUrl() {
//   return document.getElementById('serverUrl').value || window.location.origin;
// }
