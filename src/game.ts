import * as Phaser from 'phaser';
export default class Demo extends Phaser.Scene
{
    heldObject : Phaser.GameObjects.Sprite = null;
    cursorX = 0;
    cursorY = 0;
    group : Phaser.GameObjects.Group;
    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('libs', 'assets/libs.png');
        this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create ()
    {
        this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

        this.add.shader('Plasma', 0, 412, 800, 172).setOrigin(0);

        this.add.image(400, 300, 'libs');

        const logo = this.add.image(400, 70, 'logo');

        this.tweens.add({
            targets: logo,
            y: 350,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        })
        
        this.group = this.add.group([
            this.physics.add.sprite(100,100, 'logo')
        .setInteractive()
        .setCollideWorldBounds(true),
            this.physics.add.sprite(200,200, 'logo')
        .setInteractive()
        .setCollideWorldBounds(true),
        ]);

        // this.physics.add.overlap(group, group, (a, b) => console.log(a, b));

        this.input.on('gameobjectdown', (pointer : Phaser.Input.Pointer, gameObject : Phaser.GameObjects.Sprite) => {
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
        });

    }
    update(time: number, delta: number): void
    {
        
    }

    checkIfObstructed(gameObject : any)
    {
        for (let i = this.children.getIndex(gameObject) + 1; i < this.children.length; i++)
        {
            if (!this.group.children.contains(this.children.list[i])) continue;
            if (this.checkOverlap(gameObject, this.children.list[i])) return true;
        }
        return false;
    }
    checkOverlap(spriteA : any, spriteB : any) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: Demo,
    physics: {
        default: 'arcade',
    },
};

const game = new Phaser.Game(config);