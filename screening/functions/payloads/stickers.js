const STICKERS = {
    yippie : {
        stickerId: '51626503',
        packageId: '11538'
    },
    ok: {
        stickerId : '51626500',
        packageId: '11538'
    },
    celebrate_drum: {
        stickerId : '51626507',
        packageId: '11538'
    },
    so_happy: {
        stickerId : '16581279',
        packageId: '8522'
    },
    ofcourse_panda : {
        stickerId : '16581278',
        packageId: '8522'
    },
    wakeup_head_hit: {
        stickerId : '51626515',
        packageId: '11538'
    },
    calm_crying: {
        stickerId : '2022',
        packageId: '446'
    },
    hug_crying: {
        stickerId : '11069863',
        packageId: '6359'
    },
    sad_silly : {
        stickerId: '10879',
        packageId: '789'
    },
    shot_james : {
        stickerId: '2844',
        packageId: '543'
    },
    lockedout_james : {
        stickerId: '2850',
        packageId: '543'
    },
    refreshing_james : {
        stickerId: '2822',
        packageId: '543'
    },
    shocking_brown : {
        stickerId: '2462',
        packageId: '534'
    },
    nobatt_cony : {
        stickerId: '526',
        packageId: '2'
    },
    love_hugging : {
        stickerId: '52002737',
        packageId: '11537'
    },
    clap_animated : {
        stickerId: '51626498',
        packageId: '11538'
    }    ,
    ok_blue : {
        stickerId: '52114113',
        packageId: '11539'
    },
    ok_sally : {
        stickerId: '10858',
        packageId: '789'
    },
    ok_brown_stamp : {
        stickerId: '11069857',
        packageId: '6359'
    },
    ok_brown_red : {
        stickerId: '11069848',
        packageId: '6359' 
    },
    ok_brown_cony : {
        stickerId: '16581266',
        packageId: '8522'
    },
    good_cony : {
        stickerId: '16581271',
        packageId: '8522'
    },
    yes_sally_green : {
        stickerId: '16581269',
        packageId: '8522'
    },
    yessir_james : {
        stickerId: '51626520',
        packageId: '11538'
    },
    thankyou_brown_cony : {
        stickerId: '11069856',
        packageId: '6359'
    },
    hello_brown_cony_phone : {
        stickerId: '11069853',
        packageId: '6359'
    },
    hello_sally_brown : {
        stickerId: '11088035',
        packageId: '6370'        
    },
    cheering_brown_cony : {
        stickerId: '11069870',
        packageId: '6359'
    },
    cant_wait: {
        stickerId: '16581275',
        packageId: '8522'
    },
    lets_relax_brown : {
        stickerId: '11069858',
        packageId: '6359'
    },
    hey_brown_cony : {
        stickerId: '11069861',
        packageId: '6359'
    },
    cheerup_brown_cony : {
        stickerId: '11088029',
        packageId: '6359'
    },
    please_sally : {
        stickerId: '11069859',
        packageId: '6359'
    },
    please_brown : {
        stickerId: ' 16581281',
        packageId: '8522'
    },
    checking_moon : {
        stickerId: '16581273',
        packageId: '8522'
    },
    bow : {
        stickerId: '52114110',
        packageId: '11539'
    },
    clap : {
        stickerId: '52114115',
        packageId: '11539'
    },
    celebrate : {
        stickerId: '52114131',
        packageId: '11539'
    },
    go : {
        stickerId: '52114146',
        packageId: '11539'
    },
    dance : {
        stickerId: '52114116',
        packageId: '11539'
    },
    dance_sally : {
        stickerId: '10867',
        packageId: '789'
    },
    no : {
        stickerId: '52114144',
        packageId: '11539'
    },
    no_stop : {
        stickerId: '51626526',
        packageId: '11538'
    },
    no_sally : {
        stickerId: '52002760',
        packageId: '11538'
    },
    no_sally2 : {
        stickerId: '16581287',
        packageId: '8522'
    },
    no_sally3 : {
        stickerId: '10860',
        packageId: '789'
    },
    sleep_panda : {
        stickerId: '51626513',
        packageId: '11538'
    },
    waken_moon : {
        stickerId: '51626515',
        packageId: '11538'
    },
    how_sally : {
        stickerId: '16581270',
        packageId: '8522'
    },
    mobile_brown: {
        stickerId: '52002753',
        packageId: '11537'        
    }
    
}

const THEME_STCKERS = {
    hello : [
        STICKERS.hello_brown_cony_phone,
        STICKERS.hello_sally_brown
    ],
    ok: [
        STICKERS.ok,
        STICKERS.ok_blue,
        STICKERS.ok_brown_cony,
        STICKERS.ok_brown_red,
        STICKERS.ok_brown_stamp,
        STICKERS.ok_sally,
        STICKERS.good_cony
    ],
    yes: [
        STICKERS.yes_sally_green, 
        STICKERS.good_cony
    ],
    no : [
        STICKERS.no,
        STICKERS.no_sally,
        STICKERS.no_sally2,
        STICKERS.no_sally3,
        STICKERS.no_stop
    ],
    sad: [
        STICKERS.sad_silly
    ],
    good : [
        STICKERS.good_cony,
        STICKERS.ok_brown_cony        
    ],
    please: [
        STICKERS.please_brown,
        STICKERS.please_sally        
    ],
    celebrate: [
        STICKERS.celebrate,
        STICKERS.celebrate_drum,
        STICKERS.dance,
        STICKERS.yippie,
        STICKERS.so_happy
    ],
    clap: [
        STICKERS.clap,
        STICKERS.clap_animated,
        STICKERS.yippie
    ],
    comfort: [
        STICKERS.calm_crying,
        // STICKERS.hug_crying,
        // STICKERS.love_hugging,
        STICKERS.lets_relax_brown,
        // STICKERS.cheerup_brown_cony,
        // STICKERS.cheering_brown_cony
    ]
}

const randomThemeSticker = (theme) => {
    let stickers = THEME_STCKERS[theme]
    if (stickers.length) {
        let rand = Number((Math.floor(Math.random() * stickers.length)).toFixed(0))
        return stickers[rand]
    }
}

const resultStickers = {
    4 : [
        randomThemeSticker('comfort'),
        randomThemeSticker('sad'),
        randomThemeSticker('good'),
        randomThemeSticker('celebrate')
    ],
    3 : [
        randomThemeSticker('comfort'),
        randomThemeSticker('sad'),
        randomThemeSticker('good')
    ],
    2 : [
        randomThemeSticker('good'),
        randomThemeSticker('celebrate')
    ],
    tmhi15: [
        randomThemeSticker('comfort'),
        randomThemeSticker('good'),
        randomThemeSticker('ok')
    ],
    st5 : [
        randomThemeSticker('celebrate'),
        randomThemeSticker('good'),
        randomThemeSticker('sad'),
        randomThemeSticker('comfort'),
    ],
    '9q' : [
        randomThemeSticker('celebrate'),
        randomThemeSticker('ok'),
        randomThemeSticker('sad'),
        randomThemeSticker('comfort'),
    ]
}

module.exports = {
    STICKERS,
    THEME_STCKERS,
    randomThemeSticker,
    resultStickers
}