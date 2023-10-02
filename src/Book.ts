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

    public static get pageCount()
    {
        return this.pages.length;
    }

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

        front.add(new Phaser.GameObjects.Text(scene, -65, -105, ["A Brief History", "Lesson of the", "Viridonia Kingdom"], 
        {
            align: "center",
            fontFamily: "medieval-pixel",
            fontSize: 20,
        }));
        new BookButton(scene, front, 105, 0).onClick = () => Book.turnRight();

        new BookButton(scene, back, -105, 0, true).onClick = () => Book.turnLeft();

        new BookButton(scene, open, 225, 0).onClick = () => Book.turnRight();

        new BookButton(scene, open, -225, 0, true).onClick = () => Book.turnLeft();

        Book.open.setVisible(false);
        Book.back.setVisible(false);
        Book.currentlyActive = front;
        Book.currentPage = -1;

        Book.scene = scene;

        this.generate(scene);
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
    static generate(scene : Phaser.Scene)
    {
        BookPage.create(scene)
        .addText("1", 10, 215)
        .addText("The foundation", 10, 0, 20)
        .addText("The story of the Viridonia country starts back in the year 568, when King Risocrat acquired the land from savages after the War of the Magistoul. It had been 2 years the war was raging. The savages were not as well equipped for the battlefield but would use underhanded tactics to keep their lands well protected. ",
        10, 30, 12);

        BookPage.create(scene)
        .addText("2", 165, 215)
        .addText("King Risocrat founded the city of Jerqum, and had Bobarre, the famous architect who built the Mendower Fortress, design the fortifications for the city. Bobarre designed a new type of wall that could withstand the dangerous siege machines that were invented 3 years prior by the land of Wyne.",
        10, 10, 12);

        BookPage.create(scene)
        .addText("3", 10, 215)
        .addText("By the year 574, the the city of Jerqum was fully built and fortified and could withstand the many assaults of the neighbouring countries.",
        10, 0, 12);

        BookPage.create(scene)
        .addText("4", 165, 215)
        .addText("The flourishing of the capital", 10, 0, 20)
        .addText("Viridonia, with its well fortified capital, could thrive and expand his land. By the year 600, the city of Jerqum had become a massive commercial hub, and the counties surrounding it would produce many crops with the new agricultural technology being developed.",
        10, 60, 12);

        BookPage.create(scene)
        .addText("5", 10, 215)
        .addText("The mines exploited to the north allowed the production of armaments and armor and could export it along with the crops through the Sionnis River, which bordered the city and lead to the ocean.",
        10, 0, 12);

        BookPage.create(scene)
        .addText("6", 165, 215)
        .addText("The fall of the city of Jerqum", 10, 0, 20)
        .addText("By the year 950, the city had amassed vast amounts of riches, and tensions were escalading with neighbours. The emperor from the land of Wyne felt like he was getting the short end of the stick in exporting taxes and wanted a better deal. He launched an assault in 951 against the city, but the fortifications held tight. The emperor's", 
        10, 60, 12);

        BookPage.create(scene)
        .addText("7", 10, 215)
        .addText("forces were forced to turn back while the residents were celebrating their victory.", 10, 0, 12)
        .addText("That's when the city understood what had transpired. When they opened the door to their treasury, they found an empty room and a tunnel. The assault was an elaborate ruse by the emperor to steal their riches, and his plan had succeeded.",
        10, 60, 12);

        BookPage.create(scene)
        .addText("8", 165, 215)
        .addText("Following those events, the city collapsed in an economical crisis, and by the year 954, all the aristocracy had migrated to the surrounding cities, leaving the peasant class fighting amongst themselves for scraps. It would take years before the city would recover from the crisis.",
        10, 0, 12);
    }
}

export class BookPage extends Phaser.GameObjects.Container
{
    private constructor(scene : Phaser.Scene, x : number, y : number)
    {
        super(scene);
        Book.addPage(this);
        this.setVisible(false);
        // TODO: for debug, remove for release
        this.add(new Phaser.GameObjects.Rectangle(scene, 0, 0, 2, 2, 0xFF0000, 0.5));
        this.setPosition(x, y);
    }
    addText(text : string, x : number, y : number, fontSize = 16, fontColor = 0x333333)
    {
        this.add(new Phaser.GameObjects.Text(this.scene, x, y, text, 
            {
                fontFamily: "vcr-osd-mono", 
                fontSize: fontSize,
                wordWrap: {
                    width: 180,
                    useAdvancedWrap: true,
                },
                align: "justify",
            }).setTint(fontColor));
        return this;
    }
    addImage(key : string, x : number, y : number, scale = 1)
    {
        this.add(new Phaser.GameObjects.Image(this.scene, x, y, key).setScale(scale));
        return this;
    }
    static create(scene : Phaser.Scene)
    {
        return new BookPage(scene, Book.pageCount % 2 == 1 ? 20 : -200, -125);
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