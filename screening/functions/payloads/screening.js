const { KEY } = require("../constants")
const { chip, postback } = require("./payloads")
const Payload = require("./payloads")

class Screening {
    question(q) {
        return {
            type: 'flex',
            altText: 'text',
            contents: {
              type: 'bubble',
              size: 'giga',
              direction: 'ltr',
              header: {
                type: 'box',
                layout: 'vertical',
                paddingAll: '10px',
                contents: [
                  {
                    type: 'text',
                    text: q.id ? 'คำถามที่ ' + q.id  : 'Question',
                    align: 'start',
                    wrap: true,
                    contents: []
                  }
                ]
              },
              hero: q.image && {
                type: 'image',
                url: q.image ? `https://screener-de5c7.web.app/assets/images/${q.info.id}/${q.id}.jpeg` : 'https://www.indianahandtoshoulder.com/userfiles/image/blog/ihtsc-WASHING-HANDS-BLOG_637721644082783280.jpg',
                size: 'full',
                aspectRatio: q.image.aspectRatio || '3:2.5',
                aspectMode: 'cover'
              },
              body: {
                type: 'box',
                layout: 'vertical',
                paddingAll: '0px',
                contents: [
                  {
                    type: 'box',
                    layout: 'vertical',
                    paddingAll: '10px',
                    backgroundColor: '#2196F3FF',
                    contents: [
                      {
                        type: 'text',
                        text: q.text || 'Do you clean hand?',
                        size: 'lg',
                        color: '#FFFFFFFF',
                        align: 'start',
                        wrap: true,
                        contents: []
                      }
                    ]
                  }
                ]
              },
              footer: {
                type: 'box',
                layout: 'horizontal',
                cornerRadius: '5px',
                contents: [
                  {
                    type: 'filler'
                  }
                ]
              },
              styles: {
                header: {
                  backgroundColor: '#2979FF3D'
                },
                body: {
                  backgroundColor: '#2196F3FF',
                  separator: false
                },
                footer: {
                  backgroundColor: '#2196F3FF',
                  separator: false
                }
              }
            }   
             
        }
    }

    /**
     * 
     * @param {*} q 
     * @param {URLSearchParams} data 
     * @returns 
     */
    choices(q, data){
      return Payload.quickReply(q.answer.commonpharse, Object.entries(q.answer.items).map(([k, a]) => {        
        
        let params = data || new URLSearchParams(`mode=` + KEY.TEST + `&testId=` + q.id)
        params.set(q.currentId, k)
        params.set('next', q.currentId)
        return postback({
          text: q.answer.commonpharse ? a.replace(q.answer.commonpharse, '') : a,
          data: params.toString()
        })
      }))
    }
}

module.exports = Screening