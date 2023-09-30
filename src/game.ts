import * as Phaser from 'phaser';
import { KeyboardKey } from './LetterKey';
import { LAPTOPKEY, LAPTOPX, LAPTOPY } from './Constants';
import { Laptop } from './Laptop';
export default class Demo extends Phaser.Scene
{
    heldObject : Phaser.GameObjects.Sprite = null;
    cursorX = 0;
    cursorY = 0;
    movable : Phaser.Physics.Arcade.Group;
    text;
    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('desk', 'assets/Desk.png');
        this.load.image(LAPTOPKEY, 'assets/Laptop.png');
    }

    create ()
    {
        this.add.image(0, 0, 'desk').setOrigin(0,0).setScale(3, 3);

        const logo = this.add.image(400, 70, 'logo');


        this.text = this.add.text(10,10, 'Debug values');

        this.tweens.add({
            targets: logo,
            y: 350,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        })


        const movableBounds = new Phaser.Geom.Rectangle(0, 280, 960, 440);

        this.physics.world.setBounds(0, 280, 960, 440);

        new Laptop(this);
        // const paper = this.physics.add.sprite(500,600, 'logo')
        // .setInteractive()
        // .setCollideWorldBounds(true);

        // const paper2 = this.physics.add.sprite(500,500, 'logo')
        // .setInteractive()
        // .setCollideWorldBounds(true);
        
        this.movable = this.physics.add.group({
            key: 'logo',
            frameQuantity: 4,
            collideWorldBounds: true,
        });
        Phaser.Actions.SetXY(this.movable.getChildren(), 500, 500);
        this.movable.getChildren().forEach((object) => object.setInteractive());

        // this.physics.add.overlap(group, group, (a, b) => console.log(a, b));

        this.input.on('gameobjectdown', (pointer : Phaser.Input.Pointer, gameObject : Phaser.GameObjects.Sprite) => {
            if (gameObject instanceof KeyboardKey)
            {
                console.log((gameObject as KeyboardKey).key);
                return;
            }
            if (this.checkIfObstructed(gameObject)) return;
            this.heldObject = gameObject;
            this.children.bringToTop(gameObject);
            this.cursorX = pointer.x;
            this.cursorY = pointer.y;
        });
        this.input.on('pointerup', () => {
            this.heldObject = null;
        });

        

        this.input.on('pointermove', (pointer : Phaser.Input.Pointer) => {
            if (this.heldObject === null) return;
            const deltaX = pointer.x - this.cursorX;
            const deltaY = pointer.y - this.cursorY;
            this.heldObject.x += deltaX;
            this.heldObject.y += deltaY;
            this.cursorX = pointer.x;
            this.cursorY = pointer.y;
            // if (!this.checkIfObstructed(this.heldObject))
            //     this.children.bringToTop(this.heldObject);
        });

    }
    update(time: number, delta: number): void
    {
        const pointer = this.input.activePointer;
        this.text.setText([
            `x: ${pointer.x}`,
            `y: ${pointer.y}`,
            `laptop-relative x: ${pointer.x - LAPTOPX}`,
            `laptop-relative y: ${pointer.y - LAPTOPY}`,
        ]);
    }

    checkIfObstructed(gameObject : any)
    {
        for (let i = this.children.getIndex(gameObject) + 1; i < this.children.length; i++)
        {
            if (!this.movable.children.contains(this.children.list[i])) continue;
            if (this.checkOverlap(gameObject, this.children.list[i])) return true;
        }
        return false;
    }
    checkOverlap(spriteA : any, spriteB : any) 
    {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }

    createKeys()
    {
    }
}
const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 960,
    height: 840,
    scene: Demo,
    pixelArt: true,
    physics: {
        default: 'arcade',
    },
};

const game = new Phaser.Game(config);