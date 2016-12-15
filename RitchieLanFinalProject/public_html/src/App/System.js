/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, CircleRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
function System(shader, name, oribtDistance, initialTheta, initialColor) {
    SceneNode.call(this, shader, name, false);   // calling super class constructor
    this.speed = 10/ oribtDistance;
    this.originalTheta = initialTheta;
    this.theta = initialTheta;
    this.radius = oribtDistance;
    this.animated = false;
    this.originalColor = initialColor;
    this.lastTrail = null;
    this.trailThreshhold = 1;
    
    // now create the children shapes
    var obj = new CircleRenderable(shader, false);  // The planet for this system
    this.addToSet(obj);
    obj.setColor(initialColor);
//    obj.setColorByHex(initialColor, obj.getColor());
    var xf = obj.getXform();
    xf.setSize(1, 1);
    xf.setPosition(0, 0);
    
    this.objColor = obj;
    
}

//System.prototype.setColorByHex = function (hex, c) {
//    var inInt = parseInt(hex.substring(1), 16);  // to get rid of "#"
//    var r = (inInt >> 16) & 255;
//    var g = (inInt >> 8) & 255;
//    var b = inInt & 255;
//    c[0] = r / 255.0;
//    c[1] = g / 255.0;
//    c[2] = b / 255.0;
//};

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
System.prototype.getInitialTheta = function(){return this.originalTheta;};
System.prototype.setInitialColor = function(color){this.originalColor = color;};
System.prototype.resetColor = function(){this.mSet[0].setColor(this.originalColor);};
System.prototype.setInitialTheta = function(theta){
    this.originalTheta = theta;
    
};

