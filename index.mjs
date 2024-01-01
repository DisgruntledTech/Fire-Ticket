//Firbase
//https://www.youtube.com/watch?v=rQvOAnNvcNQ&t=288s
//npm init; install parcel; npm i firebase; npm install -g firebase-tools

//Imports
import {initializeApp } from 'firebase/app';
import {getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import {getFirestore, doc, getDoc, updateDoc, arrayUnion, serverTimestamp, increment, collection, setDoc, addDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const db = getFirestore(firebaseApp);

onAuthStateChanged(auth, user => {
    if(user != null){
        document.getElementById("visitor-name").innerText = user.displayName + " be a member of the project by subscribing.";
        document.getElementById("firstname").value = user.displayName;
        document.getElementById("email").value = user.email;
        document.getElementById("displayName").innerText = "Hello " + user.displayName;        
    } else {
        console.log("not logged in yet");
        document.getElementById("login-button-span").style.display = "inline";
        //signInWithRedirect(auth, provider);
    }
});


// Listeners and events
document.getElementById("subscribe").addEventListener('click', validateForm);
document.getElementById("login-button").addEventListener('click', loginApp);
document.addEventListener('DOMContentLoaded',gitHubStatusDetails());


//functions

function validateForm() {
    const inputs = document.getElementsByTagName('input');
    const success = true;

    for(let i = 0; i < inputs.length; i++){

        inputs[i].ariaInvalid = "";
        
        if(inputs[i].required && inputs[i].value === ""){inputs[i].ariaInvalid = true; success = false;}
        
        if(inputs[i].type == "tel" && inputs[i].value != ""){
            let telNumber = inputs[i].value;                        
            telNumber = telNumber.replaceAll("-", "");
            telNumber = telNumber.replaceAll(".","");            
            telNumber = Number(telNumber);
            if(isNaN(telNumber) || (telNumber === 0)){inputs[i].ariaInvalid = true; success = false;}            
            
        }

        if(inputs[i].type == "email" && inputs[i].value != "" && inputs[i].value.includes("@") == false && inputs[i].value.includes(".") == false){inputs[i].ariaInvalid = true; success = false;}
        
        if(inputs[i].ariaInvalid === ""){inputs[i].ariaInvalid = false}
    }

    if (success){ submitForm()}
    
}

//https://firebase.google.com/docs/firestore/manage-data/add-data

function submitForm(){
    console.log("Submit Form");
    const firstName = document.getElementById("firstname").value;
    const email = document.getElementById("email").value;
        
    setDoc(doc(db, "subscribers", email), {
        accessRights: "ReadWrite",
        docType: "subscriber",
        created: serverTimestamp(),
        version: increment(1),
        lastUpdate: serverTimestamp(),
        firstName: firstName,
        email: email
    }).then(() =>{
        document.getElementById("add-status-message").innerText = "Thanks for subscribing!";
        document.getElementById("subscribe").hidden = true;
        console.log("worked");
    }).catch((e) =>{
        console.error("Error adding document: ", e);
    })
}

function gitHubStatusDetails(){
    //https://api.github.com/repos/DisgruntledTech/Fire-Ticket

    fetch('https://api.github.com/repos/DisgruntledTech/Fire-Ticket')
    .then(response => response.json())
    .then(entity => {
        const created = new Date(entity.created_at);
        const lastUpdated = new Date(entity.updated_at);
        const pushed = new Date(entity.pushed_at)

        document.getElementById('created').innerText = created.toLocaleDateString();
        document.getElementById('lastUpdated').innerText = lastUpdated.toLocaleDateString();
        document.getElementById('pushed').innerText = pushed.toLocaleDateString();
            }       
        );
}

function loginApp(){
    signInWithRedirect(auth, provider)
}
