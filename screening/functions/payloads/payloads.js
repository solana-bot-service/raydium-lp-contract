const { en_th_unit_mapping, KEYS } = require("../data/config")

const postbackFilledIn = ({text, filledInText, label, data, displayingText}) => {
  return {
      type: 'action',
      action: {
          type: 'postback',
          label: label || text,
          data: data || 'postingBack=true',
          ...displayingText ? { displayText: text } : { text: text },
          inputOption: 'openKeyboard',
          ... filledInText ? {fillInText: filledInText} : {}
        }
  }
}

const postbackOpenRichmenu = ({text, label, data, displayingText}) => {
    return {
        type: 'action',
        action: {
            type: 'postback',
            label: label || text,
            data: data || 'postingBack=true',
            ...displayingText ? { displayText: text } : { text: text },
            inputOption: 'openRichMenu'
          }
    }
}

class Payload {

    static quickReply = (title, items) => {
        return {
            type: 'text',
            text: title,
            quickReply: {
                items: items
            }
        }
    }

    static cameraRoll = (label) => {
        return {
            type: 'action',
            action: {
              type: 'cameraRoll',
              label: label || 'Send photo'
            }
          }
    }
    static postback = ({text, data, label}) => {
      return {
          type: 'action',
          action: {
              type: 'postback',
              label: label || text,
              data: data,
              displayText: text
            }
      }
  }

    static chip = (text, label) => {
      return {
          type: 'action',
          action: {
            type: 'message',
            text: text,
            label: label || text.slice(0, 20)
          }
        }
  }
    static openUri = (uri, label) => {
      return {
          type: 'action',
          action: {
            type: 'uri',
            uri: uri,
            label: label || uri.slice(0, 20)
          }
        }
  }

    static postbackFilledIn = (params) => {
        return postbackFilledIn(params)
    }

    static postbackOpenRichmenu = (params) => {
        return postbackOpenRichmenu(params)
    }


static  postbackToggleRichmenu = ({text, label, data, displayingText, closeRichmenu}) => {
  return {
      type: 'action',
      action: {
          type: 'postback',
          label: label || text,
          data: data || 'postingBack=true',
          ...displayingText ? { displayText: text } : { text: text },
          inputOption: closeRichmenu ? 'closeRichMenu' : 'openRichMenu'
        }
  }
}


    youtubeFlex(media) {

      return {
        type: 'flex',
        altText: 'media',
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'vertical',
                    action: {
                      type: 'uri',
                      label: 'ชมคลิป',
                      uri: 'https://liff.line.me/1657366443-8gLpP5oa/?youtubeId=' + getUrlParameter(media.url.substring(media.url.indexOf('?')), 'v')
                    },
                    contents: [
                      {
                        type: 'image',
                        url: this.youtubeThumbnails(media.url)[0],
                        size: 'full',
                        aspectRatio: '4:3',
                        aspectMode: 'cover'
                      },
                      {
                        type: 'box',
                        layout: 'vertical',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        contents: [
                          {
                            type: 'filler'
                          },
                          {
                            type: 'image',
                            url: 'https://www.fiveminutefolklore.com/wp-content/uploads/2017/10/youtube-play-button-transparent-png-15-300x300.png'
                          },
                          {
                            type: 'filler'
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                type: 'text',
                text: media.displayTitle || media.title,
                weight: 'bold',
                size: 'md',
                wrap: true,
                contents: []
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'button',
                action: {
                  type: 'uri',
                  label: 'ชมคลิป',
                  uri: media.url
                },
                color: '#297C30FF',
                style: 'primary'
              }
            ]
          }
        }
      }
      
      
      

    }

