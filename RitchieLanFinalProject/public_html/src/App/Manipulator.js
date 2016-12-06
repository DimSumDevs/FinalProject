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
    
    this.mSceneNode = null;
    
    var xf = this.getXform();
    xf.setPivot(0, 0);
    
    // Create horizontal line
    var obj = new SquareRenderable(shader);   
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(2.5, 0.14);
    xf.setPosition(1.25, 0);
     
    // scale at 4
    obj = new CircleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([1, 1, 1, 1]);
    xf = obj.getXform();
    xf.setSize(0.4, 0.4); 
    xf.setPosition(2.25, 0);
}
gEngine.Core.inheritPrototype(Manipulator, SceneNode);

Manipulator.prototype.update = function () {
};

Manipulator.prototype.getRotationPoint = function () {
    return this.mRotationPoint;
};

Manipulator.prototype.getScalePoint = function () {
    return this.mScalePoint;
};

Manipulator.prototype.setSceneNode = function (obj) {
    this.mSceneNode = obj;
};

Manipulator.prototype.getSceneNode = function () {
    return this.mSceneNode;
};

Manipulator.prototype.removeSceneNode = function () {
    this.mSceneNode = null;
};

Manipulator.prototype.detectClick = function(parentMat, x, y)
{
    
    
};