const functions = require("firebase-functions");
const {WebhookClient} = require('dialogflow-fulfillment');
const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');
const random_name = require('node-random-name')
// Instantiates a intent client
const { IntentsClient } = require('@google-cloud/dialogflow');

// Instantiates a session client
const sessionClient = new dialogflow.SessionsClient();

const {
  FB_PATH,
  INTENTS,
  SESSIONCONTEXT,
  KEYS,
  matchLowerBound,
  notifierIds,
  userIds,
  RANKS,
  user_props,
  single_rank_units,
  UNITS,
  entityTypes,
  entityArrays,
  en_th_unit_mapping,
  end
} = require("./data/config");

//line bot sdk
const line = require('@line/bot-sdk');
// create LINE SDK config from env variables
const config = {
  channelAccessToken: "o2hNYyFaRgBrsO/5xboMEUBJh/V9HGlsUm/cp2LiVgfbMtNWikzAzc4MHOBhuaDYSyTd6yEzIUIACoS79vMiidjEzbL8jrgcr4wSj7PIrr2y5I/8GgHtFkScuNty7jvCkib2qEOBxa2nkNR2wZ7rTgdB04t89/1O/w1cDnyilFU=", //process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: "d59159ac543d2f8507d5ffe15e173633" //process.env.CHANNEL_SECRET,
};

// console.log(process.env);
// create LINE SDK client
const client = new line.Client(config);

//line notify
let notifySystemAdmin = require('line-notify-nodejs')(notifierIds.jjsystemadmin);
let notifyConsultants = require('line-notify-nodejs')(notifierIds.jjconsultants);

const admin = require('firebase-admin');
const saCredentials = require('./screener-de5c7-firebase-adminsdk-os01t-bb5dc85158.json')
const express = require('express');
const cors = require('cors');
const os = require('os');
const luxon = require("luxon")
luxon.Settings.defaultLocale = 'th';
luxon.Settings.defaultOutputCalendar = 'buddhist';
const DateTime = luxon.DateTime

//firebase project setting
const PROJECT_ID = saCredentials.project_id
const { chip, postbackFilledIn } = require("./payloads/payloads");
const Payload = require("./payloads/payloads");
const DataService = require("./services/dataservice");
const Screening = require("./payloads/screening");
const Questions = require("./model/questions");
const { KEY } = require("./constants");
const firebaseLocal = os.hostname() != 'localhost'; // it's localhost on Firebase
console.log(`probably recheck if os.hostname() != 'localhost' (${os.hostname()}) and webhook URL https://7ee7-27-55-92-106.ap.ngrok.io/screener-de5c7/us-central1/api/fulfullments or https://us-central1-research-thai-rtaf.cloudfunctions.net/api/fulfullments`);
if (firebaseLocal) {
    const adminServiceAccountPrivatekey = saCredentials.private_key;
    const adminServiceAccountClientEmail = saCredentials.client_email;

    //local
    admin.initializeApp({
        databaseURL: `http://localhost:9000/?ns=${PROJECT_ID}-default-rtdb`, //http://localhost:9000/?ns=tamniyombot65-eafd4-default-rtdb
        credential: admin.credential.cert({
            projectId: PROJECT_ID,
            clientEmail: adminServiceAccountClientEmail,
            privateKey: adminServiceAccountPrivatekey
        })
    });
    // // END
} else {
    //server
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: `https://screener-de5c7-default-rtdb.firebaseio.com`
    });
    //END
}

const ROOT_REF = admin.database().ref('line-bot');

// researchuser
//nibceg-0pebxi-roDjug
const app = express();
app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.all('/', (req, res, next) => {
    console.log('checking auth');
    next()
})

app.post('/webhook', async (req, res) => {

    Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
})

app.post('/questions', async (req, res) => {
    let filsList = await DataService.getAvailableQuestions()
    res.send({
        data: filsList
    })
})

