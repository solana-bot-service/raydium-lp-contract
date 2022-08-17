const Questionary =  require("../model/questionary")

class DataService  {

    static getAvailableQuestions() {        
        return new Promise((resolve, reject) => {
            Questionary.getAvailableQuestions().then(q => {
                resolve(q)
            })
        })
    }
    
    getAllQuestions (name) {
        const q = new Questionary(name)
        return q.getAllQuestions()
    }

    getInfo(name) {
        const q = new Questionary(name)
        return q.info()
    }

}
module.exports = DataService

