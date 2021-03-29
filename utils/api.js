import firebase from "firebase";

var config = {
  apiKey: "AIzaSyD7EXzop6tWkkUAlrWv14v_tRgDtfjGxBk",
  authDomain: "chattapp-585a6.firebaseapp.com",
  projectId: "chattapp-585a6",
  storageBucket: "chattapp-585a6.appspot.com",
  messagingSenderId: "326560915031",
  appId: "1:326560915031:web:74ea5886913dbf96f94d12",
};
// Initialize Firebase
firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage, firebase };
