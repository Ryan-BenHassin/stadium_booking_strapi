import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFbb9ltqPbKaJhLOiHhfrr0uA_DWaZI_Y",
  authDomain: "designet-e6df1.firebaseapp.com",
  projectId: "designet-e6df1",
  storageBucket: "designet-e6df1.firebasestorage.app",
  messagingSenderId: "845218933502",
  appId: "1:845218933502:web:29bdee699150eb668553af",
  measurementId: "G-F7X5X7XK7P"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
