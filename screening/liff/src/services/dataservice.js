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
const getStat = httpsCallable(functions, 'api/getStat', );
const getStatCorrAge = httpsCallable(functions, 'api/getStatCorr/q2/age', );
const getStatCorrGrade = httpsCallable(functions, 'api/getStatCorr/q2/avggrade', );
const getStatCorrGender = httpsCallable(functions, 'api/getStatCorr/q2/gender', );
const getStatCorrAgeQ3 = httpsCallable(functions, 'api/getStatCorr/q3/age', );
const getStatCorrGradeQ3 = httpsCallable(functions, 'api/getStatCorr/q3/avggrade', );
const getStatCorrGenderQ3 = httpsCallable(functions, 'api/getStatCorr/q3/gender', );
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

    getStat() {

        console.log('ds getting stat');
        
        return new Promise((resolve, reject) => {
            getStat()
            .then(stat => {
                console.log(stat);
                resolve(stat.data)
            })

        })

    }

    getCoor(field) {

        console.log('ds getting corr data');
        
        return new Promise((resolve, reject) => {
            let func = field === 'age' ? getStatCorrAge : (field === 'gender' ? getStatCorrGender :  getStatCorrGrade)
            func()
            .then(corrData => {
                console.log(corrData);
                resolve(corrData.data)
            })

        })
    }
    
    getCoorQ3(field) {

        console.log('ds getting corr data');
        
        return new Promise((resolve, reject) => {
            let func = field === 'age' ? getStatCorrAgeQ3 : (field === 'gender' ? getStatCorrGenderQ3 :  getStatCorrGradeQ3)
            func()
            .then(corrData => {
                console.log(corrData);
                resolve(corrData.data)
            })

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