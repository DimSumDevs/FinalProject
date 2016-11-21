/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, CircleRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ArmSegment(shader, name, xPivot, yPivot) {
    SceneNode.call(this, shader, name, true);   // calling super class constructor

    var xf = this.getXform();
    xf.setPivot(xPivot, yPivot);
    
    // now create the children shapes
    var obj = new CircleRenderable(shader);  // The another small plane
    this.addToSet(obj);
    obj.setColor([1, 1, 0, 1]);
    xf = obj.getXform();
    xf.setSize(1, 1);
    xf.setPosition(xPivot, yPivot);
 
    obj = new CircleRenderable(shader);  // The red eye left
    this.addToSet(obj);
    obj.setColor([0.7, 0.2, 0.2, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 0.2); // so that we can see the connecting point
    xf.setPosition(0.4 + xPivot, .5 + yPivot);
    
    obj = new CircleRenderable(shader);  // The red eye right
    this.addToSet(obj);
    obj.setColor([0.7, 0.2, 0.2, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 0.2); // so that we can see the connecting point
    xf.setPosition(xPivot- 0.4, .5 + yPivot);
    
    obj = new CircleRenderable(shader);  // The mouth 
    this.addToSet(obj);
    obj.setColor([0,0,0,0]);
    xf = obj.getXform();
    xf.setSize(0.3, 0.2); // so that we can see the connecting point
    xf.setPosition(xPivot, -0.5 + yPivot);
    
//    obj = new CircleRenderable(shader); // The green base (left)
//    this.addToSet(obj);
//    obj.setColor([0, 1, 0, 1]);
//    xf = obj.getXform();
//    xf.setSize(1, 0.5); // so that we can see the connecting point
//    xf.setPosition(xPivot+0.375, yPivot+0.125);
    
//    obj = new CircleRenderable(shader); // The green base (right)
//    this.addToSet(obj);
//    obj.setColor([0, 1, 0, 1]);
//    xf = obj.getXform();
//    xf.setSize(0.85, 0.25); // so that we can see the connecting point
//    xf.setPosition(xPivot-0.375, yPivot+0.125);
    
    
    obj = new CircleRenderable(shader); // mouth
    this.addToSet(obj);
    obj.setColor([0, 0, 1, 1]);
    xf = obj.getXform();
    xf.setSize(0.5, 0.2); // so that we can see the connecting point
    xf.setPosition(xPivot, -0.5 + yPivot);
    
    this.mPulseRate = 0.005;
    this.mRotateRate = -2;
}
gEngine.Core.inheritPrototype(ArmSegment, SceneNode);

ArmSegment.prototype.update = function () {
    // index-1 is the red-top
    var xf = this.getRenderableAt(1).getXform();
    xf.incRotationByDegree(this.mRotateRate);
    
    // index-4 is the blue circle
    xf = this.getRenderableAt(4).getXform();
    xf.incSizeBy(this.mPulseRate);
    if (xf.getWidth() > 0.7 || xf.getWidth() < 0.4)
        this.mPulseRate = -this.mPulseRate;
};
