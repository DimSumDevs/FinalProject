/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, CircleRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Manipulator(shader) {
    SceneNode.call(this, shader, name, true);   // calling super class constructor

    var xf = this.getXform();
    xf.setPivot(0, 0);
    
    // Create horizontal line
    var obj = new SquareRenderable(shader, true);   
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(2, 0.07);
    xf.setPosition(1, 0);
 
    // Create vertical line
    obj = new SquareRenderable(shader, true); 
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.07, 2);
    xf.setPosition(0, 1);
 
    // create a red top
    obj = new ClickableObject(shader, true);  
    this.addToSet(obj);
    obj.setColor([0.7, 0.2, 0.2, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 0.2); 
    xf.setPosition(0, 2);
    
    // create a red middle
    obj = new ClickableObject(shader, true); 
    this.addToSet(obj);
    obj.setColor([0.7, 0.2, 0.2, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 0.2); 
    xf.setPosition(0, 0);
     
    // create a red right
    obj = new ClickableObject(shader, true); 
    this.addToSet(obj);
    obj.setColor([0.7, 0.2, 0.2, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 0.2); 
    xf.setPosition(2, 0);
}
gEngine.Core.inheritPrototype(Manipulator, SceneNode);

Manipulator.prototype.update = function () {
    // index-1 is the red-top
//    var xf = this.getRenderableAt(1).getXform();
//    xf.incRotationByDegree(this.mRotateRate);
//    
//    // index-4 is the blue circle
//    xf = this.getRenderableAt(4).getXform();
//    xf.incSizeBy(this.mPulseRate);
//    if (xf.getWidth() > 0.7 || xf.getWidth() < 0.4)
//        this.mPulseRate = -this.mPulseRate;
    this.mXform.incRotationByDegree(1);
};