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
    this.lastClickPosition = null;
    this.mSelectedMatrix = null;
    this.manipulatorValue = 0;
    
    this.mSelected = null;
    this.mHighlighter = new CircleRenderable(this.mConstColorShader);
    var xf = this.mHighlighter.getXform();
    xf.setSize(1.2,1.2);
    
    
    this.mParent = new System(this.mConstColorShader, "Root", 0 , 0);
    this.mParent.setScale(2);
    
    this.mLeftChild = new System(this.mConstColorShader, "Child 1",5,0);
    this.mLeftChild.setSpeed(2);
    this.mLeftChild.setColor([.8,.2,.2,1]);
    var xf = this.mLeftChild.getXform();
    xf.setSize(1,1);
    this.mParent.addAsChild(this.mLeftChild);
    
    this.mTopChild = new System(this.mConstColorShader, "Child 2",3, 0); 
    this.mTopChild.setSpeed(8);
    this.mTopChild.setColor([.2,.2,.8,1]);
    this.mLeftChild.addAsChild(this.mTopChild); 
    var xf = this.mTopChild.getXform();
    xf.setSize(.5,.5);
    
    this.mNew = new System(this.mConstColorShader, "Child 3",4.5, 0); 
    this.mNew.setSpeed(-4);
    this.mNew.setColor([.2,.8,.2,1]);
    this.mLeftChild.addAsChild(this.mNew); 
    var xf = this.mNew.getXform();
    xf.setSize(.5,.5);
    
    this.mNewTwo = new System(this.mConstColorShader, "Child 3",2, 0); 
    this.mNewTwo.setSpeed(-8);
    this.mNewTwo.setColor([.5,0,.5,1]);
    this.mLeftChild.addAsChild(this.mNewTwo); 
    var xf = this.mNewTwo.getXform();
    xf.setSize(.5,.5);
    
//    var theta = 0;
//    var distance = 2;
//    var speed = 1;
//    for(var i = 0; i< 10; i++)
//    {
//        this.mNew = new System(this.mConstColorShader, "child", distance, theta);
//        this.mNew.setScale(.5);
//        this.mNew.setSpeed(speed);
//        this.mNew.setColor(this.randomColor());
//        this.mParent.addAsChild(this.mNew);
//        
//        speed += .5;
//        //theta += Math.PI;
//        distance += 1;
//        //speed = 0 - speed;
//    }
    
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
    if(this.mSelected !== null)
    {
        this.getMatrixOfSelected();
    }
    this.scaleColorByDistance();
};

ClassExample.prototype.checkClick = function(clickPos)
{
    //check for manipulator click somewhere in here
    this.mSelected = this.mParent.rCheckClick(null,null, clickPos[0], clickPos[1]);
    if(this.mSelected !== null)
    {
        this.getMatrixOfSelected();
    }

};
ClassExample.prototype.manipulateSelected = function (newPosition)
{
    if(this.mSelected !== null)
    {
        //insert a check here to scale if the manipulator has been clicked
        this.setDistanceOfSelected(newPosition[0], newPosition[1]);
        
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

ClassExample.prototype.setDistanceOfSelected = function(x, y)

{
//    var selectedX = this.mSelectedMatrix[12];
//    var selectedY = this.mSelectedMatrix[13];
//    var currentDistance = Math.sqrt((selectedX * selectedX) + (selectedY * selectedY));
    var newDistance = Math.sqrt((x * x) + (y * y));
    
    this.mParent.rSetRealDistance(this.mSelected, null, newDistance);
    
};

ClassExample.prototype.scaleSelected = function (newX) 
{
    


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
ClassExample.prototype.updateFromView = function(speed, distance, scale, planetSize, thetaInPI)
{
    if(this.mSelected !== null)
    {
        this.mSelected.setSpeed(speed);
        this.mParent.rSetRealDistance(this.mSelected, null, distance);
        this.mSelected.setScale(scale);
        this.mSelected.setInitialTheta(thetaInPI * Math.PI);
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
   {
       return this.mParent.rGetRealDistance(this.mSelected, null, null);
   }
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
ClassExample.prototype.getSelectedThetaInPI = function()
{
    if(this.mSelected !== null)
    {
        return this.mSelected.getInitialTheta() / Math.PI;
    }
};
ClassExample.prototype.addChildToSelected = function()
{
    if(this.mSelected !== null)
    {
        this.mSelected.addChild(this.mConstColorShader, this.randomColor());
    }
};
ClassExample.prototype.randomColor = function()
{
    return [Math.random(), Math.random(), Math.random(), 1];
};
ClassExample.prototype.scaleColorByDistance = function()
{
    this.mParent.rSetColorFromDistanceFromSun(null, 21);
};