System.prototype.addChild = function(shader, color)
{
    // set a default orbit distance
    var newOrbitDistance = 3;
    var newSpeed = this.speed * 2;
    //Check if this is the sun / parent
    if(this.radius === 0)
    {
        newSpeed = 4;
    }
    //create new child object
    var newName = "My Child";
    var newChild = new System(shader, newName, newOrbitDistance, this.originalTheta, color);
    
    //Check if this object has other children, if so model the new child after the
    //last child added
    if(this.mChildren.length > 0)
    {
        var lastChild = this.mChildren[this.mChildren.length - 1];
        newChild.setSpeed(lastChild.getSpeed());
        newChild.setScale(lastChild.getScale());
        newChild.setDistance(lastChild.getDistance());
    }
    else
    {
        newChild.setSpeed(newSpeed);
        newChild.setScale(1);
    }
    newChild.setTheta(this.originalTheta);
    newChild.setAnimated(this.animated);
    newChild.setColor(color);
    
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
System.prototype.rGetMatrix = function(object, parentMat)
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
System.prototype.rGetParentPosition = function(object, parentMat)
{
    //concatinate matrices
    var xfMat = this.mXform.getXform();
    if(parentMat !== null)
    {
        mat4.multiply(xfMat, parentMat, xfMat);
    }
    //check if the object is a child, if so return this position
    for (var i = 0; i< this.mChildren.length; i++)
    {
        if(this.mChildren[i] === object )
        {
            var position = [xfMat[12],xfMat[13]];
            return position;
        }
    }
    //recursive call on children
    for(var i = 0; i < this.mChildren.length; i++)
    {
        var position = this.mChildren[i].rGetParentPosition(object, xfMat); 
        if(position !== null)
        {
            return position;
        }
    }
    return null;
    
};
System.prototype.rGetRealDistance = function(object, parentScale)
{
    var myScale = this.mXform.getSize()[0];
    if(parentScale !== null)
    {
        myScale *= parentScale;
        if(this === object)
        {
            return this.radius * parentScale;
        }
    }
    //check if the selected object is a child
    for (var i = 0; i < this.mChildren.length; i++)
    {
        var childVal = this.mChildren[i].rGetRealDistance(object, myScale);
        if(childVal !== 0)
        {
            return childVal;
        }
    }
    return 0;  
};
System.prototype.rSetRealDistance = function(object, parentScale, distance)
{
    var myScale = this.mXform.getSize()[0];
    if(parentScale !== null)
    {
        myScale *= parentScale;
        if(this === object)
        {
            this.setDistance(distance / parentScale);
            return true ;
        }
    }
    //check if the selected object is a child
    for (var i = 0; i < this.mChildren.length; i++)
    {
        var childVal = this.mChildren[i].rSetRealDistance(object, myScale, distance);
        if(childVal)
        {
            return true;
        }
    }
    return false;  
};
System.prototype.rSetAnimated = function(animated)
{
    this.animated = animated;
    for(var i = 0; i <this.mChildren.length; i ++)
    {
        this.mChildren[i].rSetAnimated(animated);
    }
};
System.prototype.rGetRealScale = function(object, parentScale)
{
    var myScale = this.mXform.getSize()[0];
    if(parentScale !== null)
    {
        myScale *= parentScale;
    }
    if(object === this)
    {
        return myScale;
    }
    
    for(var i = 0; i< this.mChildren.length; i++)
    {
        var result = this.mChildren[i].rGetRealScale(object, myScale);
        if(result !== null)
        {
            return result;
        }
    }
    return null;
};
System.prototype.rSetRealScale = function(object, parentScale, newScale)
{
    var myScale = this.mXform.getSize()[0];
    if(parentScale === null)
    {
        parentScale = 1;
    }
    else
    {
        myScale *= parentScale;
    }
    if(object === this)
    {
        this.setScale(newScale / parentScale);
        return;
    }
    
    for(var i = 0; i< this.mChildren.length; i++)
    {
       this.mChildren[i].rSetRealScale(object, myScale, newScale);
    }
};
System.prototype.rSetColorFromDistanceFromSun = function (parentMat, maxDistance)
{
    //make sure the max idstance is divisible by 3
    if(maxDistance % 3 !== 0)
    {
        maxDistance -= (maxDistance % 3);
    }
    var xfMat = this.mXform.getXform();
    if(parentMat !== null && parentMat !== undefined)
    {
        mat4.multiply(xfMat, parentMat, xfMat);
        
        var xDis = xfMat[12];
        var yDis = xfMat[13];
        var distance = Math.sqrt((xDis * xDis) + (yDis * yDis));
    
        var section = (maxDistance / 6);    
        var redVal = 0;
        var greenVal = 0;
        var blueVal = 0;
        if(distance < (section * 1))
        {
            redVal = 1;
            greenVal = (distance % section) / section;
        }
        else if(distance < (section * 2))
        {
            greenVal = 1;
            redVal = 1 - (distance % section) / section;
        }
        else if(distance < (section * 3))
        {
            greenVal = 1;
            blueVal = (distance % section) / section;
        }
        else if(distance < (section * 4))
        {
            blueVal = 1;
            greenVal = 1 - (distance % section) / section;
        }
        else if(distance < (section * 5))
        {
            blueVal = 1;
            redVal = (distance % section) / section;
        }
        else if(distance < (section * 6))
        {
            redVal = 1;
            blueVal = 1 - (distance % section) / section;
        }
        else
        {
            redVal = 1;
        }
        this.setColor([redVal, greenVal, blueVal, 1]);
    }
    
    for(var i = 0; i <this.mChildren.length; i ++)
    {
        this.mChildren[i].rSetColorFromDistanceFromSun(xfMat, maxDistance);
    }
};
System.prototype.rReset = function()
{
    this.theta = this.originalTheta;
    this.lastTrail = null;
    for(var i = 0; i< this.mChildren.length; i++)
    {
        this.mChildren[i].rReset();
    }
};
System.prototype.rResetColor = function()
{
    this.resetColor();
    for(var i = 0; i< this.mChildren.length; i++)
    {
        this.mChildren[i].rResetColor();
    }
};
System.prototype.rDropTrail = function(shader, trailList, parentMat)
{
    var xfMat = this.mXform.getXform();
    if(parentMat !== null)
    {
        mat4.multiply(xfMat, parentMat, xfMat);
        
        //check if there is a last recorded position
        if(this.lastTrail !== null)
        {
            //check distance between current position and last position
            var xDis = xfMat[12] - this.lastTrail[0];
            var yDis = xfMat[13] - this.lastTrail[1];
            var distance = Math.sqrt((xDis * xDis) + (yDis * yDis));
            if(distance >= this.trailThreshhold)
            {
                var trail = new Trail(shader, [this.lastTrail[0],this.lastTrail[1]]
                , [xfMat[12],xfMat[13]], .5, this.getColor());
                this.lastTrail = [xfMat[12], xfMat[13]];
                trailList.push(trail);
            }
        }
        else
        {
            this.lastTrail = [xfMat[12], xfMat[13]];;
        }
    }
    
    //recurse to children
    for(var i = 0; i< this.mChildren.length; i++)
    {
        this.mChildren[i].rDropTrail(shader, trailList, xfMat);
    }
};
System.prototype.rRemoveChild = function(object)
{
    //check if the object to remove is a child, if so remove that child
    //this will prevent the sun from ever being removed
    for (var i = 0; i < this.mChildren.length; i ++)
    {
        if(this.mChildren[i] === object)
        {
            this.mChildren.splice(i, 1);
            return;
        }
        this.mChildren[i].rRemoveChild(object);
    }
};
