export const RANKS = [
    'พลฯ',         'พลอาสาสมัคร', 'จ.ต.กองฯ',
    'กห.ป.(ญ)',    'กห.ป.(ช)',   'จ.ต.หญิง',
    'จ.ต.',        'จ.ท.หญิง',    'จ.ท.',
    'จ.อ.หญิง',     'จ.อ.',       'พ.อ.ต.หญิง',
    'พ.อ.ต.',      'พ.อ.ท.หญิง',  'พ.อ.ท.',
    'พ.อ.อ.หญิง',   'พ.อ.อ.',     'พ.อ.อ.(พ) หญิง',
    'พ.อ.อ.(พ)',   'กห.ส.(ญ)',   'กห.ส.(ช)',
    'ร.ต.หญิง',     'ร.ต.',       'ร.ท.หญิง',
    'ร.ท.',        'ร.อ.หญิง',    'ร.อ.',
    'น.ต.หญิง',     'น.ต.',       'น.ท.หญิง',
    'น.ท.',        'น.อ.หญิง',    'น.อ.',
    'น.อ.(พ) หญิง', 'น.อ.(พ)',    'พล.อ.ต.หญิง',
    'พล.อ.ต.',     'พล.อ.ท.หญิง', 'พล.อ.ท.',
    'พล.อ.อ.หญิง',  'พล.อ.อ.',    'พล.อ.อ.*หญิง',
    'พล.อ.อ.*'
  ]

  export const nkrafaunits = [
    {
      "order": 1,
      "name": "บก."
    },
    {
      "order": 2,
      "name": "ผธก.บก."
    },
    {
      "order": 3,
      "name": "ผกง."
    },
    {
      "order": 4,
      "name": "ฝจห."
    },
    {
      "order": 5,
      "name": "งป."
    },
    {
      "order": 6,
      "name": "กยข."
    },
    {
      "order": 7,
      "name": "กกบ."
    },
    {
      "order": 8,
      "name": "กกพ."
    },
    {
      "order": 9,
      "name": "กสถผ."
    },
    {
      "order": 10,
      "name": "กปศ."
    },
    {
      "order": 11,
      "name": "กรม นนอ."
    },
    {
      "order": 12,
      "name": "กวท."
    },
    {
      "order": 13,
      "name": "กรก."
    },
    {
      "order": 14,
      "name": "ผชย.กรก."
    },
    {
      "order": 15,
      "name": "ผขส.กรก."
    },
    {
      "order": 16,
      "name": "ผสก.กรก."
    },
    {
      "order": 17,
      "name": "ซักรีด"
    },
    {
      "order": 18,
      "name": "เกียกกาย"
    },
    {
      "order": 19,
      "name": "จัดเลี้ยง"
    },
    {
      "order": 20,
      "name": "กกศ."
    },
    {
      "order": 21,
      "name": "กอษ."
    },
    {
      "order": 22,
      "name": "กอบ."
    },
    {
      "order": 23,
      "name": "กกส."
    },
    {
      "order": 24,
      "name": "กฟธ."
    },
    {
      "order": 25,
      "name": "กวว."
    },
    {
      "order": 26,
      "name": "กวคต."
    },
    {
      "order": 27,
      "name": "กวมส."
    },
    {
      "order": 28,
      "name": "สบฑ."
    },
    {
      "order": 29,
      "name": "กสว."
    },
    {
      "order": 30,
      "name": "อย."
    },
    {
      "order": 31,
      "name": "สห."
    },
    {
      "order": 32,
      "name": "กพล."
    },
    {
      "order": 33,
      "name": "รพ."
    },
    {
      "order": 34,
      "name": "กทส."
    }
  ]
  
  export const personprops = {
    rank: {
        name: "RANK",
        label: "ยศ",
        required: true,
        type: 'select',
        options: RANKS
    },
    name: {
        name: "NAME",
        label: "ชื่อ",
        required: true
    },
    surname: {
        name: "SURNAME",
        label: "นามสกุล",
        required: true
    }, email: {
        name: "EMAIL",
        label: "อีเมล์",
        type: 'email',
        required: true
    }, unit: {
        name: "UNIT",
        label: "หน่วย",
        required: true,
        type: 'select',
        options: nkrafaunits
    }, position: {
        name: "POSITION",
        label: "ตำแหน่ง",
        required: true
    // }, 
    // building: {
    //     name: "BUILDING",
    //     label: "อาคาร",
    //     required: true,
    //     type: 'select',
    //     options: nkrafaunits
    }, tel: {
        name: "TEL",
        label: "โทร.",
        type: 'multiple',
        required: true
    }
}