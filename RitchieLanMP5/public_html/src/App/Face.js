/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, CircleRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Face(shader, name, xPivot, yPivot) {
    SceneNode.call(this, shader, name, true);   // calling super class constructor

    var xf = this.getXform();
    xf.setPosition(xPivot, yPivot);
    xf.setPivot(0,0);
    
    // now create the children shapes
    var obj = new ClickableObject(shader, true);  // The another small plane
    this.addToSet(obj);
    obj.setColor([1, 1, 0, 1]);
    xf = obj.getXform();
    xf.setSize(1, 1);
    xf.setPosition(0, 0);
 
    obj = new ClickableObject(shader, true);  // The red eye right
    this.addToSet(obj);
    obj.setColor([0.7, .2, 0.2, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 0.2); // so that we can see the connecting point
    xf.setPosition(0.4, .5);
    
    obj = new ClickableObject(shader, true);  // The red eye left
    this.addToSet(obj);
    obj.setColor([0.7, 0.2, 0.2, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 0.2); // so that we can see the connecting point
    xf.setPosition(-0.4, .5);
    
    obj = new ClickableObject(shader, true); // mouth
    this.addToSet(obj);
    obj.setColor([0, 0, 1, 1]);
    xf = obj.getXform();
    xf.setSize(0.5, 0.2); // so that we can see the connecting point
    xf.setPosition(0, -0.5);
    
}
gEngine.Core.inheritPrototype(Face, SceneNode);

Face.prototype.update = function () 
{
    this.mXform.incRotationByDegree(1);
};