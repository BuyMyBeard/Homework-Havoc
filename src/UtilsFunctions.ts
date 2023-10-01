import * as Phaser from 'phaser';

export function checkOverlap(containerA : Phaser.GameObjects.Container, containerB : Phaser.GameObjects.Container) 
{
    var boundsA = containerA.getBounds();
    var boundsB = containerB.getBounds();
    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}