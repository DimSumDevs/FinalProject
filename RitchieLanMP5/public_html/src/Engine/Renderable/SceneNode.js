/* File: SceneNode.js 
 *
 * Support for grouping of Renderables with custom pivot ability
 */

/*jslint node: true, vars: true */
/*global PivotedTransform, SquareRenderable  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function SceneNode(shader, name, drawPivot) {
    this.mName = name;
    this.mSet = [];
    this.mChildren = [];
    this.mXform = new PivotedTransform();

    // this is for debugging only: for drawing the pivot position
    this.mPivotPos = null;
    if ((drawPivot !== undefined) && (drawPivot === true)) {
//        this.mPivotPos = new SquareRenderable(shader);
        this.mPivotPos = new CircleRenderable(shader);
        this.mPivotPos.setColor([1, 0, 0, 1]); // default color
        var xf = this.mPivotPos.getXform();
        xf.setSize(0.1, 0.1); // always this size
    }
}
SceneNode.prototype.setName = function (n) { this.mName = n; };
SceneNode.prototype.getName = function () { return this.mName; };
SceneNode.prototype.getXform = function () { return this.mXform; };
SceneNode.prototype.size = function () { return this.mSet.length; };
SceneNode.prototype.getRenderableAt = function (index) {
    return this.mSet[index];
};
SceneNode.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};
SceneNode.prototype.removeFromSet = function (obj) {
    var index = this.mSet.indexOf(obj);
    if (index > -1)
        this.mSet.splice(index, 1);
};
SceneNode.prototype.moveToLast = function (obj) {
    this.removeFromSet(obj);
    this.addToSet(obj);
};
SceneNode.prototype.addAsChild = function (node) {
    this.mChildren.push(node);
};
SceneNode.prototype.removeChild= function (node) {
    var index = this.mChildren.indexOf(node);
    if (index > -1)
        this.mChildren.splice(index, 1);
};
SceneNode.prototype.getChildAt = function (index) {
    return this.mChildren[index];
};
SceneNode.prototype.draw = function (aCamera, parentMat) {
    var i;
    var xfMat = this.mXform.getXform();
    if (parentMat !== undefined)
        mat4.multiply(xfMat, parentMat, xfMat);
    
    // Draw our own!
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera, xfMat); // pass to each renderable
    }
    
    // now draw the children
    for (i = 0; i < this.mChildren.length; i++) {
        this.mChildren[i].draw(aCamera, xfMat); // pass to each renderable
    }
    
    // for debugging, let's draw the pivot position
    if (this.mPivotPos !== null) {
        var pxf = this.getXform();
        var t = pxf.getPosition();
        var p = pxf.getPivot();
        var xf = this.mPivotPos.getXform();
        xf.setPosition(p[0] + t[0], p[1] + t[1]);
        this.mPivotPos.draw(aCamera, parentMat);
    }
};
SceneNode.prototype.update = function()
{
    for (var i = 0; i < this.mChildren.length; i++)
    {
        this.mChildren[i].update();
    }
};
SceneNode.prototype.checkClick = function (parentMat, x ,y)
{
    var xfMat = this.mXform.getXform();
    if(parentMat !== null)
    {
        mat4.multiply(xfMat, parentMat, xfMat);
    }
//    var local = this.wcToLocal(x,y);
    
    //check if the click is on the pivot
    
    //check if the click is on an element
    for (var i = 0; i < this.mSet.length; i++)
    {
        var element = this.mSet[i];
        if(element instanceof ClickableObject)
        {
            if(element.checkClick(xfMat, x, y))
            {
                return element;
            }
        }
    }
    //check if the click is on a child
    for (var i = 0; i < this.mChildren.length; i++)
    {
        var childVal = this.mChildren[i].checkClick(xfMat, x, y);
        if(childVal !== null)
        {
            return childVal;
        }
    }
    return null;
    
};
SceneNode.prototype.setElementPosition = function(object, x ,y)
{
    //at position 5,10 with a child at 0,0 so we need to pass 0,0 on to children
    var local = this.wcToLocal(x,y);
    //check this is the element
    if(object === this)
    {
        object.getXform().setPosition(local[0], local[1]);
        return true;
    }
    
    //check if the click is on an element
    for (var i = 0; i < this.mSet.length; i++)
    {
        if(object === this.mSet[i])
        {
           object.getXform().setPosition(local[0], local[1]);
           return true;
        }
    }
    //check if the click is on a child
    for (var i = 0; i < this.mChildren.length; i++)
    {
        if(this.mChildren[i].setElementPosition(object, local[0], local[1]))
        {
            return true;
        }
    }
    //
    return false;
};
SceneNode.prototype.getRealPosition = function(object)
{
    //this doesn;t work right now if scaling has happened
    var position = [0,0];
    //check if the xform belongs to this
    if(object === this)
    {
        position[0] = object.getXform().getXPos();
        position[1] = object.getXform().getYPos();
        return position;
    }
    
    //check if it belongs to an element
    for (var i = 0; i < this.mSet.length; i ++)
    {
        if(object === this.mSet[i])
        {
            position[0] = object.getXform().getXPos();
            position[1] = object.getXform().getYPos();
            return position;
        }
    }
    //check if it belongs to a child
    for (var i = 0; i < this.mChildren.length; i ++)
    {
        //this wont work for multiple children
        return this.mChildren[i].getRealPosition(object);
    }
    //Xform did not belong to this, or any elements of mSet, and there are no children
    return null;
};
SceneNode.prototype.wcToLocal = function(wcX, wcY)
{
    var localCoordinates = [0,0];
    var xPos = this.mXform.getXPos();
    var yPos = this.mXform.getYPos();
    //at position 5,10 with a child at 0,0 so we need to pass 0,0 on to children
    var x = (wcX - this.mXform.getXPos()) / this.mXform.getSize()[0];
    var y  = (wcY - this.mXform.getYPos()) / this.mXform.getSize()[1];
    
    localCoordinates[0] = x;
    localCoordinates[1] = y;
    
    //this is not working when the thing is rotated
//    var xDis = x - this.mXform.getPivotXPos();
//    var yDis = y - this.mXform.getPivotYPos();
//    
//    var radius = Math.sqrt( (xDis * xDis) + (yDis * yDis));
//    var thetaX = Math.acos(xDis/ radius) + this.mXform.getRotationInRad();
//    var thetaY = Math.asin(yDis / radius) + this.mXform.getRotationInRad();
//    
//    localCoordinates[0] = radius* Math.cos(thetaX);
//    localCoordinates[1] = radius* Math.sin(thetaY);
    return localCoordinates;
};
SceneNode.prototype.findObject = function (object, mat4)
{
    //concatinate mat4 into local space
    mat4.multiply(mat4, mat4, this.mXform.getXform());
    //check for target object
       if(object === this)
    {
        return true;
    }
    
    //check elements
    for (var i = 0; i < this.mSet.length; i++)
    {
        if(object == this.mSet[i])
        {
           return true;
        }
    }
    //check children
    for (var i = 0; i < this.mChildren.length; i++)
    {
        var result = this.mChildren[i].findXform(object, mat4);
        if(result === true)
        {
            return true;
        }
    }
    return false;
    
};