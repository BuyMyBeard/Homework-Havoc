import * as Phaser from 'phaser';

export function checkOverlap(containerA : Phaser.GameObjects.Container, containerB : Phaser.GameObjects.Container) 
{
    var boundsA = containerA.getBounds();
    var boundsB = containerB.getBounds();
    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}
export function playRandom(scene : Phaser.Scene, ...sounds : string[])
{
    const index = Math.floor(Math.random() * sounds.length);
    scene.sound.play(sounds[index]);
}