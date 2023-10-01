import * as Phaser from 'phaser';
import { Keys } from './KeyboardKey';
import { SoundManager } from './SoundManager';
import { Keys as ConstantKeys } from './Constants';

const TITLESTYLE : Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "vcr-osd-mono",
    color: "#FF0000",
    fontSize: 40,
};
const STATEMENTSTYLE : Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "vcr-osd-mono",
    color: "#000000",
    fontSize: 24,
    wordWrap: {
        width: 280,
        useAdvancedWrap: true,
    },
};
const ANSWERSTYLE : Phaser.Types.GameObjects.Text.TextStyle = {
    fontFamily: "vcr-osd-mono",
    color: "#0000AA",
    fontSize: 24,
    wordWrap: {
        width: 300,
        useAdvancedWrap: false,
    },
};

const ANSWERMAXLENGTH = 22;



export class ComputerScreen extends Phaser.GameObjects.Container
{
    private statement : Phaser.GameObjects.Text;
    private answer : Phaser.GameObjects.Text;
    private soundManager : SoundManager;
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
    }
    public changeStatement(statement : string)
    {
        this.statement.setText(statement);
    }
    public writeCharacter(character : Keys)
    {
        if (this.answer.text.length < ANSWERMAXLENGTH)
            this.answer.setText(this.answer.text + character);

        this.scene.sound.play(character === ' ' ? ConstantKeys.Sounds.SPACEBAR : ConstantKeys.Sounds.KEYSTROKE);
    }
    public eraseCharacter()
    {
        this.answer.setText(this.answer.text.substring(0, this.answer.text.length - 1));
        this.scene.sound.play(ConstantKeys.Sounds.BACKSPACE);
    }

    public validateAnswer(answer : string)
    {
        this.scene.sound.play(ConstantKeys.Sounds.BACKSPACE);
        return answer === this.answer.text;
    }
}