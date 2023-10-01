import * as Phaser from 'phaser';
import { Keys, LAPTOPSCALE, LAPTOPX, LAPTOPY } from './Constants';
import { KeyboardKey } from './KeyboardKey';
import { ComputerScreen } from './ComputerScreen';

export class Laptop extends Phaser.GameObjects.Container
{
    computerScreen : ComputerScreen;
    constructor(scene : Phaser.Scene, )
    {
        super(scene, LAPTOPX, LAPTOPY);
        scene.add.existing(this);
        this.computerScreen = new ComputerScreen(scene);
        this.add(new Phaser.GameObjects.Image(scene, 0, 0, Keys.Textures.LAPTOP).setScale(LAPTOPSCALE, LAPTOPSCALE));
        this.add(new KeyboardKey(scene, 'q', -150, 57, this));
        this.add(new KeyboardKey(scene, 'w', -122, 57, this));
        this.add(new KeyboardKey(scene, 'e', -94, 57, this));
        this.add(new KeyboardKey(scene, 'r', -66, 57, this));
        this.add(new KeyboardKey(scene, 't', -38, 57, this));
        this.add(new KeyboardKey(scene, 'y', -10, 57, this));
        this.add(new KeyboardKey(scene, 'u', 18, 57, this));
        this.add(new KeyboardKey(scene, 'i', 46, 57, this));
        this.add(new KeyboardKey(scene, 'o', 74, 57, this));
        this.add(new KeyboardKey(scene, 'p', 102, 57, this));
        this.add(new KeyboardKey(scene, 'del', 130, 57, this));

        this.add(new KeyboardKey(scene, 'a', -158, 78, this, 27));
        this.add(new KeyboardKey(scene, 's', -130, 78, this, 30));
        this.add(new KeyboardKey(scene, 'd', -98, 78, this));
        this.add(new KeyboardKey(scene, 'f', -70, 78, this));
        this.add(new KeyboardKey(scene, 'g', -42, 78, this, 30));
        this.add(new KeyboardKey(scene, 'h', -12, 78, this, 27));
        this.add(new KeyboardKey(scene, 'j', 17, 78, this, 30));
        this.add(new KeyboardKey(scene, 'k', 50, 78, this));
        this.add(new KeyboardKey(scene, 'l', 76, 78, this, 26));
        this.add(new KeyboardKey(scene, 'enter', 104, 78, this, 60));

        this.add(new KeyboardKey(scene, 'z', -110, 100, this, 30));
        this.add(new KeyboardKey(scene, 'x', -78, 100, this, 30));
        this.add(new KeyboardKey(scene, 'c', -46, 100, this, 29));
        this.add(new KeyboardKey(scene, 'v', -15, 100, this, 30));
        this.add(new KeyboardKey(scene, 'b', 16, 100, this, 30));
        this.add(new KeyboardKey(scene, 'n', 49, 100, this, 29));
        this.add(new KeyboardKey(scene, 'm', 80, 100, this, 30));

        this.add(new KeyboardKey(scene, ' ', -85, 120, this, 138));
    }
}