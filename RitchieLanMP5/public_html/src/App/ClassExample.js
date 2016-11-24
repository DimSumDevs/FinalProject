/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, CircleRenderable, SceneNode, Face */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ClassExample() {
    

    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
    this.mManipulator = new Manipulator(this.mConstColorShader);
    this.mManipulator.getXform().setPosition(5, 5);
        
    this.mSelected = null;
    this.mParent = new Face(this.mConstColorShader, "Root", 0 , 3);
    var xf = this.mParent.getXform();
    xf.setSize(1,1);
    xf.setRotationInRad(0);
    
    this.mLeftChild = new Face(this.mConstColorShader, "Child 1",-5, 0);
    var xf = this.mLeftChild.getXform();
    xf.setSize(1,1);

    this.mParent.addAsChild(this.mLeftChild);
    this.mTopChild = new Face(this.mConstColorShader, "Child 2",2, 1); 
    this.mLeftChild.addAsChild(this.mTopChild); 
    var xf = this.mTopChild.getXform();
    xf.setSize(1,1);


//    // shapes in the parent
//    var obj = new CircleRenderable(this.mConstColorShader);  // the base
//    this.mParent.addToSet(obj);
//    ClassExample.prototype.draw = function (camera) {
//    camera.setupViewProjection();
//
//    this.mParent.draw(camera);
//    this.mManipulator.draw(camera);
//};
    // shapes in the parent
//    var obj = new CircleRenderable(this.mConstColorShader);  // the base
//    this.mParent.addToSet(obj);
//    obj.setColor([0.3, 0.3, 0.9, 1]);
//    var xf = obj.getXform();
//    xf.setSize(2.5, 2.5);
//    
//    obj = new CircleRenderable(this.mConstColorShader); // The head
//    this.mParent.addToSet(obj);
//    obj.setColor([0.9, 0.8, 0.8, 1]);
//    xf = obj.getXform();
//    xf.setSize(0.5, 0.5);
    
}

ClassExample.prototype.toggleHeadSpin = function () {
    this.mHeadShouldSpin = !this.mHeadShouldSpin; };

ClassExample.prototype.toggleChildUpdate = function () {
    this.mChildShouldUpdate = !this.mChildShouldUpdate; };

ClassExample.prototype.toggleArmRotate = function () {
    this.mArmShouldRotate = !this.mArmShouldRotate; };

ClassExample.prototype.draw = function (camera) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();

    this.mParent.draw(camera);
    this.mManipulator.draw(camera);
};

ClassExample.prototype.update = function () {
    
    //this.mParent.update();
    this.getRealPositionOfSelected();
};



ClassExample.prototype.leftChildXform = function () {
    return this.mLeftChild.getXform();
};



ClassExample.prototype.topChildXform = function () {
    return this.mTopChild.getXform();
};


ClassExample.prototype.parentXform = function () {
    return this.mParent.getXform();
};
ClassExample.prototype.checkClick = function(clickPos)
{
    this.mSelected = null;
    //check the click, if it returns, set mSelected
    this.mSelected = this.mParent.checkClick(clickPos[0], clickPos[1]);
//    this.mSelected = this.mManipulator.checkClick(clickPos[0], clickPos[1]); 

};
ClassExample.prototype.getRealPositionOfSelected= function()
{
    //this doesn't work if object is scaled
    if(this.mSelected !== null)
    {
        var realPos = this.mParent.getRealPosition(this.mSelected);
        var realX = realPos[0];
        var realY = realPos[1];
    }
};
ClassExample.prototype.setPositionOfSelected = function(newPosition)
{
    if(this.mSelected !== null)
    {
        this.mParent.setElementPosition(this.mSelected, newPosition[0], newPosition[1]);
    }
};

ClassExample.prototype.scaleSceneNode = function (newX, newY) {
    if(this.mManipulator.getSceneNode() !== null){
        var oldSize = this.mOldSizeOManipulatorForScale;
        var dx = newX - this.mManipulator.getXform().getXPos();
        var dy = newY - this.mManipulator.getXform().getYPos();
        this.mManipulator.getSceneNode().getXform().setSize(oldSize[0] + dx, oldSize[1] + dy);
    }

};

ClassExample.prototype.rotateSceneNode = function (newX, newY) {
    if(this.mManipulator.getSceneNode() !== null){
        var oldRotation = this.mOldRotationInRad;
        
        var dx = newX - this.mManipulator.getXform().getXPos();
        var dy = newY - this.mManipulator.getXform().getYPos();
        var sqrDist = Math.sqrt(dx*dx + dy*dy);
        
        if(this.mManipulator.getXform().getXPos() < newX && 
                this.mManipulator.getXform().getYPos() < newY){
            this.mManipulator.getSceneNode().getXform().setRotationInRad(oldRotation - sqrDist/3.14);
        }
        else{
            this.mManipulator.getSceneNode().getXform().setRotationInRad(oldRotation + sqrDist/3.14);
        }       
    }
};

ClassExample.prototype.moveManipulator = function (wcPos) {
    var mousePos = this.mManipulator.getXform();
    mousePos.setPosition(wcPos[0], wcPos[1]);
};