/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";

function Trail(shader, posOne, posTwo, thickness, color)
{
    SquareRenderable.call(this, shader);
    this.mColor = color;
    
    //get the position
    var myX = (posTwo[0] + posOne[0]) / 2;
    var myY = (posTwo[1] + posOne[1]) / 2;
    //get the distance (length of trail)
    var xDif = posTwo[0] - posOne[0];
    var yDif = posTwo[1] - posOne[1];
    var distance = Math.sqrt((xDif * xDif) + (yDif * yDif));
    //get the rotation in radians
    var theta;
    //first check what quadrant posOne is in relation to our center (myX, myY)
    if(posOne[0] - myX >= 0)
    {
        //poseOne is in the 1st or 4th quadrant, so theta is in between - pi/2 and pi/2
        theta = Math.atan((posOne[1]- myY) / (posOne[0] - myX) );
    }
    else
    {
        //posOne is in the 2nd or third quadrant
        theta = Math.PI + Math.atan((posOne[1]- myY) / (posOne[0] - myX) );
    }
    
    //set transform values
    var xForm = this.getXform();
    xForm.setPosition(myX, myY);
    xForm.setSize(distance, thickness);
    xForm.setRotationInRad(theta);
}
gEngine.Core.inheritPrototype(Trail, SquareRenderable);