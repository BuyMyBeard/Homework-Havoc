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

    addText(text : string | string[], x : number, y : number, fontSize = 12, fontColor = 0x333333)
    {
        this.add(new Phaser.GameObjects.Text(this.scene, x, y, text, 
        {
            fontFamily: "primus-script", 
            fontSize: fontSize,
            wordWrap: {
                width: 200,
                useAdvancedWrap: true,
            },
        }).setTint(fontColor)
        .setLineSpacing(6));
        return this;
    }
    addImage(key : string, x : number, y : number, scale = 1)
    {
        this.add(new Phaser.GameObjects.Image(this.scene, x, y, key).setScale(scale));
        return this;
    }
    static create(scene : Phaser.Scene, movable : Phaser.GameObjects.Group, x = 0, y = 0)
    {
        return new NotePage(scene, movable, x, y);
    }
    static generate(scene : Phaser.Scene, movable : Phaser.GameObjects.Group)
    {
        this.create(scene, movable, 230,447)
        .addText("05/02", 80, -150)
        .addText([
        "Used a machine that could dig dirt and rocks, and powered with their technology",
        "",
        "Assault lasted 4 days"
        ], -85, -127);

        this.create(scene, movable, 229,448)
        .addText("05/02", 80, -150)
        .addText([
        "Wyne country: Samurai equipped with swords and speaking wynese",
        "",
        "Emperor in power for 25 years",
        "",
        "Wynians digged tunnel over 2 years",
        ], -85, -127);

        this.create(scene, movable, 231,449)
        .addText("02/02", 80, -150)
        .addText([
        "King Weber III (650-684) - Died from disease",
        "King Rousta (684-891) - Killed by his brother",
        "King Virife (691-740) - Brother of Rousta",
        "Queen Portagas (740-793) - longest reign",
        ], -85, -127);

        this.create(scene, movable, 230,450)
        .addText("02/02", 80, -150)
        .addText([
        "Slaves worked mines, and would often die",
        "",
        "Mostly savages from back when the country was conquered",
        "",
        "Brothels popular business, 15 in the city",
        ], -85, -127);

        this.create(scene, movable, 232,451)
        .addText("02/02", 80, -150)
        .addText([
        "Movie produced by George Sacul",
        "Portrays how peasants lived in 700 in the country",
        "",
        "Peasants lived avg of 45 years",
        "",
        "Medicine only available for aristocrats",
        ], -85, -127);

        this.create(scene, movable, 233,452)
        .addText("29/01",80, -150)
        .addText([
        "Tiortuge port",
        "",
        "Producing mostly Crops",
        "Invented crop harvester machine powered by horses",
        "",
        "Mine produced iron and sulfur",
        ], -85, -127);

        this.create(scene, movable, 228, 453)
        .addText("26/01",80, -150)
        .addText([
        "Walls protected against Fiery Dragon",
        "",
        "Bobarre born in the village of Estachio"
        ], -85, -127);

        this.create(scene, movable, 229, 454)
        .addText("26/01",80, -150)
        .addText([
        "Savage Clans Leaders:", 
        "• Groug Warq → north camp",
        "• Wrefg Youi → south camp",
        "• Jougda Veri → southeast camp",
        "• Mumi Merth → west camp",
        "",
        "Foundation day: September 24rd",
        ], -85, -127);

    }
}