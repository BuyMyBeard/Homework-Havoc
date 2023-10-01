import * as Phaser from 'phaser';

// Not used because using the same sound restarts it and doesn't let it complete
export class SoundManager
{
    private static _instance : SoundManager = null;
    private sounds : { [key : string]: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound } = {}
    private constructor(scene : Phaser.Scene, sounds : string[])
    {
        sounds.forEach((sound) => 
        {
            this.sounds[sound] = scene.sound.add(sound);
        });
    }
    public static get instance()
    {
        return SoundManager._instance;
    }

    public static init(scene : Phaser.Scene, ...sounds : string[])
    {
        if (SoundManager.instance === null)
        {
            SoundManager._instance = new SoundManager(scene, sounds);
        }
    }
    public play(sound : string)
    {
        this.sounds[sound].play();
    }
}