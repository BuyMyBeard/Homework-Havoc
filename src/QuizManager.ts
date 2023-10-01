export class QuizManager
{   
    private static questions : Array<[string | string[], string]> = [];
    private static _currentAnswer : string;
    private static _questionsCount = 0;
    private static _rightAnswersCount = 0;
    static get allQuestionsCompleted()
    {
        return QuizManager.questions.length === 0;
    }
    static get currentAnswer()
    {
        return this._currentAnswer;
    }
    static get questionsCount()
    {
        return this._questionsCount;
    }
    static get rightAnswersCount()
    {
        return this._rightAnswersCount;
    }

    static addQuestion(statement : string | string[], answer : string)
    {
        QuizManager.questions.push([statement, answer]);
        this._questionsCount++;
    }
    static nextQuestion()
    {
        const next = QuizManager.questions.shift();
        QuizManager._currentAnswer = next[1];
        return next[0];
    }
    static validateAnswer(submittedAnswer : string)
    {
        const right =  this.currentAnswer === submittedAnswer;
        if (right) this._rightAnswersCount++;
        return right;
    }
    static generateQuestions()
    {
        QuizManager.addQuestion("What is blue and bounces up and down?", "blueberry");
        QuizManager.addQuestion([
            "I like...",
            "a) Apples",
            "b) Oranges",
            "c) Bananas",
            "d) Ass",
        ], "a");
    }
}