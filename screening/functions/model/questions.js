class Questions {
    
    constructor({name, id, instructions, questions, answer, result_groups}) {
        this.name = name
        this.id = id
        this.instructions = instructions,
        this.questions = questions
        this.answer = answer        
        if (result_groups) this.result_groups = result_groups
    }
    
    info() {        
        let { questions, ...others } = this
        return others
    }

    getNextQuestion(next){
        if (!next) return this.questions[0]
        return this.questions[next]
    }

    isLastQuestion(id) {
        return Math.max(...q.questions.map(q => q.id)) == id
    }

}
module.exports = Questions