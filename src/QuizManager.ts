export class QuizManager
{   
    private static questions : Array<[string | string[], string[]]> = [];
    private static _currentAnswer : string[];
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

    static addQuestion(statement : string | string[], ...answers : string[])
    {
        QuizManager.questions.push([statement, answers]);
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
        const right = this.currentAnswer.indexOf(submittedAnswer.trim()) !== -1;
        if (right) this._rightAnswersCount++;
        return right;
    }
    static generateQuestions()
    {
        QuizManager.addQuestion("Who founded Viridonia?", "king risocrat", "risocrat");
        QuizManager.addQuestion("What did the capital produce the most?", "crops", "agriculture", "crop");
        QuizManager.addQuestion('Who produced the movie "The Lands of Viridonia: a peaceful time" ?', "george sacul");
        QuizManager.addQuestion("What savage camp did Jougda Veri lead?", "southeast", "southeast camp");
        QuizManager.addQuestion(["What caused the fall of the city of Jerqum?",
        "a) They lost the battle against the emperor",
        "b) There was a civil war within the walls of the city",
        "c) The economy collapsed",
        "d) The city prospered, it never fell"], "c");
        QuizManager.addQuestion("What city was the architect of the Mendower Fortress born in?", "estachio");
        QuizManager.addQuestion("What was the name of the siege machine the land of Wyne used?", "fiery dragon");
        QuizManager.addQuestion("Which Viridonia ruler was in power the longest?", "queen portagas", "portagas")
        QuizManager.addQuestion("What were the harvesting machines powered by?", "horse", "horses", "horsepower");
        QuizManager.addQuestion(["What year were the city fortifications completed?",
        "a) 568", 
        "b) 574",
        "c) 579", 
        "d) 599"], "b");
        QuizManager.addQuestion("Name a popular business in the city of Jerqum", "brothel", "brothels", "prostitution", "whorehouse", "cathouse", "massage parlor");
        QuizManager.addQuestion("Who killed King Rousta?", "virife", "king virife", "king vixife", "vixife");
        QuizManager.addQuestion(["What day was Viridonia founded?",
        "a) September 24th, 568",
        "b) November 13th, 568",
        "c) November 13th, 572",
        "d) September 24th, 572"], "a");
        QuizManager.addQuestion("What was the name of the pier by the Sionnis river?", "tiortuge port", "tiortuge", "tiortuge pier");
        QuizManager.addQuestion("Who were the slaves that worked the mines?", "savages", "savage", "native", "natives", "aboriginal")
    }
}