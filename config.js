import * as firebase from 'firebase';
require('@firebase/firestore')
window.addEventListener = (x) => x;

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyB2QLnXbZA2Lq6rxMkglWJzv7idjzvk0pc",
    authDomain: "library-e28fd.firebaseapp.com",
    databaseURL: "https://library-e28fd.firebaseio.com",
    projectId: "library-e28fd",
    storageBucket: "library-e28fd.appspot.com",
    messagingSenderId: "388504828395",
    appId: "1:388504828395:web:2ff9a6fe204e219710c1ae"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();