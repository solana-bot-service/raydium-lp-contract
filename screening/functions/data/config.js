const userIds = {
    superadmin: 'Udd7346edda5c29e7351071a982d3e1dd'
}
const end = {
  status: 200
}
const lineBotPath = 'line-bot'
const FB_PATH = {
    users: 'users',
    groups: 'groups',
    tests: 'tests',
    questions: 'questions',
    products: 'products',
    categories: 'categories',
    activities: 'activities',
    weblog: 'weblog',
    testResult: 'testResult',
    productWithVariants: 'productWithVariants'
}

const notifierIds = {
    jjsystemadmin: '6E6tWenVFX40vt7r9tC7nehj7FktXE2Ny5xiAoVUpsK', //
    jjconsultants: '6E6tWenVFX40vt7r9tC7nehj7FktXE2Ny5xiAoVUpsK' //
}

const ENTITIES = {
    products: 'name',
    categories: 'catname',
    variants: 'variant',
    productvariants: 'productvariants'
}

const entityTypes = {
  rank: 'ranks',
  gender: 'genders',
  rtafunit: 'rtaf-units'
}

const KEYS = {
    start_translating: 'เริ่มแปล',
    stop_translating : 'เลิกแปล',
    detect_language: 'Detect Language',
    view_result : 'รวมคะแนนและแปลผล',
    view_profile: 'ดูโปรไฟล์',
    editProfile : 'แก้ไขโปรไฟล์',
    editNickname: 'แก้ไขชื่อเล่น'
}

const INTENTS = {
    kRegister: 'k_register',
    kRegisterCustom: 'k_register - custom',
    kHappy: 'k_happy',
    kHappyQuiz : 'k_happy - quiz',
    kHappyFallback  : 'k_happy - fallback',
    kHappyResult: 'k_happy - result',
    rViewProfile : 'r_viewProfile'

}

const PHRASES = {
    tmhi15: 'Thai Mental Health Indicator - 15'
}

const en_th_unit_mapping = (en) => {
    switch (en) {
        case 'year':
            return 'ปี'

        default:
            break;
    }
}

const single_rank_units = {
  atts : {
    name: 'โรงเรียนจ่าอากาศ',
    rank: 'นจอ.',
    gender: 'ชาย'
  },
  nkrafa : {
    name: 'โรงเรียนนายเรืออากาศนวมินทกษัตริยา​ธิ​​ราช​',
    rank: 'นนอ.',
    gender: 'ชาย'
  },
  rtafnc: {
    name: 'วิทยาลัยพยาบาลทหารอากาศ',
    rank: 'นพอ.'
  },
  rtafband: {
    name :  'โรงเรียนดุริยางค์ทหารอากาศ',
    rank : 'นดอ.'
  }
}

const TESTS = [
    {
      value: 'tmhi15',
      synonyms: [
        'แบบสัมภาษณ์ดัชนีชี้วัดสุขภาพจิตคนไทยฉบับสั้น',
        'แบบทดสอบสุขภาพจิต',
        'tmhi15',
        'Thai Mental Health Indicator - 15',
        'แบบทดสอบความสุข',
        'วัดสุขภาพจิต',
        'ความสุข',
        'สุขภาพจิต'
      ]
    },
    {
      value: 'st5',
      synonyms: [
        'แบบประเมินความเครียด (ST-5)',
        'แบบประเมินความเครียด',
        'st5',
        'ST-5'
      ]
    },
    {
      value: '2q',
      synonyms: [
        'แบบประเมินภาวะซึมเศร้า 2 คำถาม (2Q)',
        'แบบประเมินภาวะซึมเศร้า 2Q',
        '2q',
        'แบบประเมินภาวะซึมเศร้า 2 คำถาม',
        '2Q'
      ]
    },
    {
      value: '9q',
      synonyms: [
        'แบบประเมินภาวะซึมเศร้า 9 คำถาม (9Q)',
        'แบบประเมินภาวะซึมเศร้า 9Q',
        '9q',
        'แบบประเมินภาวะซึมเศร้า 9 คำถาม',
        '9Q'
      ]
    }
  ]

const RANKS = require('../data/DFEntities/ranks.json').entries
const UNITS = require('../data/DFEntities/rtaf-units.json').entries
const GENDERS = require('../data/DFEntities/genders.json').entries

