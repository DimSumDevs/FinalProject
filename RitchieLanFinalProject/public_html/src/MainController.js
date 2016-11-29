/* 
 * File: MainController.js
 * Container controller for the entire world
 */

/*jslint node: true, vars: true, bitwise: true */
/*global angular, document, ClassExample, Camera, CanvasMouseSupport */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

// Creates the "backend" logical support for appMyExample
var myModule = angular.module("appMyExample", ["CSS450Timer", "CSS450Slider", "CSS450Xform"]);

// registers the constructor for the controller
// NOTE: the constructor is only called _AFTER_ the </body> tag is encountered
//       this code does NOT run until the end of loading the HTML page
myModule.controller("MainCtrl", function ($scope) {
    // Initialize the graphics system
    gEngine.Core.initializeWebGL('GLCanvas');
    $scope.mCanvasMouse = new CanvasMouseSupport('GLCanvas');

    // Radio button selection support
    $scope.eSelection = [
        {label: "Parent"},
        {label: "LeftChild"},
        {label: "TopChild"}
//        {label: "RightChild"},
    ];

    // this is the model
    $scope.mMyWorld = new ClassExample();
//    $scope.mSelectedXform = $scope.mMyWorld.parentXform();
    $scope.mSelectedEcho = $scope.eSelection[0].label;

    $scope.mMouseOver = "Nothing";
    $scope.mLastWCPosX = 0;
    $scope.mLastWCPosY = 0;
    $scope.wcCenterX = 0;
    $scope.wcCenterY = 0;
    $scope.wcWidth = 50;
    $scope.pixelWidth = 1000;
    $scope.pixelHeight = 750;
    
    $scope.mView = new Camera(
            [$scope.wcCenterX, $scope.wcCenterY], // wc Center
            $scope.wcWidth, // wc Wdith
            [0, 0, $scope.pixelWidth, $scope.pixelHeight]);  // viewport: left, bottom, width, height

    $scope.mainTimerHandler = function () {
        // 1. update the world
        $scope.mMyWorld.update();

        // Step E: Clear the canvas
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);        // Clear the canvas
        //
        // $scope.mMyWorld.update();
        $scope.mMyWorld.draw($scope.mView);
    };

    $scope.serviceSelection = function (event) {

        var eventPixelPos = [0, 0];
        eventPixelPos[0] = $scope.mCanvasMouse.getPixelXPos(event);
        eventPixelPos[1] = $scope.mCanvasMouse.getPixelYPos(event);

        $scope.mMyWorld.checkClick($scope.pixelToWc(eventPixelPos));
    };
    $scope.pixelToWc = function (pixelPos)
    {
        //note this is hard coded for this window and coordinate system
        var wcPosition = [0, 0];
        var ratio = $scope.pixelWidth / $scope.wcWidth;
        wcPosition[0] = (pixelPos[0] - ($scope.pixelWidth / 2)) / ratio + $scope.wcCenterX;
        wcPosition[1] = ((pixelPos[1] - ($scope.pixelHeight / 2)) / ratio) + $scope.wcCenterY;

        return wcPosition;
    };

    $scope.serviceMove = function (event) {
        var pixelPos = [0, 0];
        pixelPos[0] = $scope.mCanvasMouse.getPixelXPos(event);
        pixelPos[1] = $scope.mCanvasMouse.getPixelYPos(event);
        $scope.mLastWCPosX = this.mView.mouseWCX(pixelPos[0]);
        $scope.mLastWCPosY = this.mView.mouseWCY(pixelPos[1]);


        //$scope.mMyWorld.setPositionOfSelected($scope.pixelToWc(pixelPos));
        switch (event.which) {
            case 1:
                $scope.mMyWorld.manipulateSelected($scope.pixelToWc(pixelPos));
        };
        
    //$scope.mMouseOver = $scope.mMyWorld.detectMouseOver($scope.mLastWCPosX, $scope.mLastWCPosY, (event.which === 1));

    };

    $scope.isMouseOnScaleKnob = false;
    $scope.isMouseOnRotationKnob = false;
    $scope.isMouseOnTranslationKnob = false;

    $scope.knobPos = function (event) {
        var scaleKnobIndex = $scope.mMouseOver.indexOf("Scale Knob");
        var rotationKnobIndex = $scope.mMouseOver.indexOf("Rotation Knob");

        if (scaleKnobIndex !== -1) {
            $scope.isMouseOnScaleKnob = true;
            $scope.isMouseOnRotationKnob = false;
            $scope.isMouseOnTranslationKnob = false;
        } else if (rotationKnobIndex !== -1) {
            $scope.isMouseOnScaleKnob = false;
            $scope.isMouseOnTranslationKnob = false;
            $scope.isMouseOnRotationKnob = true;
        } else {
            $scope.isMouseOnScaleKnob = false;
            $scope.isMouseOnRotationKnob = false;
            $scope.isMouseOnTranslationKnob = true;
        }
    };
    $scope.clearCanvas = function()
    {};
    $scope.toggleAnimated = function()
    {
        $scope.mMyWorld.toggleAnimated();
    };
    $scope.resetPositions = function()
    {
        $scope.mMyWorld.reset();
    };
});