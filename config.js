import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyDyZOi6AwySsvrNBQWFagJZ_PQ5g7DLsoc",
    authDomain: "myapp-fb408.firebaseapp.com",
    projectId: "myapp-fb408",
    storageBucket: "myapp-fb408.appspot.com",
    messagingSenderId: "285401700592",
    appId: "1:285401700592:web:d4e1b88d90494eb61d4a35"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();