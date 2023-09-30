import { LETTERKEYHEIGHT, LETTERKEYWIDTH } from './Constants';
import * as Phaser from 'phaser';
export class KeyboardKey extends Phaser.GameObjects.Rectangle
{
    private _key : string;
    public get key()
    {
        return this._key;
    }
    constructor(scene : Phaser.Scene, key : string, x : number, y : number, 
        laptop : Phaser.GameObjects.Container, width = LETTERKEYWIDTH, height = LETTERKEYHEIGHT)
    {
        super(scene, x, y, width, height, 0xFF0000, 0);
        this._key = key;
        laptop.add(this);
        this.setInteractive();
        this.setOrigin(0,0);
    }   
}