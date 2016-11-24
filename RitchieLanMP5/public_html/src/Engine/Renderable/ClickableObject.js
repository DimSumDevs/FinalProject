
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
function ClickableObject(shader, kVisible) {
    this.knobSize = .1;
    this.knobVisible = kVisible;
     this.myRenderable = new CircleRenderable(shader);

    this.myKnob = new CircleRenderable(shader);
    this.myKnob.setColor([1,1,1,1]);
    var knobXf = this.myKnob.getXform();
    knobXf.setSize(this.knobSize, this.knobSize);
}
ClickableObject.prototype.hideKnob = function(){this.knobVisible = false;};
ClickableObject.prototype.showKnob = function(){this.knobVisible = true;};
ClickableObject.prototype.setKnobSize = function(value)
{
  this.myKnob.setSize(value, value);
};
//set the knob size equal to that of the renderable, thus the whole object will become clickable
//note that click detection is based on a circle shape so square objects won't work precisely
//also note that if knob is visible the knob will cover the entire renderable object
ClickableObject.prototype.setKnobFullSize = function()
{
    this.myKnob.getXform().setSize(this.myRenderable.getXform().getSize()[0],
    this.myRenderable.getXform().getSize()[1]);
};
//reset knob size to 0
ClickableObject.prototype.resetKnobSize = function()
{
    this.myKnob.getXform().setSize(this.knobSize, this.KnobSize);
};
ClickableObject.prototype.getXform = function () { return this.myRenderable.getXform(); };
ClickableObject.prototype.setColor = function (color) { this.myRenderable.setColor(color); };
ClickableObject.prototype.getColor = function () { return this.myRenderable.getColor(); };
ClickableObject.prototype.checkClick = function ( x, y)
{
    var myX = this.myRenderable.getXform().getXPos();
    var myY = this.myRenderable.getXform().getYPos();
    
    //compute disctance btween my X/Y and x/y
    var xDis = myX - x;
    var yDis = myY - y;
    var distance = Math.sqrt((xDis * xDis) + (yDis * yDis));
    if(distance <= this.knobSize)
    {
        this.myKnob.setColor([0,0,0,1]);
        return true;
    }
    else
    {
        this.myKnob.setColor([1,1,1,0]);
        return false;
    }
};

ClickableObject.prototype.draw = function (camera, parentMat)
{
    this.myRenderable.draw(camera, parentMat);
    
     //set the postion of the knob to be equal to that of the renderable.
     var knobXform = this.myKnob.getXform();
     var renderableXform = this.myRenderable.getXform(); 
     knobXform.setPosition(renderableXform.getXPos(), renderableXform.getYPos());
    
    if(this.knobVisible)
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