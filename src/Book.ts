import * as Phaser from 'phaser';
import { Keys } from './Constants';
import { checkOverlap, playRandom } from './UtilsFunctions';

export class Book extends Phaser.GameObjects.Container
{
    static front : Book;
    static back : Book;
    static open : Book;
    private static currentlyActive : Book;
    // Page displayed on left. -1 is closed, and showing front
    private static currentPage = -1;
    private movable : Phaser.GameObjects.Group
    private static pages : BookPage[] = [];
    private static scene : Phaser.Scene;
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

        front.add(new Phaser.GameObjects.Text(scene, -65, -105, ["A brief history", "of Viridonia"], 
        {
            align: "center",
            fontFamily: "medieval-pixel",
            fontSize: 24,
        }));
        new BookButton(scene, front, 105, 0).onClick = () => Book.turnRight();

        new BookButton(scene, back, -105, 0, true).onClick = () => Book.turnLeft();

        new BookButton(scene, open, 225, 0).onClick = () => Book.turnRight();

        new BookButton(scene, open, -225, 0, true).onClick = () => Book.turnLeft();

        Book.open.setVisible(false);
        Book.back.setVisible(false);
        Book.currentlyActive = front;
        Book.currentPage = -1

        Book.scene = scene;
    }
    static turnLeft()
    {
        if (Book.currentlyActive.checkIfObstructed()) return;

        const prevLeft = Book.getPage(this.currentPage);
        const prevRight = Book.getPage(this.currentPage + 1);

        if (prevLeft !== undefined)
        {
            prevLeft.setVisible(false);
        }
        else
        {
            Book.back.setVisible(false);
            Book.open.setVisible(true);
            Book.currentlyActive = Book.open;
            Book.open.setPosition(Book.back.x, Book.back.y);
            Book.scene.children.bringToTop(Book.currentlyActive);
        }
        if (prevRight !== undefined)
            prevRight.setVisible(false);

        Book.currentPage -= 2;
        const currentLeft = Book.getPage(this.currentPage);
        const currentRight = Book.getPage(this.currentPage + 1);

        if (currentLeft !== undefined)
        {
            currentLeft.setVisible(true);
            playRandom(Book.scene, Keys.Sounds.PAGETURN1, Keys.Sounds.PAGETURN2, Keys.Sounds.PAGETURN3)
        }
        else
        {
            Book.front.setVisible(true);
            Book.open.setVisible(false);
            Book.front.setPosition(Book.open.x, Book.open.y);
            Book.currentlyActive = Book.front;
            Book.scene.children.bringToTop(Book.currentlyActive);
            playRandom(Book.scene, Keys.Sounds.BOOKCLOSE1, Keys.Sounds.BOOKCLOSE2);
        }
        if (currentRight !== undefined)
            currentRight.setVisible(true);
    }
    static turnRight()
    {
        if (Book.currentlyActive.checkIfObstructed()) return;

        const prevLeft = Book.getPage(this.currentPage);
        const prevRight = Book.getPage(this.currentPage + 1);

        if (prevLeft !== undefined)
        {
            prevLeft.setVisible(false);
        }
        else
        {
            Book.front.setVisible(false);
            Book.open.setVisible(true);
            Book.open.setPosition(Book.front.x, Book.front.y);
            Book.currentlyActive = Book.open;
            Book.scene.children.bringToTop(Book.currentlyActive);
        }
        if (prevRight !== undefined)
            prevRight.setVisible(false);

        Book.currentPage += 2;
        const currentLeft = Book.getPage(this.currentPage);
        const currentRight = Book.getPage(this.currentPage + 1);

        if (currentLeft !== undefined)
        {
            currentLeft.setVisible(true);
            playRandom(Book.scene, Keys.Sounds.PAGETURN1, Keys.Sounds.PAGETURN2, Keys.Sounds.PAGETURN3)
        }
        else
        {
            Book.back.setVisible(true);
            Book.open.setVisible(false);
            Book.back.setPosition(Book.open.x, Book.open.y);
            Book.currentlyActive = Book.back;
            Book.scene.children.bringToTop(Book.currentlyActive);
            playRandom(Book.scene, Keys.Sounds.BOOKCLOSE1, Keys.Sounds.BOOKCLOSE2);
        }
        if (currentRight !== undefined)
            currentRight.setVisible(true);
    }

    static getPage(pageNumber : number)
    {
        return Book.pages[pageNumber - 1];
    }

    static addPage(page : BookPage)
    {
        Book.pages.push(page);
        this.open.add(page);
        if (Book.pages.length % 2 === 1)
            page.setX(-125);
        else
            page.setX(125);
    }
    checkIfObstructed()
    {
        for (let i = this.scene.children.getIndex(this) + 1; i < this.scene.children.length; i++)
        {
            const next = this.scene.children.list[i] as Phaser.GameObjects.Container;
            if (!this.movable.children.contains(next)) continue;
            if (next.visible && checkOverlap(this, next)) return true;
        }
        return false;
    }
}

export class BookPage extends Phaser.GameObjects.Container
{
    constructor(scene : Phaser.Scene)
    {
        super(scene);
        Book.addPage(this);
        this.setVisible(false);
    }
    addText(text : string, x : number, y : number, fontColor = 0x333333, fontSize = 16)
    {
        this.add(new Phaser.GameObjects.Text(this.scene, x, y, text, {fontFamily: "vcr-osd-mono", fontSize: fontSize}).setTint(fontColor));
        return this;
    }
    addImage(key : string, x : number, y : number, scale = 1)
    {
        this.add(new Phaser.GameObjects.Image(this.scene, x, y, key).setScale(scale));
        return this;
    }
    static create(scene : Phaser.Scene)
    {
        return new BookPage(scene);
    }
}

export class BookButton extends Phaser.GameObjects.Image
{
    public onClick : () => void;
    constructor(scene : Phaser.Scene, parent : Phaser.GameObjects.Container, x : number, y : number, flipped = false)
    {
        super(scene, x, y, Keys.Textures.BOOKBUTTON);
        parent.add(this);
        if (flipped) this.flipX = true;
        this.setScale(7).setInteractive();
        this.on('pointerover', () => this.setScale(8));
        this.on('pointerout', () => this.setScale(7));
    }
    
}