
/*jslint node: true, vars: true */
/*global gEngine, Renderable */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

//TODO break clickable object into two objects clickable square that inherits from square renderable
//and clickable circle that inherits from circle renderable. then I can make a sceneNode object and 
//add clickable renderables as elements.

//constructor, checks the boolean boolCircle to determine if this should
//be a square ore circle.
function ClickableObject(shader, boolCircle, knobVisible) {
    this.knobSize = 3;
    this.knobVisible = knobVisible;
    if(boolCircle)
    {
        //this.myRenderable = new CircleRenderable(shader);
    }
    else
    {
        this.myRenderable = new SquareRenderable(shader);
    }
    //TODO change this to circle renderable
    this.myKnob = new SquareRenderable(shader);
    this.myKnob.setSize(this.knobSize, this.KnobSize);
}
ClickableObject.prototype.hideKnob = function(){this.knobVisible = false;};
ClickableObject.prototype.showKnob - function(){this.knobVisible = true;};
ClickableObject.prototype.getXform = function () { return this.myRenderable.getXform(); };
ClickableObject.prototype.setColor = function (color) { this.myRenderable.setColor(color); };
ClickableObject.prototype.getColor = function () { return this.myRenderable.getColor(); };
ClickableObject.prototype.checkClick = function (parentX, parentY, x, y)
{
    var realX = parentX + this.myRenderable.getXform().getXPos();
    var realY = parentY + this.myRenderable.getXform().getYPos();
    
    //compute disctance btween realX/Y and x/y
    var xDis = realX - x;
    var yDis = realY - y;
    var distance = Math.sqrt((xDis * xDis) + (yDis * yDis));
    
    return(distance <= this.knobSize);
};

ClickableObject.prototype.draw = function (camera, parentMat)
{
    this.myRenderable.draw(camera, parentMat);
    
     //set the postion of the knob to be equal to that of the renderable.
     var knobXform = this.myKnob.getXform();
     var renderableXform = this.myRenderable.getXform(); 
     knobXform.setPos(renderableXform.getXPos(), renderableXform.getYPos());
    
    if(this.knobVsible)
    {      
        //set color of the knob to be related to that of the renderable? maybe inverted color
        
        this.myKnob.draw(camera, parentMat);//Note that this will cause our stupid knob object 
        //to scale up as the parent transform scales up, though the click detection will not scale with it
        //so eventually we will need to find a way to keep this part of the fucking thing from changing in size,
        //maybe we can do this by understanding how kelvin did this with the pivot object in sceneNode,
         //or by understanding how the mat4 works and manually changing the size after concatinating, 
         //but before drawing.
    }
};
ClickableObject.protorype.update = function()
{
    //do animated things like spin around
};