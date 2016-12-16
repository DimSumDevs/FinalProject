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

};
//SceneNode.prototype.checkClick = function (parentMat, parentScale, x ,y)
//{
//    var xfMat = this.mXform.getXform();
//    if(parentMat !== null)
//    {
//        mat4.multiply(xfMat, parentMat, xfMat);
//    }
//    var myXform = this.mXform.getXform();
//    //check if the click is on the pivot
//    
//    var myX = xfMat[12];
//    var myY = xfMat[13];
//    //compute disctance btween my X/Y and x/y
//    var xDis = myX - x;
//    var yDis = myY - y;
//    var distance = Math.sqrt((xDis * xDis) + (yDis * yDis));
//    if(distance < .1)
//    {
//        return this;
//    }
//    
////    check if the click is on an element
//    for (var i = 0; i < this.mSet.length; i++)
//    {
//        var element = this.mSet[i];
//        if(element instanceof ClickableObject)
//        {
//            if(element.checkClick(xfMat, x, y))
//            {
//                return element;
//            }
//        }
//    }
//    //check if the click is on a child
//    for (var i = 0; i < this.mChildren.length; i++)
//    {
//        var childVal = this.mChildren[i].checkClick(xfMat, x, y);
//        if(childVal !== null)
//        {
//            return childVal;
//        }
//    }
//    return null;
//    
//};
SceneNode.prototype.setElementPosition = function(object, parentMat, x ,y)
{
    var xfMat = this.mXform.getXform();
    if(parentMat !== null)
    {
        mat4.multiply(xfMat, parentMat, xfMat);
    }
    
    //check this is the element
    if(object === this)
    {
        //get the difference
        var xDif = x - xfMat[12];
        var yDif = y - xfMat[13];
        var pos = this.mXform.getPosition();
        pos[0] += xDif;
        pos[1] += yDif;
        this.mXform.setPosition(pos[0], pos[1]);
        return true;
    }
    
    //check if the click is on an element
    for (var i = 0; i < this.mSet.length; i++)
    {
        //add function to clickable object
        if(object === this.mSet[i])
        {
           this.mSet[i].setObjectPosition(xfMat, x, y);
           return true;
        }
    }
    //check if the click is on a child
    for (var i = 0; i < this.mChildren.length; i++)
    {
        if(this.mChildren[i].setElementPosition(object, xfMat, x, y))
        {
            return true;
        }
    }
    //
    return false;
};
SceneNode.prototype.getMatrix = function(object, parentMat)
{
    var xfMat = this.mXform.getXform();
    if(parentMat !== null)
    {
        mat4.multiply(xfMat, parentMat, xfMat);
    }
    //check if this is the target object
    if(this === object)
    {
        return xfMat;
    }
    
    //check if the object is an element
    for (var i = 0; i < this.mSet.length; i++)
    {
        var element = this.mSet[i];
        if(element instanceof ClickableObject)
        {
            if(element === object)
            {
                var elementM = element.getXform().getXform();
                mat4.multiply(elementM, xfMat, elementM);
                return elementM;
            }
        }
    }
    //check if object is a child
    for (var i = 0; i < this.mChildren.length; i++)
    {
        var childVal = this.mChildren[i].getMatrix(object, xfMat);
        if(childVal !== null)
        {
            return childVal;
        }
    }
    return null;
};

