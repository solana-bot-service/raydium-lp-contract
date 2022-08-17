const { quickReply } = require("./payloads")

const line = (payload) => {
    return {
        payload: {
            line: payload
        }
    }
}

const lineTextMessage = (text) => {
    return {
        payload: {
            line: {
                type: 'text',
                text: text
            }
        }
    }
}

const lineStickerMessage = ({packageId, stickerId}) => {
    return {
        payload: {
            line: {
                type: 'sticker',
                packageId: packageId,
                stickerId: stickerId
              }
        }
    }
}

const platformPayload = (platform, item) => {
    return {
        payload: {
            [platform]: item
        }
    }
}


const ffmformat = (items) => {
    return {
        fulfillmentMessages: items
    }
}

class FulfillmentMessage {

    /**
     *
     * @param {st} platforms
     * @param {Array} items
     * @returns
     */
    format(items) {
        return ffmformat(items.map(i => {
            return platformPayload(i.platform || 'line', i.item)
        }))
    }

    stickerText({sticker, text}) {
        let sm = lineStickerMessage({...sticker})
        let tm = lineTextMessage(text)

        return ffmformat([sm, tm])
    }

    sticker(sticker) {        
        return ffmformat([lineStickerMessage({...sticker})])
    }

    stickerQuickReply({sticker, text, items}) {
        let sm = lineStickerMessage({...sticker})
        let qrp = this.quickreplies(text, items).fulfillmentMessages

        return ffmformat([sm, ...qrp])
    }

    /**
     * @param {String} title
     * @param {Array} items
     */
    quickreplies(title, items) {
        return ffmformat([line(quickReply(title, Array.isArray(items) ? items : [items]))])
    }

    text(text) {
        return {
            fulfillmentMessages: [{
                text: {
                    text: [
                        text
                    ]
                }
            }]
        }

    }


}

module.exports = FulfillmentMessage