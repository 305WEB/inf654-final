import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";

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
const auth = getAuth(app);
// const userName = auth.currentUser;

// const db = getFirestore(app);

//----------------------------------------



// SIGN UP
const signupForm = document.querySelector("#signup-form");

//-------------
signupForm.addEventListener("submit", (e) => {

    e.preventDefault();
    // GET USER INFO
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;

    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {

        // SIGN IN
        const user = userCredential.user;
        console.log(user);
        // CLOSE MODAL
        const modal = document.querySelector("#modal-signup");
        var instance = M.Modal.getInstance(modal);
        instance.close();
        signupForm.reset();
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
});

//----------LOG OUT

const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {

    e.preventDefault();
    signOut(auth).then(() => {
        console.log("User has sign out");
        alert("User has Sign Out.");

           //-----------------------close modal

           var modal = document.querySelector(".side-menu");

           var instance = M.Sidenav.getInstance(modal);
           instance.close();

    }).catch((error) => {
        const eCode = error.code;
        const eMessage = error.message;
    })
})

//----------LOG in

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e)=> {
    e.preventDefault();
    
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {

             // SIGN IN
             const user = userCredential.user;
             console.log(user);
             // CLOSE MODAL
             const modal1 = document.querySelector("#modal-login");
             var instance1 = M.Modal.getInstance(modal1);
             instance1.close();

             
           var modal2 = document.querySelector(".side-menu");

           var instance2 = M.Sidenav.getInstance(modal2);
           instance2.close();

             signupForm.reset();
         })
         .catch((error) => {
             const errorCode = error.code;
             const errorMessage = error.message;
         });

 
})



//----------ACCOUNT DETAILS

const accounDetails = document.querySelector("#flg-user-account");
accounDetails.addEventListener("click",  function () {


const auth = getAuth();
const user = auth.currentUser;

if (user !== null) {

    // FOR EACH TO ITERATE THROUGH USER PROPERTIES
  user.providerData.forEach((profile) => {

    const provider = "  Sign-in provider: " + profile.providerId;
    let providerCont = document.querySelector("#modal-account > div > div > h6 > span.flg-user-sign");
    providerCont.textContent = provider;

    // -------------------------
    const providerID = "  Provider-specific UID: " + profile.uid;
    let idCont = document.querySelector("#modal-account > div > div > h6 > span.flg-user-id");
    idCont.textContent = providerID;

    // -----------------------

    const email = "  Email: " + profile.email;
    let emailCont = document.querySelector("#modal-account > div > div > h6 > span.flg-user-email");
    emailCont.textContent = email;


    // console.log("  Photo URL: " + profile.photoURL);
       // console.log("  Name: " + profile.displayName);
})


}});

   const accountDetailSection = document.querySelector(".btn-account")
   accountDetailSection.addEventListener("click", function() {

          // CLOSE MODAL
          const modal1 = document.querySelector("#modal-account");
          var instance = M.Modal.getInstance(modal1);
          instance.close();

   //-----------------------close side menu modal

           var modal = document.querySelector(".side-menu");
           var instance = M.Sidenav.getInstance(modal);
           instance.close();

   });
   
    

