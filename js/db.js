import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";

// FIRESTORE DB
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  enableIndexedDbPersistence,  // OFFLINE DATA PERSISTENCE
} from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

// AUTH
import {getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";

// Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyCgjNBRxzcTmBUBEHzrvtYWs-0KgFbkiFA",
    authDomain: "listitems-834f4.firebaseapp.com",
    projectId: "listitems-834f4",
    storageBucket: "listitems-834f4.appspot.com",
    messagingSenderId: "734011126618",
    appId: "1:734011126618:web:c82a347a6586fd6a7cb963"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);

let userCheck = false;

//----------------------------------------

async function getTasks(db) {
  const tasksCol = collection(db, "tasks");
  const taskSnapshot = await getDocs(tasksCol);
  const taskList = taskSnapshot.docs.map((doc) => doc);
  return taskList;
}

// ------------------OFF LINE DATA ---() WILL LET YOU ADD ITEMS TO DB WHEN OFFLINE)

enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          console.log("Persistence failed");
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          console.log("Persistence is not valid");
      }
  });


// CHECKS FOR CHANGES

const unsub = onSnapshot(collection(db, "tasks"), (doc) => {
  //   console.log(doc.docChanges());
  doc.docChanges().forEach((change) => {
    // console.log(change, change.doc.data(), change.doc.id);
    if (change.type === "added") {
      //Call render function in UI
      renderTask(change.doc.data(), change.doc.id);
    }
    if (change.type === "removed") {
      //do something
      removeTask(change.doc.id);
    }
  });
});



// LISTEN FOR AUTH STATUS CHANGES -- adds doc

onAuthStateChanged(auth, (user) => {
  if (user) {
      console.log("User logged in: ", user.email);
      // alert("User logged in: ", user.email);

      userCheck = true;

      // getTasks() is in db.js
      getTasks(db).then((snapshot) => {

           // setupTasks() is in ui.js
          setupTasks(snapshot);
      });

      // setUpUI() is in ui.js
      setUpUI(user);

      const form = document.querySelector("form");
      form.addEventListener("submit", (event) => {

          event.preventDefault();

          //-----------------------close modal

          var modal3 = document.querySelector(".side-form");

          var instance3 = M.Sidenav.getInstance(modal3);
          instance3.close();

          addDoc(collection(db, "tasks"), {
              title: form.title.value,
              description: form.description.value,
            }).catch((error) => console.log(error));
            form.title.value = "";
            form.description.value = "";
        
      });

      
 

     
  } else {
      console.log("User logged out");
      // alert("User logged out");
      userCheck = false;

      // ----------------------
      setUpUI();
      setupTasks([]);

  }
});

//DELETE TASK ITEM
const taskContainer = document.querySelector(".tasks");
taskContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "I") {
    const id = event.target.getAttribute("data-id");

    // CHECK IF USER IS LOGGED
  if (!userCheck) {
    alert("You can only delete items you have created. Please Create an Account or login.")
  }
  else {
    deleteDoc(doc(db, "tasks", id));
  }
  }
});

//ADD NEW TASK ITEM (WHEN USER IS NOT LOGGED IN)
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();


  // CHECK IF USER IS LOGGED
  if (!userCheck) {

     //-----------------------close modal

    var modal = document.querySelector(".side-form");

    var instance = M.Sidenav.getInstance(modal);
    instance.close();

    alert("Please use side Menu to Login, or creeate an Account before you can add items.");

  
  }
//   else {
//   addDoc(collection(db, "tasks"), {
//     title: form.title.value,
//     description: form.description.value,
//   }).catch((error) => console.log(error));
//   form.title.value = "";
//   form.description.value = "";
// }
});