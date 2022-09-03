const functions = require("firebase-functions");
const {WebhookClient} = require('dialogflow-fulfillment');
const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');
const random_name = require('node-random-name')
// Instantiates a intent client
const { IntentsClient } = require('@google-cloud/dialogflow');
const calculateCorrelation = require("calculate-correlation");

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
const { chip, postbackFilledIn, openUri, quickReply } = require("./payloads/payloads");
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
    let filsList = await getAvailableQuestions()
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

app.post('/getStatCorr/:test/:field', async (req, res) => {

    let params = req.params
    let testResults = await (await ROOT_REF.child('testResults').once('value')).val()
    let users = await (await ROOT_REF.child('users').once('value')).val()
    console.log(params.field);
    console.log(params.test);

    let data = Object.entries(testResults).map(([key, test]) => {
        let x = parseFloat(users[key][params.field])
        //TODO:- check male female and set labels
        x = x || users[key][params.field]
        return [x , Object.values(test[params.test])[0].total]
    })
    const correlation = params.field === 'gender' ? 0 : calculateCorrelation(data.map(d => d[0]), data.map(d => d[1]));



    var jsregression = require('js-regression');
 
// === Create the linear regression === //
var regression = new jsregression.LinearRegression();
// can also use default configuration: var regression = new jsregression.LinearRegression(); 
 
// === Train the linear regression === //
var model = regression.fit(data);
 
// === Print the trained model === //
console.log(model);
 
 
// === Testing the trained linear regression === //
var actualData = [];
var predictedData = [];
//y = -0.08x + 6.09
for(var x = 0; x < data.length; x++) {
  let actual_y = data[x][1]
  actualData.push(actual_y)
  var predicted_y = regression.transform([data[x][0]]);
  predictedData.push(predicted_y)
//   console.log("actual: " + actual_y + " predicted: " + predicted_y); 

}

    const {meanSquareError} = require('data-science-js')  

    // const predicted = []
 
    const mse = meanSquareError(predictedData, actualData)
    console.log('mse', mse);

    let ageCorr = {
        name: "การรับรู้",
        data,
        correlation,
        mse
      }
      res.send({
        data: [ageCorr]
      })

})

app.post('/getStat', async (req, res) => {

    console.log('received stat req from ui');

    let testResults = await (await ROOT_REF.child('testResults').once('value')).val()
    let users = await (await ROOT_REF.child('users').once('value')).val()

    let average = await (await ROOT_REF.child('average').once('value')).val()
    let unitAverage = await (await ROOT_REF.child('unitAverage').once('value')).val()

    res.send({
        data: {
            total: Object.entries(users).length,
            units: Object.entries(users).reduce((p, [_, user]) => {
                return {
                    ...p,
                    [user.unit] : {
                        count: ((p[user.unit] && p[user.unit].count) || 0) + 1
                    }
                }
            }, {}),
            average: Object.entries(average).reduce((p, [key, q]) => {
                let total = Object.values(q).reduce((p, v) => (p + v), 0)
                return {
                    ...p,
                    [key] :  (total / Object.values(q).length).toFixed(2)
                }
            }, {}),
            unitAverage: Object.entries(unitAverage).reduce((p, [name, Q]) => {
                return {
                    ...p,
                    [name] :  Object.entries(Q).reduce((p, [key, q]) => {
                        let total = Object.values(q).reduce((p, v) => {
                            return (p + v)
                        }, 0)
                        return {
                            ...p,
                            total,
                            length: Object.values(q).length,
                            [key] :  (total / Object.values(q).length).toFixed(2)
                        }
                    }, {}),
                }
            }, {})

        }
    })

    // ROOT_REF.child('testResults').once('value', snapshot => {
    //     if (snapshot.exists()) {
    //         let testresults = snapshot.val()

    //     }
    // })
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
        let unit = units[parseInt(Math.round(Math.random() * (units.length - 1)))]
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
    let average = {}
    let unitAverage = {}
    let testResults = users.map(user => {
        return {
            [user.userId] : tests.reduce((p, q, index) => {
                return {
                    ...p,
                    [q] : {
                          [Date.now()] : Array(qlengths[index]).fill().reduce((p, _, i) => {

                            let val = parseInt(Math.round(Math.random() * (a[index].length - 1)))
                            average[q] = {
                                ...average[q],
                                [user.userId] : val
                            }
                            unitAverage[user.unit] = {
                                ...unitAverage[user.unit],
                                [q]: {
                                    ...unitAverage[user.unit] && unitAverage[user.unit][q],
                                    [user.userId]: val
                                }
                            }
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
            // console.log(test);
            let [key, value] = Object.entries(test)[0]
            ROOT_REF.child('testResults').child(key).set(value)

        }),
        ROOT_REF.child('average').set(average),
        ROOT_REF.child('unitAverage').set(unitAverage)

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

            let payload = new Payload()
            let q
        switch (event.message.text)  {
            case 'ปัจจัยบุคคล':
                return client.replyMessage(replyToken, payload.profile())
            case 'ปัจจัยรับรู้':
                q = require('./data/Questions/q2.json')
                initQuestions(q)

                break;
            case 'ปัจจัยพฤติกรรม':
                q = require('./data/Questions/q3.json')
                initQuestions(q)
                break;
            case 'สื่อเพิ่มความรู้':
                return client.replyMessage(replyToken, quickReply('สื่อเพิ่มพูนให้ความรู้เกี่ยวกับ COVID-19', [openUri('https://liff.line.me/1657306992-WB3zXVOO', 'เปิดสื่อการสอน')] ))
            case 'menu':
            case 'เมนู':
                return client.replyMessage(replyToken, payload.menu())
            default:
                break;
        }

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
        let qrpItems = []
        let text = 'คะแนนที่ได้ ' + answeredQ.total + ' คะแนน'

        let info = questions.info()
        if (info.result_groups) {

            let match = matchLowerBound(info.result_groups, answeredQ.total)
            text = [text, info.result_groups[match].description].join("\n")
            if (info.result_groups[match].next) qrpItems.push(openUri('https://liff.line.me/1657306992-WB3zXVOO', 'เปิดสื่อการสอน'))
        }
        if (!qrpItems.length) {
            text = [text, 'หากท่านสนใจ สามารถชมสื่อเพื่อหาความรู้เพิ่มเติมได้'].join("\n")
            qrpItems.push(openUri('https://liff.line.me/1657306992-WB3zXVOO', 'เปิดสื่อการสอน'))
        }
        ROOT_REF.child(KEY.TEST_RESULT).child(userId).child(data.get('testId')).child(date).set(answeredQ)
        .then(client.replyMessage(replyToken, [quickReply(text, qrpItems)]))

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