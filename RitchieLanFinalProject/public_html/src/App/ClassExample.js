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
    this.rainbowMode = false;
    this.trailsMode = false;
    this.lastClickPosition = null;
    
    this.mSelectedMatrix = null;
    this.manipulatorValue = 0;
    this.scalingMode = false;
    this.lastScale = null;
    
    this.trailList = [];
    this.maxTrails = 2000;
    
    this.mSelected = null;
    this.mHighlighter = new CircleRenderable(this.mConstColorShader);
    var xf = this.mHighlighter.getXform();
    xf.setSize(1.2,1.2);
    
    
    this.mParent = new System(this.mConstColorShader, "Root", 0 , 0, [253/255, 184/255, 19/255, 0.9]);
    this.mParent.setScale(2);
    
    this.mLeftChild = new System(this.mConstColorShader, "Child 1",5,.5* Math.PI, [.8,.2,.2,1]);
    this.mLeftChild.setSpeed(2);
    var xf = this.mLeftChild.getXform();
    xf.setSize(1,1);
    this.mParent.addAsChild(this.mLeftChild);
    
    this.mTopChild = new System(this.mConstColorShader, "Child 2",3, .5* Math.PI, [.2,.2,.8,1]); 
    this.mTopChild.setSpeed(8);
    this.mLeftChild.addAsChild(this.mTopChild); 
    var xf = this.mTopChild.getXform();
    xf.setSize(.5,.5);
    
    this.mNew = new System(this.mConstColorShader, "Child 3",4.5, .5* Math.PI, [.2,.8,.2,1]); 
    this.mNew.setSpeed(-4);
    this.mLeftChild.addAsChild(this.mNew); 
    var xf = this.mNew.getXform();
    xf.setSize(.5,.5);
    
    this.mNewTwo = new System(this.mConstColorShader, "Child 3",2, .5 * Math.PI, [.5,0,.5,1]); 
    this.mNewTwo.setSpeed(-8);
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
// set color by hex
ClassExample.prototype.setColorByHex = function (hex, c) {
    var inInt = parseInt(hex.substring(1), 16);  // to get rid of "#"
    var r = (inInt >> 16) & 255;
    var g = (inInt >> 8) & 255;
    var b = inInt & 255;
    c[0] = r / 255.0;
    c[1] = g / 255.0;
    c[2] = b / 255.0;
};

ClassExample.prototype.draw = function (camera) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();
    //draw trails 
    for(var i = 0; i < this.trailList.length; i++)
    {
        this.trailList[i].draw(camera);
    }
    //draw selector
    if(this.mSelected !== null && this.mSelectedMatrix !== null)
    {
        this.mHighlighter.draw(camera, this.mSelectedMatrix);
    }
    //draw systems
    this.mParent.draw(camera);
    //draw manipulator
    if(this.mSelected !== null && this.mSelectedMatrix !== null)
    {
        this.mManipulator.draw(camera, this.mSelectedMatrix, this.mParent.rGetRealScale(this.mSelected, null));
    }
    
};

ClassExample.prototype.update = function () 
{
    
    if(this.mParent !== null)
    {
        this.mParent.update();
    }
    if(this.mSelected !== null)
    {
        this.getMatrixOfSelected();
    }
    if(this.rainbowMode)
    {
        this.mParent.rSetColorFromDistanceFromSun(null, 39);
    }
    //check if trail mode in the future
    if(this.animated && this.trailsMode)
    {
        this.mParent.rDropTrail(this.mConstColorShader, this.trailList, null);
        //remove excess trails
        if(this.trailList.length > this.maxTrails - 1)
        {
            for (var i = this.trailList.length - this.maxTrails - 1; i > 0; i--)
            {
                this.trailList.shift();
            }
        }
    }
};

ClassExample.prototype.checkClick = function(clickPos)
{
    //check for manipulator click
    if(this.mSelected !== null && this.mSelectedMatrix !== null)
    {
        if(this.mManipulator.detectClick(this.mSelectedMatrix, 
        this.mParent.rGetRealScale(this.mSelected, null), clickPos[0], clickPos[1]))
        {
            this.scalingMode = true;
            this.lastClickPosition = clickPos;
            this.lastScale = this.mParent.rGetRealScale(this.mSelected, null);
            return;
        }
    }
    this.scalingMode = false;
    this.lastScale = null;
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
        if(this.scalingMode === true)
        {
            this.scaleSelected(newPosition[0]);
        }
        else
        {
            this.setDistanceOfSelected(newPosition[0], newPosition[1]);   
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
ClassExample.prototype.setDistanceOfSelected = function(mouseX, mouseY)
{
    var parentPos = this.mParent.rGetParentPosition(this.mSelected, null);
    if(parentPos === null)
    {
        parentPos = [0,0];
    }
    var xDis = parentPos[0] - mouseX;
    var yDis = parentPos[1] - mouseY;
    var newDistance = Math.sqrt((xDis * xDis) + (yDis * yDis));
    this.mParent.rSetRealDistance(this.mSelected, null, newDistance);
    
};
ClassExample.prototype.scaleSelected = function (newX) 
{
    var mouseDifference = newX - this.lastClickPosition[0];
    this.mParent.rSetRealScale(this.mSelected, null, this.lastScale + mouseDifference / 2);
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
    this.trailList = [];
    
};
ClassExample.prototype.updateFromView = function(speed, distance, scale, planetSize, thetaInPI)
{
    if(this.mSelected !== null)
    {
        this.mSelected.setSpeed(speed);
        this.mParent.rSetRealDistance(this.mSelected, null, distance);
        if(scale > 2)
        {
            var temp = 3;
        }
        this.mParent.rSetRealScale(this.mSelected, null, scale);
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
        return this.mParent.rGetRealScale(this.mSelected, null);
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
ClassExample.prototype.getSelectedWcPos = function ()
{
    if(this.mSelectedMatrix !== null && this.mSelected !== null)
    {
        var wcPos = [this.mSelectedMatrix[12], this.mSelectedMatrix[13]];
        return wcPos;
    }
    else
    {
        return [0,0];
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
    this.mParent.rSetColorFromDistanceFromSun(null, 39);
};
ClassExample.prototype.toggleColorMode = function()
{
    this.rainbowMode = !this.rainbowMode;
    this.mParent.rResetColor();
};
ClassExample.prototype.toggleTrails = function()
{
    this.trailsMode = !this.trailsMode;
    this.trailList = [];
};