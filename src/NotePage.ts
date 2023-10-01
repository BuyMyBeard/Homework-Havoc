import * as Phaser from 'phaser';
import { Keys }  from './Constants';
import Level from './game';

export class NotePage extends Phaser.GameObjects.Container
{
    constructor(scene : Phaser.Scene, movable : Phaser.GameObjects.Group, x = 0, y = 0)
    {
        super(scene, x, y);
        const sheet = new Phaser.GameObjects.Image(scene, 0, 0, Keys.Textures.NOTESHEET).setScale(7);
        this.add(sheet);
        this.setSize(sheet.displayWidth, sheet.displayHeight);
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, sheet.displayWidth, sheet.displayHeight), Phaser.Geom.Rectangle.Contains);
        movable.add(this);

        (this as any).body.setCollideWorldBounds(true);
    }

    addText(text : string | string[], x : number, y : number, fontColor = 0x333333, fontSize = 16)
    {
        this.add(new Phaser.GameObjects.Text(this.scene, x, y, text, {fontFamily: "pixel-script", fontSize: fontSize}).setTint(fontColor));
        return this;
    }
    addImage(key : string, x : number, y : number, scale = 1)
    {
        this.add(new Phaser.GameObjects.Image(this.scene, x, y, key).setScale(scale));
        return this;
    }
    static create(scene : Level, movable : Phaser.GameObjects.Group, x = 0, y = 0)
    {
        return new NotePage(scene, movable, x, y);
    }
}