/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, CircleRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Manipulator(shader) {
    SceneNode.call(this, shader, name, false);   // calling super class constructor
    
    this.manipulatorScale = .4;
    this.minScale = 2;
    
    var xf = this.getXform();
    xf.setPivot(0, 0);
    
    // Create horizontal line
    var obj = new SquareRenderable(shader);   
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(2.5, 0.14);
    xf.setPosition(1.25, 0);
     
    // create the circle manipulator
    obj = new CircleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([1, 1, 1, 1]);
    xf = obj.getXform();
    xf.setSize(this.manipulatorScale, this.manipulatorScale); 
    xf.setPosition(2.25, 0);
}
gEngine.Core.inheritPrototype(Manipulator, SceneNode);

Manipulator.prototype.update = function () {
};
Manipulator.prototype.detectClick = function(parentMat, parentScale, x, y)
{
    //this code will prevent the real scale of the manipulator from going below 
    //min scale. there is no upper limit though
    var myScale = 1;
    if(parentScale <= this.minScale)
    {
        myScale = this.minScale / parentScale;
    }
    this.mXform.setSize(myScale, myScale);
    
    myScale *= parentScale;
    var xfMat = this.getXform().getXform();
    var childMat = this.mSet[1].getXform().getXform();
    if(parentMat !== null)
    {
        mat4.multiply(xfMat, parentMat, xfMat);
    }
    mat4.multiply(childMat, xfMat, childMat);
    var xDis = childMat[12] - x;
    var yDis = childMat[13] - y;
    var distance = Math.sqrt((xDis * xDis) + (yDis * yDis));
    
    if(distance <= myScale * this.manipulatorScale)
    {
        return true;
    }
    else
    {
        return false;
    }
    
};
Manipulator.prototype.draw = function(aCamera, parentMat, parentScale)
{
    //this code will prevent the real scale of the manipulator from going below 
    //min scale. there is no upper limit though
    var myScale = 1;
    if(parentScale <= this.minScale)
    {
        myScale = this.minScale / parentScale;
    }
    this.mXform.setSize(myScale, myScale);
    
    var i;
    var xfMat = this.mXform.getXform();
    if (parentMat !== undefined)
    {
        mat4.multiply(xfMat, parentMat, xfMat);
    }
    
    // Draw our own!
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera, xfMat); // pass to each renderable
    }
    
    // now draw the children
    for (i = 0; i < this.mChildren.length; i++) {
        this.mChildren[i].draw(aCamera, xfMat); // pass to each renderable
    }
};