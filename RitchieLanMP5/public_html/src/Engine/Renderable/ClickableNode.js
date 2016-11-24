/* File: SceneNode.js 
 *
 * Support for grouping of Renderables with custom pivot ability
 */

/*jslint node: true, vars: true */
/*global PivotedTransform, SquareRenderable  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function ClickableNode(shader, name, drawPivot) {
    this.mName = name;
    this.mSet = [];
    this.mChildren = [];
    this.mXform = new PivotedTransform();

    // this is for debugging only: for drawing the pivot position
    this.mPivotPos = null;
    if ((drawPivot !== undefined) && (drawPivot === true)) {
        this.mPivotPos = new CircleRenderable(shader);
        this.mPivotPos.setColor([1, 0, 0, 1]); // default color
        var xf = this.mPivotPos.getXform();
        xf.setSize(0.05, 0.05); // always this size
    }
}
ClickableNode.prototype.setName = function (n) { this.mName = n; };
ClickableNode.prototype.getName = function () { return this.mName; };

ClickableNode.prototype.getXform = function () { return this.mXform; };

ClickableNode.prototype.size = function () { return this.mSet.length; };

ClickableNode.prototype.getObjectAt = function (index) {
    return this.mSet[index];
};

ClickableNode.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};
ClickableNode.prototype.removeFromSet = function (obj) {
    var index = this.mSet.indexOf(obj);
    if (index > -1)
        this.mSet.splice(index, 1);
};
ClickableNode.prototype.moveToLast = function (obj) {
    this.removeFromSet(obj);
    this.addToSet(obj);
};

// support children opeations
ClickableNode.prototype.addAsChild = function (node) {
    this.mChildren.push(node);
};
ClickableNode.prototype.removeChild= function (node) {
    var index = this.mChildren.indexOf(node);
    if (index > -1)
        this.mChildren.splice(index, 1);
};
ClickableNode.prototype.getChildAt = function (index) {
    return this.mChildren[index];
};
//this function first needs to compute the x and y positions into local space
//then the coordinates will be sent down to elements of this node
//if those elements return false then call the function on children
ClickableNode.prototype.checkClick = function (x,y)
{
    //get the local space of the coordinates, for example this node could be 
    //at position 5,10 with a child at 0,0 so we need to pass 0,0 on to children
    var localX = (x - this.mXform.getXPos()) / this.mXform.getSize()[0];
    var localY = (y - this.mXform.getYPos()) / this.mXform.getSize()[1];
    
    //check if the click is on the pivot
    
    //check if the click is on an element
    for (var i = 0; i < this.mSet.length; i++)
    {
        if(this.mSet[i].checkClick(localX, localY))
        {
            return this.mSet[i];
        }
    }
    //check if the click is on a child
    for (var i = 0; i < this.mChildren.length; i++)
    {
        var childVal = this.mChildren.checkClick(localX, localY);
        if(childVal !== null)
        {
            return childVal;
        }
    }
    //
    return null;
    
};
ClickableNode.prototype.draw = function (aCamera, parentMat) {
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