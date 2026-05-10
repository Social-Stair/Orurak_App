import { initializeApp } from "firebase/app";

// import { getAnalytics } from "firebase/analytics"; 

const firebaseConfig = {
  apiKey: "AIzaSyDxFHxmCjh1EczQ1KfyJJhpd2g4n2_lCHY",
  authDomain: "social-stair.firebaseapp.com",
  projectId: "social-stair",
  storageBucket: "social-stair.firebasestorage.app",
  messagingSenderId: "375980971493",
  appId: "1:375980971493:web:24ec87b0b4816798b2cb0c",
  measurementId: "G-CKC68J4J1X"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;