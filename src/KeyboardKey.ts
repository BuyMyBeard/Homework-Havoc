import { LETTERKEYHEIGHT, LETTERKEYWIDTH } from './Constants';
import * as Phaser from 'phaser';

export type Keys = 'q' | 'w' | 'e' | 'r' | 't' | 'y' | 'u' | 'i' | 'o' | 'p' | 'del' |
                     'a' | 's' | 'd' | 'f' | 'g' | 'h' | 'j' | 'k' | 'l' | 'enter' |
                         'z' | 'x' | 'c' | 'v' | 'b' | 'n' | 'm' | ' ';
export class KeyboardKey extends Phaser.GameObjects.Rectangle
{
    private _key : Keys;
    public get key()
    {
        return this._key;
    }
    constructor(scene : Phaser.Scene, key : Keys, x : number, y : number, 
        laptop : Phaser.GameObjects.Container, width = LETTERKEYWIDTH, height = LETTERKEYHEIGHT)
    {
        super(scene, x, y, width, height, 0xFF0000, 0);
        this._key = key;
        laptop.add(this);
        this.setInteractive();
        this.setOrigin(0,0);
    }
}