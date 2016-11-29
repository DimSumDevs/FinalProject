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
    this.originalTheta = initialTheta;
    this.theta = initialTheta;
    this.radius = oribtDistance;
    this.animated = false;
    
    // now create the children shapes
    var obj = new CircleRenderable(shader, false);  // The planet for this system
    this.addToSet(obj);
    obj.setColor([253/255, 184/255, 19/255, 0.9]);
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

System.prototype.getColor = function(){return this.mSet[0].getColor();};
System.prototype.setColor= function (color){this.mSet[0].setColor(color);};
System.prototype.getDistance = function(){return this.radius;};
System.prototype.setDistance = function(distance){
    if(this.radius !== 0 && distance !== 0)
    {this.radius = distance;}};
System.prototype.setPlanetSize = function(size){this.mSet[0].getXform().setSize(size, size);};
System.prototype.getPlanetSize = function(){return this.mSet[0].getXform().getSize()[0];};
System.prototype.setScale = function(scale){this.mXform.setSize(scale,scale);};
System.prototype.getScale = function(){return this.mXform.getSize()[0];};
System.prototype.setAnimated = function(value){this.animated = value;};
System.prototype.getSpeed = function(){return this.speed;};
System.prototype.setSpeed = function(speed){this.speed = speed;};
System.prototype.setTheta = function(theta){this.theta = theta;};

System.prototype.addChild = function(shader, color)
{
    var newOrbitDistance = 3;
    var newSpeed = this.speed * 2;
    
        if(this.radius === 0)
    {
        newOrbitDistance = 3;
        newSpeed = 4;
    }
    var newName = "My Child";
    var newChild = new System(shader, newName, newOrbitDistance, this.originalTheta);
    newChild.setTheta(this.theta);
    newChild.setSpeed(newSpeed);
    newChild.setColor(color);
    var newScale = this.getScale();
    newChild.setScale(.5);
    newChild.setAnimated(this.animated);
    
    this.addAsChild(newChild);
    
};
System.prototype.rCheckClick = function (parentMat,parentScale, x ,y)
{
    var xfMat = this.mXform.getXform();
    var realScale = this.mXform.getSize()[0];
    
    if(parentMat !== null && parentMat !== undefined)
    {
        mat4.multiply(xfMat, parentMat, xfMat);
    }
    if(parentScale !== null)
    {
        realScale *= parentScale;
    }
    //check if the click is on this systems planet
    var planetRadius = this.mSet[0].getXform().getSize()[0];
    var myX = xfMat[12];
    var myY = xfMat[13];
    //compute disctance btween my X/Y and x/y
    var xDis = myX - x;
    var yDis = myY - y;
    var distance = Math.sqrt((xDis * xDis) + (yDis * yDis));
    if(distance < planetRadius * realScale)
    {
        return this;
    }
    //check if the click is on a child
    for (var i = 0; i < this.mChildren.length; i++)
    {
        var childVal = this.mChildren[i].rCheckClick(xfMat,realScale, x, y);
        if(childVal !== null)
        {
            return childVal;
        }
    }
    return null;  
};
SceneNode.prototype.rGetMatrix = function(object, parentMat)
{
    var xfMat = this.mXform.getXform();
    if(parentMat !== null)
    {
        mat4.multiply(xfMat, parentMat, xfMat);
    }
    //check if this is the target object
    if(this === object)
    {
        return xfMat;
    }
    //check if object is a child
    for (var i = 0; i < this.mChildren.length; i++)
    {
        var childVal = this.mChildren[i].getMatrix(object, xfMat);
        if(childVal !== null)
        {
            return childVal;
        }
    }
    return null;
};
System.prototype.rSetDistanceFromPosition = function(parentMat, x, y)
{
    
};
System.prototype.rSetAnimated = function(animated)
{
    this.animated = animated;
    for(var i = 0; i <this.mChildren.length; i ++)
    {
        this.mChildren[i].rSetAnimated(animated);
    }
};
System.prototype.rGetRealSize = function(object, parentMat)
{};
System.prototype.rSetColorFromDistanceFromSun = function (parentMat)
{};
System.prototype.rReset = function()
{
    this.theta = this.originalTheta;
    for(var i = 0; i< this.mChildren.length; i++)
    {
        this.mChildren[i].rReset();
    }
};