app.post('/upsertProfile', (req, res) => {
    let { profile } = req.body.data
    console.log(profile);
    register(profile).then(success => {
        if (success) res.send({
            data: 'ok'
        })
    })
})

app.post('/getStatCorr', async (req, res) => {
//  b /
    

})

app.post('/getStat', async (req, res) => {

    console.log('received stat req from ui');

    ROOT_REF.child('testResults').once('value', snapshot => {
        if (snapshot.exists()) {     
            let testresults = snapshot.val()               
            res.send({
                data: {
                    total: 300,
                    units: Object.entries(single_rank_units).map(([abbr, unit]) => {
                        return {
                            abbr,
                            ...unit,
                            count: Object.entries(testresults).length
                        }
                    })
                }
            })
        }
    })
    // res.send({
    //     data: Object.entries(single_rank_units).map(([abbr, unit]) => {
    //         return {
    //             abbr,
    //             ...unit,
    //             count: 100
    //         }
    //     })
    // })
})


app.get('/generatedemodata/:count', async  (req, res) => {

    let count = req.params.count

    let tests = ["q2", "q3"]
    let qlengths = [12, 10]
    let a = [[0, 1], [5, 4, 3, 2, 1]]
    let userIds = Array(parseInt(count) || 100).fill()
    let units = Object.values(single_rank_units)
    let users = userIds.map(_ => {
        let unit = units[parseInt(Math.random() * (units.length - 1))]
        let gender = unit.gender || Math.random() > 0.5 ? "ชาย" : "หญิง"
        return {
            userId: uuidv4(),
            name: random_name({gender: gender ? 'male' : 'female'}),
            gender,
            age: 14 + parseInt((28 - 14) * Math.random()),
            unit : unit.name,
            avggrade: (1.01 + parseFloat((4.00 - 1.01) * Math.random())).toFixed(2)
        }
    })
    let testResults = users.map(user => {
        return {
            [user.userId] : tests.reduce((p, q, index) => {
                return {
                    ...p,
                    [q] : {
                          [Date.now()] : Array(qlengths[index]).fill().reduce((p, _, i) => {
                            let val = parseInt(Math.round(Math.random() * (a[index].length - 1)))
                            return {
                                ...p,
                                [i] : val,
                                total : p.total + val
                              }
                          }, { total: 0 })
                    }
                }
            }, {})
        }
    })
    // ROOT_REF.child('users').set({ ...users})
    // ROOT_REF.child('testResults').set({ ...testResults})
    
    let promise = await Promise.all([
        users.forEach(user => {
            ROOT_REF.child('users').child(user.userId).set(user)
        }),
        testResults.forEach((test) => {
            console.log(test);
            let [key, value] = Object.entries(test)[0]
            ROOT_REF.child('testResults').child(key).set(value)
        })
    ])
    if (promise) res.send({
        data: {
            users,
            testResults
        }
    })

})

