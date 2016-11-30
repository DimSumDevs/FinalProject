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
    this.animated = false;
    this.mOldX = null;
    this.mOldY = null;
    this.mSelectedMatrix = null;
    this.manipulatorValue = 0;
    
    this.mSelected = null;
    this.mHighlighter = new CircleRenderable(this.mConstColorShader);
    var xf = this.mHighlighter.getXform();
    xf.setSize(1.2,1.2);
    
    
    this.mParent = new System(this.mConstColorShader, "Root", 0 , 0);
    this.mParent.setScale(2);
    
//    this.mLeftChild = new System(this.mConstColorShader, "Child 1",5,0);
//    this.mLeftChild.setColor([.8,.2,.2,1]);
//    var xf = this.mLeftChild.getXform();
//    xf.setSize(.5,.5);
//    this.mParent.addAsChild(this.mLeftChild);
//    
//    this.mTopChild = new System(this.mConstColorShader, "Child 2",3, 0); 
//    this.mTopChild.setSpeed(8);
//    this.mTopChild.setColor([.2,.2,.8,1]);
//    this.mLeftChild.addAsChild(this.mTopChild); 
//    var xf = this.mTopChild.getXform();
//    xf.setSize(.5,.5);
//    
//    this.mNew = new System(this.mConstColorShader, "Child 3",4.5, 0); 
//    this.mNew.setSpeed(-7);
//    this.mNew.setColor([.2,.8,.2,1]);
//    this.mLeftChild.addAsChild(this.mNew); 
//    var xf = this.mNew.getXform();
//    xf.setSize(.5,.5);
//    
//    this.mNewTwo = new System(this.mConstColorShader, "Child 3",2, 0); 
//    this.mNewTwo.setSpeed(-8);
//    this.mNewTwo.setColor([.8,.2,.8,1]);
//    this.mLeftChild.addAsChild(this.mNewTwo); 
//    var xf = this.mNewTwo.getXform();
//    xf.setSize(.5,.5);
    
    var theta = 0;
    var distance = 2;
    var speed = 1;
    for(var i = 0; i< 10; i++)
    {
        this.mNew = new System(this.mConstColorShader, "child", distance, theta);
        this.mNew.setScale(.5);
        this.mNew.setSpeed(speed);
        this.mNew.setColor(this.randomColor());
        this.mParent.addAsChild(this.mNew);
        
        speed += .5;
        //theta += Math.PI;
        distance += 1;
        //speed = 0 - speed;
    }
    
    this.mManipulator = new Manipulator(this.mConstColorShader);
    var manipulatorXform = this.mManipulator.getXform();
    manipulatorXform.setPosition(0, 0);
    
}

ClassExample.prototype.draw = function (camera) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();
    if(this.mSelected !== null && this.mSelectedMatrix !== null)
    {
        this.mHighlighter.draw(camera, this.mSelectedMatrix);
    }
    this.mParent.draw(camera);
    
//    if(this.mSelected !== null && this.mSelectedMatrix !== null)
//    {
//        this.mManipulator.draw(camera, this.mSelectedMatrix);
//    }
};

ClassExample.prototype.update = function () {
    
    if(this.mParent !== null)
    {
        this.mParent.update();
    }
    if(this.mSelected !== null)
    {
        this.getMatrixOfSelected();
    }
    
};

ClassExample.prototype.checkClick = function(clickPos)
{
    this.mSelected = this.mParent.rCheckClick(null,null, clickPos[0], clickPos[1]);
    if(this.mSelected !== null)
    {
        this.getMatrixOfSelected();
    }
//    if(this.mSelected === null)
//    {
//        this.mSelected = this.mParent.rCheckClick(null, clickPos[0], clickPos[1]);
//    }
//    this.getMatrixOfSelected();
//    if(this.mSelected !== null && this.mSelectedMatrix !== null)
//    {
//        this.manipulatorValue = this.mManipulator.detect(this.mSelectedMatrix, clickPos[0], clickPos[1]);
//    }
//    if(this.manipulatorValue === -1)
//    {
//        this.mSelected = null;
//    }

};
ClassExample.prototype.manipulateSelected = function (newPosition)
{
//    if(this.mSelected !== null)
//    {
//        switch (this.manipulatorValue)
//        {
//            case(2):
//                this.rotateSelected(newPosition[0]);
//                break;
//            case(3):
//                this.setPositionOfSelected(newPosition[0], newPosition[1]);
//                break;
//            case(4):
//                this.scaleSelected(newPosition[0]);
//                break;
//        }
//        this.mOldx = null;
//    }
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
//    if(this.mSelected !== null)
//    {
//        this.mParent.setElementPosition(this.mSelected, null, x, y);
//    }
};

ClassExample.prototype.scaleSelected = function (newX) 
{
    
//  if(this.mOldX !== null)
//      {
//          var xDif = newX - this.mOldX;
//          //hack
//          if(xDif > .05)
//          {
//              xDif = .05;
//          }
//          if(xDif < -.05)
//          {
//              xDif = -.05;
//          }
//          this.mSelected.getXform().incSizeBy(xDif);
//      }
//      this.mOldX = newX;

};

ClassExample.prototype.rotateSelected = function (newX) 
{
//      if(this.mOldX !== null)
//      {
//          var xDif = newX - this.mOldX;
//          //hack
//          if(xDif > .05)
//          {
//              xDif = .05;
//          }
//          if(xDif < -.05)
//          {
//              xDif = -.05;
//          }
//          this.mSelected.getXform().incRotationByRad(-xDif);
//      }
//      this.mOldX = newX;
};

ClassExample.prototype.moveManipulator = function (wcPos) {
    var mousePos = this.mManipulator.getXform();
    mousePos.setPosition(wcPos[0], wcPos[1]);
};

ClassExample.prototype.toggleAnimated = function()
{
    this.animated = !this.animated;
    this.mParent.rSetAnimated(this.animated);
};
ClassExample.prototype.reset= function()
{
    this.mParent.rReset();
    this.mParent.rSetAnimated(false);
    this.animated = false;
    
};
ClassExample.prototype.updateFromView = function(speed, distance, scale, planetSize)
{
    if(this.mSelected !== null)
    {
        this.mSelected.setSpeed(speed);
        //this doesn't work, need to set the real distance: this.mParent.setDistance(distance);
        this.mSelected.setScale(scale);
    }
};
ClassExample.prototype.getSelectedSpeed = function()
{
    if(this.mSelected !== null)
    {
        return this.mSelected.getSpeed();
    }
};
ClassExample.prototype.getSelectedDistance = function()
{
   if(this.mSelected !== null)
   {}
};
ClassExample.prototype.getSelectedScale = function()
{
    if(this.mSelected !== null)
    {
        return this.mSelected.getScale();
    }
};
ClassExample.prototype.getSelectedPlanetSize = function()
{
    if(this.mSelected !== null)
    {}
};
ClassExample.prototype.addChildToSelected = function()
{
    this.mSelected.addChild(this.mConstColorShader, this.randomColor());
};
ClassExample.prototype.randomColor = function()
{
    return [Math.random(), Math.random(), Math.random(), 1];
};