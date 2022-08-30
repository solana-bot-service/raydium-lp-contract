class Questionary {
    constructor(name) {
        this.name = name
    }

    static getAvailableQuestions() {
        const path = require('path');
        const fs = require('fs');

        const directoryPath = path.join(__dirname, '../data/Questions');
        //passsing directoryPath and callback function
        
        return new Promise((resolve, reject) => {
            fs.readdir(directoryPath, function (err, files) {
                //handling error
                if (err) {
                    console.log('Unable to scan directory: ' + err);
                    reject(err)
                } 
                console.log(files);
                resolve(files)
                //listing all files using forEach
                // files.forEach(function (file) {
                //     // Do whatever you want to do with the file
                //     console.log(file); 
                // });
            });
        })
    }

    exists() {

        const fs = require('fs')
        const path = `../data/Questions/${this.name}.json`
        console.log(path);

        try {
            if (fs.existsSync(path)) {
                
                return true
            }
        } catch(err) {
            console.error(err)
        }
    }

    info() {
        if (!this.exists) return []
        let q = require(`../data/Questions/${this.name}.json`)
        if (q) {
            let { questions, answer, ...others } = q
            return others
        }
        return []
    }

    getAllQuestions() {
        if (!this.exists) return []
        let questions = require(`../data/Questions/${this.name}.json`)
        if (questions) {
            return questions
        }
        return []
    }

    getNextQuestion(previousId) {

        if (!this.exists()) return []
        let q = require(`../data/Questions/${this.name}.json`)
        if (q.questions && q.questions.length) {
            let nextQ = q.questions.find(q => q.id == previousId ? previousId + 1 : 0)
            if (nextQ) return nextQ
        }
        return {}

    }
}

module.exports =  Questionary