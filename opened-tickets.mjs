//Firbase
//https://www.youtube.com/watch?v=rQvOAnNvcNQ&t=288s
//npm init; install parcel; npm i firebase; npm install -g firebase-tools

//Imports
import {initializeApp } from 'firebase/app';
import {getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import {getFirestore, getDocs, collection, query, where } from 'firebase/firestore';

const firebaseConfigBlank = {
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
        getOpenedTicketsList()
    } else {
        console.log("not logged in yet");
        document.getElementById("login-button-span").style.display = "inline";        
        //signInWithRedirect(auth, provider);
    }
});


// Listeners and events
document.getElementById("login-button").addEventListener('click', loginApp);

//functions
async function getOpenedTicketsList(){
    
    //https://firebase.google.com/docs/firestore/manage-data/add-data
    //https://firebase.google.com/docs/firestore/query-data/queries
    
    const ticketTableBody = document.getElementById('ticket-table-body');
    const q = query(collection(db, "tickets"), where("ticketStatus", "==", "Opened"));
    const querySnapshot = await getDocs(q);

    for(let i = 0; i < querySnapshot.docs.length; i++){
        
        const seconds = querySnapshot.docs[i].data().created.seconds;        
        const createdDate = new Date(seconds * 1000)

        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        const anchor = document.createElement('a');

        anchor.href = "/ticket.html?ticket=" +  querySnapshot.docs[i].id;
        anchor.innerText = querySnapshot.docs[i].id;

        td2.innerText = createdDate.toLocaleDateString();
        td3.innerText = querySnapshot.docs[i].data().email;
        td4.innerText = querySnapshot.docs[i].data().docType;

        td1.appendChild(anchor);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        ticketTableBody.appendChild(tr);

    }

}

function loginApp(){
    signInWithRedirect(auth, provider)
}
