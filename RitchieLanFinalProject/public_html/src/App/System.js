/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, CircleRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function System(shader, name, oribtDistance, initialTheta) {
    SceneNode.call(this, shader, name, false);   // calling super class constructor
    this.speed = 10/ oribtDistance;
    this.theta = initialTheta;
    this.radius = oribtDistance;
    this.animated = true;
    
    // now create the children shapes
    var obj = new CircleRenderable(shader, false);  // The planet for this system
    this.addToSet(obj);
    obj.setColor([1, 1, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(1, 1);
    xf.setPosition(0, 0);
    
}
gEngine.Core.inheritPrototype(System, SceneNode);

System.prototype.update = function () 
{
    //first check that theta is not 0, if it is then this system should be a star
    //if we don't do this check the star's position will continously be set to 0,0
    //if theta is 0.
    if(this.radius !== 0)
    {
        //set position based on theta and radius
        this.mXform.setXPos(this.radius * Math.cos(this.theta));
        this.mXform.setYPos(this.radius * Math.sin(this.theta));
    
        if(this.animated)
        {
            this.theta += this.speed / 100;
            if(Math.abs(this.theta) > 2 * Math.PI)
            {
                this.theta = this.theta % (2*Math.PI);
            }
        };
    }
    //update children
    for (var i = 0; i < this.mChildren.length; i++)
    {
        this.mChildren[i].update();
    }
};
System.prototype.setColor= function (color)
{
    this.mSet[0].setColor(color);
};
System.prototype.setDistance = function(distance)
{
    this.radius = distance;
};
System.prototype.setSize = function(size)
{
    this.mSet[i].getXform().setSize(size, size);
};
System.prototype.setAnimated = function(value)
{
    this.animated = value;
};
System.prototype.setSpeed = function(speed)
{
    this.speed = speed;
};
System.prototype.addChild = function(radius, theta, speed)
{
    
    
};