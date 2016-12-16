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
//// set color by hex
ClassExample.prototype.convertColorFromHex = function (hex) {
    var inInt = parseInt(hex.substring(1), 16);  // to get rid of "#"
    var r = (inInt >> 16) & 255;
    var g = (inInt >> 8) & 255;
    var b = inInt & 255;
    var c = [0,0,0,1];
    c[0] = r / 255.0;
    c[1] = g / 255.0;
    c[2] = b / 255.0;
    return c;
};
ClassExample.prototype.convertColorToHex = function(color)
{
        var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[color.toLowerCase()] !== 'undefined')
        return colours[color.toLowerCase()];

    return false;
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
        if(this.trailList.length < this.maxTrails)
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
ClassExample.getSelectedColor = function()
{
    if(this.mSelected !== null)
    {
        return this.colorToHex(this.mSelected.getColor());
    }
};
ClassExample.prototype.addChildToSelected = function()
{
    if(this.mSelected !== null)
    {
        this.mSelected.addChild(this.mConstColorShader, this.randomColor());
    }
};
ClassExample.prototype.removeSelected = function()
{
    if(this.mSelected !== null && this.mSelected !== this.mParent)
    {
        this.mParent.rRemoveChild(this.mSelected);
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
    this.mParent.rResetTrails();
};

ClassExample.prototype.setObjColor = function(hex)
{
    if(this.mSelected !== null)
    {
        this.mSelected.setColor(this.convertColorFromHex(hex));
        this.mSelected.setInitialColor(this.convertColorFromHex(hex));
    }
};