import * as Phaser from 'phaser';
import { KeyboardKey, Keys as KeyboardKeys } from './KeyboardKey';
import { Keys, LAPTOPX, LAPTOPY } from './Constants';
import { Laptop } from './Laptop';
import { NotePage } from './NotePage';
import { Book, BookButton } from './Book';
import { checkOverlap } from './UtilsFunctions';
export default class Level extends Phaser.Scene
{
    heldObject : Phaser.GameObjects.Container = null;
    cursorX = 0;
    cursorY = 0;
    movable = new Phaser.GameObjects.Group(this);
    debugText : Phaser.GameObjects.Text;
    laptop : Laptop;
    keyS;
    keyH;
    book : Book;
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('logo', 'assets/textures/phaser3-logo.png');
        this.load.image(Keys.Textures.NOTESHEET, 'assets/textures/NoteSheet.png');
        this.load.image(Keys.Textures.DESK, 'assets/textures/Desk.png');
        this.load.image(Keys.Textures.LAPTOP, 'assets/textures/Laptop.png');
        this.load.image(Keys.Textures.BOOKFRONT, 'assets/textures/Book-Front.png');
        this.load.image(Keys.Textures.BOOKBACK, 'assets/textures/Book-Back.png');
        this.load.image(Keys.Textures.BOOKOPEN, 'assets/textures/Book-Open.png');

        this.load.audio(Keys.Sounds.PAPERSHEET1, 'assets/sounds/paper-sheet-1.mp3');
        this.load.audio(Keys.Sounds.PAPERSHEET2, 'assets/sounds/paper-sheet-2.mp3');
        this.load.audio(Keys.Sounds.PAPERSHEET3, 'assets/sounds/paper-sheet-3.mp3');
        this.load.audio(Keys.Sounds.BACKSPACE, 'assets/sounds/backspace.mp3');
        this.load.audio(Keys.Sounds.SPACEBAR, 'assets/sounds/spacebar.mp3');
        this.load.audio(Keys.Sounds.KEYSTROKE, 'assets/sounds/keystroke.mp3');
    }

    create ()
    {

        //SoundManager.init(this, PAPERSHEET1KEY, PAPERSHEET2KEY, PAPERSHEET3KEY,BACKSPACEKEY, SPACEBARKEY, KEYSTROKEKEY);
        
        this.add.image(0, 0, Keys.Textures.DESK).setOrigin(0,0).setScale(3, 3);

        this.debugText = this.add.text(10,10, 'Debug values');

        this.physics.world.setBounds(0, 280, 960, 440);

        
        this.laptop = new Laptop(this);
        
        this.book = Book.init(this, this.movable);
        // const note = new NotePage(this, this.movable, 500, 600);
        // new NotePage(this, this.movable, -100, 0);
        // new NotePage(this, this.movable, 300, 600);
        // NotePage.create(this, this.movable, 500, 500)
        // .addText("I like apples", -70, -100);
        this.input.on('gameobjectdown', this.onGameObjectClick, this);
        this.input.on('pointerup', () => this.heldObject = null);    

        this.input.on('pointermove', this.onPointerMove, this);

        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    }
    tryMoveUp(heldObject: Phaser.GameObjects.Container)
    {
        const heldObjectIndex = this.children.getIndex(heldObject);
        for (let i = heldObjectIndex + 1; i < this.children.length; i++)
        {
            const nextObject = this.children.list[i];
            if (!this.movable.children.contains(nextObject)) continue;
            if (!checkOverlap(heldObject, nextObject as Phaser.GameObjects.Container)) 
            {
                this.children.moveBelow(nextObject, heldObject);
                console.log(`Moved ${heldObjectIndex} above ${i}`);
            }
            else return;
        }
    }
    update(time: number, delta: number): void
    {
        const pointer = this.input.activePointer;
        this.debugText.setText([
            `x: ${pointer.x}`,
            `y: ${pointer.y}`,
            `laptop-relative x: ${pointer.x - LAPTOPX}`,
            `laptop-relative y: ${pointer.y - LAPTOPY}`,
        ]);
        if (this.keyH.isDown) this.book.setVisible(false);
        if (this.keyS.isDown) this.book.setVisible(true);
    }

    private onGameObjectClick(pointer : Phaser.Input.Pointer, gameObject : Phaser.GameObjects.Container)
    {
        if (gameObject instanceof KeyboardKey)
            this.processKeyboardKey((gameObject as KeyboardKey).key)
        else if (gameObject instanceof BookButton)
            (gameObject as BookButton).onClick();
        else
            this.holdObject(pointer, gameObject);
    };

    private processKeyboardKey(input : KeyboardKeys)
    {
        switch (input)
        {
            case 'del':
                this.laptop.computerScreen.eraseCharacter();
                break;

            case 'enter':
                // TODO: validate answer
                break;

            default:
                this.laptop.computerScreen.writeCharacter(input)
                break;
            }
    }

    private holdObject(pointer : Phaser.Input.Pointer, gameObject : Phaser.GameObjects.Container)
    {
        this.heldObject = gameObject;
        this.cursorX = pointer.x;
        this.cursorY = pointer.y;
    }

    private onPointerMove(pointer : Phaser.Input.Pointer)
    {
        if (this.heldObject === null) return;

        const deltaX = pointer.x - this.cursorX;
        const deltaY = pointer.y - this.cursorY;

        this.heldObject.x += deltaX;
        this.heldObject.y += deltaY;
        this.cursorX = pointer.x;
        this.cursorY = pointer.y;
        this.tryMoveUp(this.heldObject);
    }
        
    
}
const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 960,
    height: 840,
    scene: Level,
    pixelArt: true,
    physics: {
        default: 'arcade',
    },
};

new Phaser.Game(config);