const entityArrays = {
  rank: RANKS,
  rtafunit: UNITS,
  gender: GENDERS
}

const user_props = {
  age : 'age',
  person: 'person',
  gender: 'gender',
  rank: 'rank',
  rtafunit: 'rtafunit'
}

/**
 *
 * @param {String} entityName
 * @param {Array} entities
 * @returns
 */
const SESSIONCONTEXT = (sessionName, entities, outputContextName, lifespanCount, parameters) => {

    return {
        sessionEntityTypes :[
            {
              name:  sessionName,
              entities: entities.map(c => {
                let synonyms = [...c.synonyms]
                if (c.key) synonyms.unshift(c.key)
                return {
                  value: c.value,
                  synonyms:synonyms
                }
              }),
              entityOverrideMode:"ENTITY_OVERRIDE_MODE_OVERRIDE"
            }
          ],
          outputContexts: [
            {
              name: outputContextName,
              lifespanCount: lifespanCount,
              ...parameters ? { parameters : parameters }: {}
            }
          ]
    }
}

const matchLowerBound = (resultGroups, result) => {

    let max = Math.max(...Object.keys(resultGroups).map(i => parseInt(i)))
    if (result >= max) return max

    var prev = -1;
    var i;
    for (i in resultGroups) {
        var n = parseInt(i);
        if ((prev != -1) && (result < n))
            return prev;
        else
            prev = n;
    }
}

const ITEMS_COUNTS_IN_CAROUSEL = (s, f, o) => {

    let size = Number(s)
    let desiredItemMax = Number(f)
    let offset = Number(o)

    let columns = Math.min(10, Math.ceil((size - (offset % desiredItemMax)) / desiredItemMax).toFixed(0));
    //Number(Math.ceil((size + offset - desiredItemMax) / desiredItemMax).toFixed(0))
    return {
        columns: columns,
        items_counts: Array(columns).fill('').map((_, page) => ((page === 0 & offset !== 0)
            ? Math.min(offset, size)
            : page === columns - 1
                ? (size - offset) % desiredItemMax === 0
                    ? desiredItemMax
                    :  (size - offset) % desiredItemMax
                : desiredItemMax)

                ),

        start: Array(columns).fill('').map((_, page) => (Math.max(0, page * desiredItemMax - offset))),
        end: Array(columns).fill('').map((_, page) => (size <= offset
        ? size
        : page === columns - 1
            ? Math.min((page + 1) * desiredItemMax - offset + 1, size)
            : (page + 1) * desiredItemMax))
    }
}

const PARAMS_PATHS = {
    category: 'categories',
    variant: 'variants'
}

const assets = {
    logo: 'https://firebasestorage.googleapis.com/v0/b/tamniyombot65-eafd4.appspot.com/o/assets%2Fimages%2Ftamniyom_logo%400%2C1x.jpg?alt=media&token=560c636a-e663-4f77-ad59-1928be38f921',
    flags_url : {
        'en': 'http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg',
        'fr': 'https://firebasestorage.googleapis.com/v0/b/task-cloud-function-iea.appspot.com/o/flags%2Ffr.png?alt=media&token=09cdc0ed-e1dd-4701-8fd7-43cd303c343d',
        'it': 'https://firebasestorage.googleapis.com/v0/b/task-cloud-function-iea.appspot.com/o/flags%2Fit.png?alt=media&token=ce1835d1-e849-4284-aa38-66996437d3d9',
        'th': 'https://firebasestorage.googleapis.com/v0/b/task-cloud-function-iea.appspot.com/o/flags%2Fth.png?alt=media&token=5326b179-9071-421c-8201-66706b44dd69'
    }
}

module.exports = {
    KEYS,
    FB_PATH,
    ENTITIES,
    INTENTS,
    PHRASES,
    TESTS,
    RANKS,
    UNITS,
    matchLowerBound,
    SESSIONCONTEXT,
    ITEMS_COUNTS_IN_CAROUSEL,
    userIds,
    notifierIds,
    user_props,
    single_rank_units,
    en_th_unit_mapping,
    entityTypes,
    entityArrays,
    assets,
    end,
    lineBotPath
}

