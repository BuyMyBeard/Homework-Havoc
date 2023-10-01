import * as Phaser from 'phaser';
import { Keys } from './Constants';

export class Book extends Phaser.GameObjects.Container
{
    constructor(scene : Phaser.Scene, movable : Phaser.GameObjects.Group)
    {
        super(scene);

        const openBook = new Phaser.GameObjects.Image(scene, 0, 0, Keys.Textures.BOOKOPEN).setScale(7);
        this.add(openBook);
        this.setSize(openBook.displayWidth, openBook.displayHeight);
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, openBook.displayWidth, openBook.displayHeight), Phaser.Geom.Rectangle.Contains);
        movable.add(this);

        (this as any).body.setCollideWorldBounds(true);
    }
}

export class ClosedBook extends Phaser.Physics.Arcade.Image
{
    constructor(scene : Phaser.Scene, movable : Phaser.GameObjects.Group, x : number, y : number, texture : string)
    {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.setInteractive(true);
        movable.add(this);
        this.setCollideWorldBounds(true);
    }
}