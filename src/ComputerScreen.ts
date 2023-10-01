import * as Phaser from 'phaser';
import { Keys } from './KeyboardKey';
import { SoundManager } from './SoundManager';
import { Keys as ConstantKeys } from './Constants';
import { QuizManager } from './QuizManager';

const TITLESTYLE : Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "vcr-osd-mono",
    color: "#FF0000",
    fontSize: 40,
};
const STATEMENTSTYLE : Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "vcr-osd-mono",
    color: "#000000",
    fontSize: 16,
    wordWrap: {
        width: 280,
        useAdvancedWrap: true,
    },
};
const ANSWERSTYLE : Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "vcr-osd-mono",
    color: "#000000",
    fontSize: 24,
    wordWrap: {
        width: 300,
        useAdvancedWrap: false,
    },
};

const ANSWERCOLOR = 0x000000;
const RIGHTCOLOR = 0x00FF00;
const WRONGCOLOR = 0xFF0000;

const ANSWERMAXLENGTH = 20;
const CURSORMOVEMENT = 14;
export class ComputerScreen extends Phaser.GameObjects.Container
{
    private statement : Phaser.GameObjects.Text;
    private answer : Phaser.GameObjects.Text;
    private soundManager : SoundManager;
    private cursor : Phaser.GameObjects.Line;
    private gameOver = false;
    private isValidating = false;
    private checkmark : Phaser.GameObjects.Image;
    private xmark : Phaser.GameObjects.Image;
    private flickerEvent = new Phaser.Time.TimerEvent({
        delay: 500,
        loop: true,
        callback: this.flickerCursor,
        callbackScope: this,
        startAt: 1000,
    });
    constructor(scene : Phaser.Scene)
    {
        super(scene, 492, 92);
        scene.add.existing(this);
        this.add(new Phaser.GameObjects.Text(scene, 60, 20, "Homework", TITLESTYLE));
        this.statement = new Phaser.GameObjects.Text(scene, 20, 60, "Question statement", STATEMENTSTYLE);
        this.answer = new Phaser.GameObjects.Text(scene, 15, 160, "", ANSWERSTYLE);

        this.add(this.statement);
        this.add(this.answer);

        this.soundManager = SoundManager.instance;
        this.cursor = new Phaser.GameObjects.Line(scene, 15, 172, 0, 0, 0, 20, 0x000000);
        this.add(this.cursor);
        
        this.xmark = new Phaser.GameObjects.Image(scene, 150, 100, ConstantKeys.Textures.X)
        .setScale(10,10)
        .setVisible(false);
        this.add(this.xmark);

        this.checkmark = new Phaser.GameObjects.Image(scene, 150, 100, ConstantKeys.Textures.CHECKMARK)
        .setScale(10,10)
        .setVisible(false);
        this.add(this.checkmark);

        scene.time.addEvent(this.flickerEvent);
        this.nextQuestion();
    }
    private flickerCursor()
    {
        this.cursor.setVisible(!this.cursor.visible);
    }
    private changeStatement(statement : string | string[])
    {
        this.statement.setText(statement);
    }
    public writeCharacter(character : Keys)
    {
        if (this.answer.text.length < ANSWERMAXLENGTH && !this.isValidating)
        {
            this.answer.setText(this.answer.text + character);
            this.cursor.x += CURSORMOVEMENT;
            this.cursor.setVisible(true);
            this.scene.time.removeEvent(this.flickerEvent);
            this.scene.time.addEvent(this.flickerEvent);
        }

        this.scene.sound.play(character === ' ' ? ConstantKeys.Sounds.SPACEBAR : ConstantKeys.Sounds.KEYSTROKE);
    }
    public eraseCharacter()
    {
        if (this.answer.text.length > 0 && !this.isValidating)
        {
            this.answer.setText(this.answer.text.substring(0, this.answer.text.length - 1));
            this.cursor.x -= CURSORMOVEMENT;
            this.cursor.setVisible(true);
            this.scene.time.removeEvent(this.flickerEvent);
            this.scene.time.addEvent(this.flickerEvent);
        }
        this.scene.sound.play(ConstantKeys.Sounds.BACKSPACE);
    }

    public validateAnswer()
    {
        this.scene.sound.play(ConstantKeys.Sounds.BACKSPACE);
        if (this.gameOver || this.isValidating) return;
        this.isValidating = true;

        if (QuizManager.validateAnswer(this.answer.text))
        {
            this.scene.sound.play(ConstantKeys.Sounds.VALIDATION);
            this.checkmark.setVisible(true);
        }
        else 
        {
            this.scene.sound.play(ConstantKeys.Sounds.WRONG);
            this.xmark.setVisible(true);
        }
        this.scene.time.addEvent(new Phaser.Time.TimerEvent({
            delay: 2000,
            callbackScope: this,
            callback: () => {
                this.isValidating = false;
                this.xmark.setVisible(false);
                this.checkmark.setVisible(false);
                if (QuizManager.allQuestionsCompleted) this.finishGame();
                else this.nextQuestion();
            },
        }))
    }

    private resetAnswer()
    {
        this.answer.setText("");
        this.cursor.setX(15);
    }

    private nextQuestion()
    {
        this.resetAnswer();
        this.changeStatement(QuizManager.nextQuestion());
    }

    private finishGame()
    {
        this.gameOver = true;
        this.resetAnswer();
        this.changeStatement([
            "You finished your homework!",
            `Your final score was ${QuizManager.rightAnswersCount}/${QuizManager.questionsCount}`,
            "Thanks for playing!", 
        ])
    }
}