import * as Phaser from 'phaser';
import { Keys } from './Constants';
import { checkOverlap } from './UtilsFunctions';

export class Book extends Phaser.GameObjects.Container
{
    private static front : Book;
    private static back : Book;
    private static open : Book;
    private static currentlyActive : Book;
    private movable : Phaser.GameObjects.Group
    private constructor(scene : Phaser.Scene, movable : Phaser.GameObjects.Group, x : number, y : number, texture : string)
    {
        super(scene);

        const openBook = new Phaser.GameObjects.Image(scene, 0, 0, texture).setScale(7);
        this.add(openBook);
        this.movable = movable;
        this.setSize(openBook.displayWidth, openBook.displayHeight);
        scene.add.existing(this);
        scene.physics.world.enable(this);

        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, openBook.displayWidth, openBook.displayHeight), Phaser.Geom.Rectangle.Contains);
        movable.add(this);

        (this as any).body.setCollideWorldBounds(true);
    }
    static init(scene : Phaser.Scene, movable : Phaser.GameObjects.Group)
    {
        const open = new Book(scene, movable, 0, 0, Keys.Textures.BOOKOPEN);
        const front = new Book(scene, movable, 0, 0, Keys.Textures.BOOKFRONT);
        const back = new Book(scene, movable, 0, 0, Keys.Textures.BOOKBACK);

        Book.open = open;
        Book.front = front;
        Book.back = back;

        new BookButton(scene, front, 45,-150, 80, 300).onClick = () => console.log("open from front");

        new BookButton(scene, back, -115,-150, 80, 300).onClick = () => console.log("open from back");

        new BookButton(scene, open, 155,-150, 80, 300).onClick = () => console.log("turn pages right");

        new BookButton(scene, open, -235,-150, 80, 300).onClick = () => console.log("turn pages left");
        return open;
    }
    checkIfObstructed()
    {
        for (let i = this.scene.children.getIndex(this) + 1; i < this.scene.children.length; i++)
        {
            const next = this.scene.children.list[i];
            if (!this.movable.children.contains(next)) continue;
            if (checkOverlap(this, next as Phaser.GameObjects.Container)) return true;
        }
        return false;
    }
}

class BookPage extends Phaser.GameObjects.Container
{

}

export class BookButton extends Phaser.GameObjects.Rectangle
{
    public onClick : () => void;
    constructor(scene : Phaser.Scene, parent : Phaser.GameObjects.Container, x : number, y : number, width : number, height : number)
    {
        super(scene, x, y, width, height, 0xFF0000, .5);
        parent.add(this);
        this.setInteractive();
        this.setOrigin(0,0);
    }
}