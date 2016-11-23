/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, CircleRenderable, SceneNode, Face */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ClassExample() {
//    this.mSizeChange = 0.01;
//    this.mChildShouldUpdate = false;
//    this.mArmShouldRotate = false;
//    this.mHeadShouldSpin = false;
//    
//    this.vmShouldDrawControl = false;
    

    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
        
//    this.mHeadSq = new CircleRenderable(this.mConstColorShader);
//    this.mHeadSq.setColor([0.2, 1.0, 0.2, 1]);
//    this.mHeadSq.getXform().setSize(0.25, 0.25);
//    
//    this.mBlueSq = new CircleRenderable(this.mConstColorShader);
//    this.mBlueSq.setColor([0.5, 0.5, 1.0, 1]);
//    this.mBlueSq.getXform().setSize(0.25, 0.25);
//    
//    this.mRedSq =  new CircleRenderable(this.mConstColorShader);
//    this.mRedSq.setColor([1.0, 0.5, 0.5, 1]);
//    this.mRedSq.getXform().setSize(0.25, 0.25);
//
//    
//    this.mXfSq =  new CircleRenderable(this.mConstColorShader);
//    this.mXfSq.setColor([0.4, 1, 0.4, 1]);
//    this.mXfSq.getXform().setSize(0.2, 0.2);
//
    this.mParent = new SceneNode(this.mConstColorShader, "Root", true);
    this.mLeftChild = new Face(this.mConstColorShader, "LeftGen 1",
                            -4, 3);
    this.mParent.addAsChild(this.mLeftChild);
    this.mTopChild = new Face(this.mConstColorShader, "LeftGen 2",
                            -5, 5); 
    this.mLeftChild.addAsChild(this.mTopChild); 
//

//    this.mRightChild = new Face(this.mConstColorShader, "RightGen 1",
//                            2, 0);
//    this.mParent.addAsChild(this.mRightChild);  // <-- WHAT ARE WE DOING?!!



    // shapes in the parent
    var obj = new CircleRenderable(this.mConstColorShader);  // the base
    this.mParent.addToSet(obj);
    obj.setColor([0.3, 0.3, 0.9, 1]);
    var xf = obj.getXform();
    xf.setSize(2.5, 2.5);
    
    obj = new SquareRenderable(this.mConstColorShader); // The head
    this.mParent.addToSet(obj);
    obj.setColor([0.9, 0.8, 0.8, 1]);
    xf = obj.getXform();
    xf.setSize(0.5, 0.5);
    
//     obj = new CircleRenderable(this.mConstColorShader); // The head
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
//    if (this.vmShouldDrawControl) {
//        this.mHeadSq.draw(camera);
//        this.mBlueSq.draw(camera);
//        this.mRedSq.draw(camera);
//        this.mXfSq.draw(camera);
//    }
};

ClassExample.prototype.update = function () {
    
    //this.mParent.update();
    
//    if (this.mChildShouldUpdate) {
//        this.mLeftChild.update();
////        this.mRightChild.update();
//        this.mTopChild.update();
//    }
//    
//    // 1. rotate the head (middle square on body)
//    if (this.mHeadShouldSpin) {
//        var xf = this.mParent.getRenderableAt(1).getXform(); // this is the middle square
//        xf.incRotationByDegree(2);
//        var d = xf.getRotationInDegree();
//    }
//    
//    // 2. extend the lower-left hand
//    if (this.mArmShouldRotate) {
//        xf = this.leftChildXform();
//        xf.incSizeBy(this.mSizeChange);
//        if ((xf.getWidth() > 1.2) || (xf.getWidth() < 0.8))
//            this.mSizeChange = -this.mSizeChange;
//    
//        // 3. slowly rotat the top arm
//        xf = this.topChildXform();
//        xf.incRotationByDegree(-1);
//    }
};



ClassExample.prototype.leftChildXform = function () {
    return this.mLeftChild.getXform();
};

//ClassExample.prototype.rightChildXform = function () {
//    return this.mRightChild.getXform();
//};


ClassExample.prototype.topChildXform = function () {
    return this.mTopChild.getXform();
};


ClassExample.prototype.parentXform = function () {
    return this.mParent.getXform();
};