async function handleEvent(event) {
    // if (event.type !== 'message' || event.message.type !== 'text') {
    //   return Promise.resolve(null);
    // }

    let userId = event.source.userId;
    let groupId = event.source.groupId;
    let replyToken = event.replyToken

    if (event.type === KEY.UNFOLLOW) {
        let displayName = (await ROOT_REF.child(FB_PATH.users).child(userId).child('displayName').once('value')).val()
        register({
            displayName: displayName,
            userId, userId,
            [KEY.UNFOLLOW]: Date.now()
        })
        return end
    }

    let profile = await client.getProfile(userId)
    console.log('====================================');
    console.log(profile);
    console.log('====================================');
    register(profile)

    let scrPayload = new Screening()

    switch (event.type) {
        case KEY.FOLLOW:
            register({
                ...profile,
                [KEY.FOLLOW]: Date.now()
            })
            break
        case KEY.MEMBER_JOINED:
          break
        case KEY.JOIN:
            break
        case KEY.MESSAGE:

            let q = require('./data/Questions/q3.json')
            initQuestions(q)

            break;
        case KEY.POSTBACK:
            let data = new URLSearchParams(event.postback.data)
            console.log(data);
            let mode = data.get('mode')
            switch (mode) {
                case KEY.TEST:
                    let id = data.get('testId')
                    return ROOT_REF.child(FB_PATH.users).child(userId).child(FB_PATH.tests).child(id).once('value', snapshot => {
                        if (!snapshot.exists()) return end
                        let questions = new Questions(snapshot.val())
                        presentQuestion(questions, data)
                    })

                default:
                    break;
            }
            break;
        default:
            break;
    }

    /**
     *
     * @param {Questions} q
     */

    function initQuestions(q) {

        let questions = new Questions(q)
        ROOT_REF.child(KEY.TEST).child(q.id).set(questions)
        let { userId, ...others} = profile
                ROOT_REF.child(FB_PATH.weblog).child(FB_PATH.activities).push().set({
                    ...others,
                    date : Date.now(),
                    type: 'init',
                    testName: q.name
                })
        ROOT_REF.child(FB_PATH.users).child(userId).child(FB_PATH.tests).child(q.id).set(questions)
        .then(_ => {
            presentQuestion(questions)
        })
    }

    /**
     *
     * @param {Questions} questions
     * @param {URLSearchParams} data
     * @returns
     */

    function presentQuestion(questions, data) {
        // let q = require('./data/Questions/q3.json')
        // let questions = new Questions(q)

        let nextQ = (data && questions.questions.find(q => !data.get(q.id))) || questions.getNextQuestion(data && data.get('next'))

        let info = questions.info()

        if (nextQ) {
            nextQ.info = info
            info.currentId = nextQ.id
            return client.replyMessage(replyToken, [scrPayload.question(nextQ), scrPayload.choices(info, data)]);
        }
        saveAnswer(questions, data)

    }

    /**
     *
     * @param {Questions} questions
     * @param {URLSearchParams} data
     */
    function saveAnswer(questions, data) {
        let { id, name, answer } = questions
        let answeredQ = questions.questions.reduce((p, c) => ({
            ...p,
            [c.id]: data.get(c.id),
            total: p.total + Number(data.get(c.id))
        }), { total: 0,  id, name, answer })
        let date = Date.now()

        let { userId, ...others} = profile
        ROOT_REF.child(FB_PATH.weblog).child(FB_PATH.testResult).child(date).set({
            ...others,
            id,
            name,
            answer,
            date : Date.now(),
            total: answeredQ.total,
            pass: answeredQ.total >= 40
        })
        ROOT_REF.child(KEY.TEST_RESULT).child(userId).child(data.get('testId')).child(date).set(answeredQ)
        .then(client.replyMessage(replyToken, [Payload.quickReply('คะแนนที่ได้ ' + answeredQ.total + ' คะแนน', [chip('ประเมินคะแนน')])]))

    }
  }

  async function register(profile) {

    console.log('====================================');
    console.log('registering');
    console.log('====================================');
    if (!profile) return end
    if (!profile[KEY.UNFOLLOW]) {
        let { displayName, pictureUrl } = profile
        ROOT_REF.child(FB_PATH.activities).child(profile.userId).update({
            displayName,
            pictureUrl: pictureUrl || ''
        })
    }

    return Promise.all([
        ROOT_REF.child(FB_PATH.users).child(profile.userId).update({
            ...profile,
            lastLoggedin: Date.now()
        }),
        ...['follow', 'unfollow', 'login', 'weblogin'].map(node => {
            if (profile[node]){
                ROOT_REF.child(FB_PATH.activities).child(profile.userId).child(node).update({
                [Date.now()] : true
                })

                let { userId, ...others} = profile
                ROOT_REF.child(FB_PATH.weblog).child(FB_PATH.activities).push().set({
                    ...others,
                    date : Date.now(),
                    type: node
                })
            }
        })
    ])


  }

  exports.api = functions.https.onRequest(app);