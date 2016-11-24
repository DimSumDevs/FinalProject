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
        
    this.mSelected = null;
    this.mSelectedMatrix = null;
    this.manipulatorValue = 3;
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
    
    this.mManipulator = new Manipulator(this.mConstColorShader);
    var manipulatorXform = this.mManipulator.getXform();
    manipulatorXform.setPosition(0, 0);
    
    this.mOldSizeOManipulatorForScale = manipulatorXform.getSize();
    this.mOldRotationInRad = manipulatorXform.getRotationInRad();
    
}

ClassExample.prototype.draw = function (camera) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();

    this.mParent.draw(camera);
    if(this.mSelected !== null && this.mSelectedMatrix !== null)
    {
        this.mManipulator.draw(camera, this.mSelectedMatrix);
    }
};

ClassExample.prototype.update = function () {
    
    //this.mParent.update();
    this.getMatrixOfSelected();
};

ClassExample.prototype.checkClick = function(clickPos)
{
//    this.manipulatorValue = this.mManipulator.detect(clickPos[0], clickPos[1]);
    
    if(this.manipulatorValue !== -1)
    {
        this.mSelected = null;
        //check the click, if it returns, set mSelected
        this.mSelected = this.mParent.checkClick(null, clickPos[0], clickPos[1]);
    }

};
ClassExample.prototype.manipulateSelected = function (newPosition)
{
    if(this.mSelected !== null)
    {
        switch (this.manipulatorValue)
        {
            case(2):
                //rotate selected
            case(3):
                this.setPositionOfSelected(newPosition[0], newPosition[1]);
                break;
            case(4):
                //scale selected
        }
    }
};
ClassExample.prototype.getMatrixOfSelected= function()
{
    var selectedMatrix = null;
    if(this.mSelected !== null)
    {
        selectedMatrix = this.mParent.getMatrix(this.mSelected, selectedMatrix);
    }
    this.mSelectedMatrix = selectedMatrix;
};
ClassExample.prototype.setPositionOfSelected = function(x, y)
{
    if(this.mSelected !== null)
    {
        this.mParent.setElementPosition(this.mSelected, x, y);
    }
};

ClassExample.prototype.scaleSelected = function (newX, newY) 
{
    
  

};

ClassExample.prototype.rotateSelected = function (newX, newY) 
{
    if(this.mManipulator.getSceneNode() !== null){
        var oldRotation = this.mOldRotationInRad;
        var dx = newX - this.mManipulator.getXform().getXPos();
        var dy = newY - this.mManipulator.getXform().getYPos();
        var distance = Math.sqrt(dx*dx + dy*dy);
        
        if(this.mManipulator.getXform().getXPos() < newX && 
                this.mManipulator.getXform().getYPos() < newY){
            this.mManipulator.getSceneNode().getXform().setRotationInRad(oldRotation - distance/Math.PI);
        }
        else{
            this.mManipulator.getSceneNode().getXform().setRotationInRad(oldRotation + distance/Math.PI);
        }       
    }
};

ClassExample.prototype.moveManipulator = function (wcPos) {
    var mousePos = this.mManipulator.getXform();
    mousePos.setPosition(wcPos[0], wcPos[1]);
};