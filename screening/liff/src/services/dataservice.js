// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { getDatabase, set, ref, onValue, onChildAdded, onChildRemoved, connectDatabaseEmulator} from "firebase/database";
import { FB_PATH, lineBotPath } from "../config";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkBPiFrIJVSLHGPjpSt-zZuhEDT4wHSNw",
  authDomain: "screener-de5c7.firebaseapp.com",
  databaseURL: "https://screener-de5c7-default-rtdb.firebaseio.com",
  projectId: "screener-de5c7",
  storageBucket: "screener-de5c7.appspot.com",
  messagingSenderId: "709877977134",
  appId: "1:709877977134:web:4c65b032e67e704f23cfbf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const functions = getFunctions(app);
const db = getDatabase(app);
if (window.location.hostname.includes('localhost')) {
    console.log('running on localhost');
    connectFunctionsEmulator(functions, "localhost", 5001); // 
    connectDatabaseEmulator(db, 'localhost', 9000)    
}
const questions = httpsCallable(functions, 'api/questions', );
const upsertProfile = httpsCallable(functions, 'api/upsertProfile', );
// const monitorUserActivites = httpsCallable(functions, 'api/monitorUserActivites', );

  class DataService {

    getAvailableQuestions() {

        return new Promise((resolve, reject) => {
            questions()
            .then(q => {
                console.log(q);
                resolve(q.data)
            })

        })
    }

    upsertProfile(profile) {
        upsertProfile({profile: profile}).then(_ => {
        })
    }

    

    monitorUserActivites(callback) {
        const userActivities = ref(db, [lineBotPath, FB_PATH.weblog, FB_PATH.activities].join("/"));                        
            return onChildAdded(userActivities, (snapshot) => {
                // console.log(snapshot);
                const newChild = snapshot.val();
                // console.log(newChild);
                callback(snapshot.key, newChild)
            })

        // return new Promise((resolve, _) => {
        //     const userActivities = ref(db, [lineBotPath, FB_PATH.weblog, FB_PATH.activities].join("/"));                        
        //     resolve(onChildAdded(userActivities, (snapshot) => {
        //         // console.log(snapshot);
        //         const newChild = snapshot.val();
        //         // console.log(newChild);
        //         callback(snapshot.key, newChild)
        //     }))
        // // onChildAdded(userActivities, (snapshot) => {
        // //     console.log(snapshot);
        // //     const activities = snapshot.val();
        // //     console.log(activities);
        // // });
        // // onChildRemoved(userActivities, (snapshot) => {
        // //     console.log(snapshot);
        // //     const activities = snapshot.val();
        // //     console.log(activities);
        // // });
        // })
    }

    monitorUserTestResults(callback) {
        const userActivities = ref(db, [lineBotPath, FB_PATH.weblog, FB_PATH.testResult].join("/"));                        
        return onChildAdded(userActivities, (snapshot) => {
            // console.log(snapshot);
            const newChild = snapshot.val();
            // console.log(newChild);
            callback(snapshot.key, newChild)
        })

    }
}
export default DataService