    t() {
        return {
            "fulfillmentMessages": [{
                "payload": {
                    "line": {
                        "type": "text",
                        "text": "สวัสดีค่ะพี่นิคกี้",
                        "quickReply": {
                            "items": [null, {
                                "type": "action",
                                "action": {
                                    "type": "message",
                                    "text": "ดูโปรไฟล์",
                                    "label": "ดูโปรไฟล์"
                                }
                            }]
                        }
                    }
                }
            }]
        }
    }
    profile(user) {
        return {
            type: 'flex',
            altText: `โปรไฟล์ของ ${user.displayName}`,
            contents: {
                type: 'bubble',
                direction: 'ltr',
                header: {
                  type: 'box',
                  layout: 'vertical',
                  paddingAll: '5px',
                  contents: [
                    {
                      type: 'text',
                      text: user.displayName ? `โปรไฟล์ของ ${user.displayName}` : 'Profile',
                      color: '#FFFFFFFF',
                      align: 'center',
                      contents: []
                    }
                  ]
                },
                hero: {
                  type: 'image',
                  url: user.pictureUrl || 'https://sprofile.line-scdn.net/0hUaMa7IzrCk5gGCBiq-10MRBICSRDaVNcGXhNfFUYB34IeB9NHipDL1wfACsIe0lLSHwSeFxPAytsC30ofk72emcoVHlZLk0aSH1CrQ',
                  size: 'full',
                  aspectRatio: '1:1',
                  aspectMode: 'cover'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  paddingAll: '5px',
                  contents: [
                    {
                      type: 'box',
                      layout: 'vertical',
                      spacing: 'sm',
                      paddingAll: '10px',
                      backgroundColor: '#00000028',
                      cornerRadius: '10px',
                      contents: [
                        {
                          type: 'box',
                          layout: 'horizontal',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 1,
                              paddingAll: '2px',
                              backgroundColor: '#FF9F9FFF',
                              cornerRadius: '5px',
                              contents: [
                                {
                                  type: 'text',
                                  text: user.rank || '[ยศ]',
                                  align: 'center',
                                  contents: []
                                }
                              ]
                            },
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 4,
                              paddingAll: '2px',
                              backgroundColor: '#FF9F9FFF',
                              cornerRadius: '5px',
                              contents: [
                                {
                                  type: 'text',
                                  text: user.person ? user.person.name : '[ชื่อ นามสกุล]',
                                  weight: 'bold',
                                  align: 'center',
                                  wrap: true,
                                  contents: []
                                }
                              ]
                            },
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 1,
                              backgroundColor: '#FF9F9FFF',
                              cornerRadius: '5px',
                              contents: [
                                {
                                  type: 'text',
                                  size: 'lg',
                                  text: user.gender ? (user.gender === 'ชาย' ? '♂' : '♀') : '[เพศ]',
                                  align: 'center',
                                  contents: []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          spacing: 'sm',
                          contents: [
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 1,
                              backgroundColor: '#FF9F9FFF',
                              cornerRadius: '5px',
                              contents: [
                                {
                                  type: 'text',
                                  text: user.age ? `อายุ ${user.age.amount} ${en_th_unit_mapping(user.age.unit)}` : '[อายุ]',
                                  flex: 1,
                                  align: 'center',
                                  contents: []
                                }
                              ]
                            },
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 1,
                              backgroundColor: '#FFBDBDFF',
                              cornerRadius: '5px',
                              action: postbackFilledIn({text: KEYS.editNickname, filledInText: user.nickname}).action,
                              contents: [
                                {
                                  type: 'text',
                                  text: user.nickname ? `ชื่อเล่น "${user.nickname}"` : '[แก้ไขชื่อเล่น]',
                                  flex: 2,
                                  align: 'start',
                                  offsetStart: '5px',
                                  style: 'italic',
                                  contents: []
                                }
                              ]
                            }
                          ]
                        },
                        {
                          type: 'box',
                          layout: 'horizontal',
                          paddingTop: '5px',
                          contents: [
                            {
                              type: 'box',
                              layout: 'vertical',
                              flex: 1,
                              paddingAll: '2px',
                              backgroundColor: '#FF9F9FFF',
                              cornerRadius: '5px',
                              contents: [
                                {
                                  type: 'text',
                                  size: 'sm',
                                  text: user.rtafunit || '[สังกัด]',
                                  align: 'start',
                                  wrap: true,
                                  contents: []
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                footer: {
                  type: 'box',
                  layout: 'horizontal',
                  spacing: 'md',
                  paddingAll: '10px',
                  contents: [
                    {
                      type: 'button',
                      action: {
                        type: 'message',
                        label: '⟲',
                        text: 'ดูโปรไฟล์'
                      },flex: 1,
                      color: '#FFFFFF3A',
                      height: 'sm',
                      style: 'primary'
                    },
                    {
                      type: 'button',
                      action: postbackFilledIn({text: 'แก้ไขโปรไฟล์',label: 'แก้ไข', filledInText: [
                        [user.rank, ...Object.values(user.person)].join(""),
                        user.age ? 'อายุ ' + user.age.amount + ` ${en_th_unit_mapping(user.age.unit)}` : 'อายุ   ปี',
                        `สังกัด ${user.rtafunit || ' '} ${user.gender ? (user.gender === 'ชาย' ? 'ครับ' : 'ค่ะ'): ''}`
                    ].join("\n")}).action,
                      flex: 2,
                      color: '#FEFDFD84',
                      height: 'sm',
                      style: 'secondary'
                    },{
                        type: 'button',
                        action: postbackOpenRichmenu({text:'เมนู', label: '⏏', displayingText: true}).action,
                        flex: 1,
                        color: '#FFFFFF3A',
                        height: 'sm',
                        style: 'primary'
                      }

                  ]
                },
                styles: {
                  header: {
                    backgroundColor: '#CA0000FF'
                  },
                  hero: {
                    backgroundColor: '#CA0000FF'
                  },
                  body: {
                    backgroundColor: '#CA0000FF',
                    separator: false
                  },
                  footer: {
                    backgroundColor: '#CA0000FF',
                    separator: false
                  }
                }
              }


        }
    }
    menu(){
      return {
        type: 'flex',
        altText: 'เมนู',
        contents: {
          type: 'bubble',
          direction: 'ltr',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'เมนูผู้ใช้',
                align: 'center',
                contents: []
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            contents: [
              // {
              //   type: 'button',
              //   action: {
              //     type: 'postback',
              //     label: 'ปัจจัยบุคคล',
              //     text: 'ปัจจัยบุคคล',
              //     data: 'mode=profile'
              //   },
              //   style: 'primary'
              // },
              {
                type: 'button',
                action: {
                  type: 'message',
                  label: 'ปัจจัยการรับรู้',
                  text: 'ปัจจัยรับรู้'
                },
                style: 'primary'
              },
              {
                type: 'button',
                action: {
                  type: 'message',
                  label: 'ประเมินพฤติกรรม',
                  text: 'ประเมินพฤติกรรม'
                },
                style: 'primary'
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'button',
                action: postbackOpenRichmenu({text:'เมนู', label: '⏏', displayingText: true}).action,
                flex: 1,
                color: '#FFFFFF3A',
                height: 'sm',
                style: 'primary'
              }
            ]
          }
        }
        

      }
    }
}

module.exports = Payload