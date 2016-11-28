/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, CircleRenderable, SceneNode, Face */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ClassExample() {
    var speed = -8;
    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
    this.animate = false;
    this.mOldX = null;
    this.mSelected = null;
    this.mSelectedMatrix = null;
    this.manipulatorValue = 0;
    
    this.mParent = new System(this.mConstColorShader, "Root", 0 , 0);
    var xf = this.mParent.getXform();
    xf.setSize(3,3);
    xf.setRotationInRad(0);
    
    this.mLeftChild = new System(this.mConstColorShader, "Child 1",5, Math.PI / 2);
//    this.mLeftChild.setAnimated(false);
    this.mLeftChild.setColor([.8,.2,.2,1]);
    var xf = this.mLeftChild.getXform();
    xf.setSize(.5,.5);

    this.mParent.addAsChild(this.mLeftChild);
    this.mTopChild = new System(this.mConstColorShader, "Child 2",3, 0); 
    this.mTopChild.setSpeed(speed);
    this.mTopChild.setColor([.2,.2,.8,1]);
    this.mLeftChild.addAsChild(this.mTopChild); 
    var xf = this.mTopChild.getXform();
    xf.setSize(.5,.5);
    
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
    
    if(this.mParent !== null)
    {
        this.mParent.update();
    }

//    this.getMatrixOfSelected();
    
};

ClassExample.prototype.checkClick = function(clickPos)
{
//    this.mOldx = null;
//    if(this.mSelected === null)
//    {
//        this.mSelected = this.mParent.checkClick(null, clickPos[0], clickPos[1]);
//    }
//    this.getMatrixOfSelected();
//    if(this.mSelected !== null && this.mSelectedMatrix !== null)
//    {
//        this.manipulatorValue = this.mManipulator.detect(this.mSelectedMatrix, clickPos[0], clickPos[1]);
//    }
//    
//    if(this.manipulatorValue === -1)
//    {
//        this.mSelected = null;
//    }

};
ClassExample.prototype.manipulateSelected = function (newPosition)
{
    if(this.mSelected !== null)
    {
        switch (this.manipulatorValue)
        {
            case(2):
                this.rotateSelected(newPosition[0]);
                break;
            case(3):
                this.setPositionOfSelected(newPosition[0], newPosition[1]);
                break;
            case(4):
                this.scaleSelected(newPosition[0]);
                break;
        }
        this.mOldx = null;
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
        this.mParent.setElementPosition(this.mSelected, null, x, y);
    }
};

ClassExample.prototype.scaleSelected = function (newX) 
{
    
  if(this.mOldX !== null)
      {
          var xDif = newX - this.mOldX;
          //hack
          if(xDif > .05)
          {
              xDif = .05;
          }
          if(xDif < -.05)
          {
              xDif = -.05;
          }
          this.mSelected.getXform().incSizeBy(xDif);
      }
      this.mOldX = newX;

};

ClassExample.prototype.rotateSelected = function (newX) 
{
      if(this.mOldX !== null)
      {
          var xDif = newX - this.mOldX;
          //hack
          if(xDif > .05)
          {
              xDif = .05;
          }
          if(xDif < -.05)
          {
              xDif = -.05;
          }
          this.mSelected.getXform().incRotationByRad(-xDif);
      }
      this.mOldX = newX;
};

ClassExample.prototype.moveManipulator = function (wcPos) {
    var mousePos = this.mManipulator.getXform();
    mousePos.setPosition(wcPos[0], wcPos[1]);
};

ClassExample.prototype.toggle = function()
{
    this.animate;
}