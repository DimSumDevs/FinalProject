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

    // this is the model
    $scope.mMyWorld = new ClassExample();

    //variables for the selected object
    $scope.selectedSpeed;
    $scope.selectedScale;
    $scope.selectedPlanetSize;
    $scope.selectedOrbitDistance;
    $scope.selectedTheta;
    
    $scope.wcCenterX = 0;
    $scope.wcCenterY = 0;
    $scope.wcWidth = 100;
    $scope.pixelWidth = 1000;
    $scope.pixelHeight = 750;
    
    $scope.mSmallViewWCWidth = 200;
    $scope.mSmallViewport = [100, 200, 200, 200];
    $scope.mSmallViewWCCenter = [500, 400];
    
    $scope.mView = new Camera(
            [$scope.wcCenterX, $scope.wcCenterY], // wc Center
            $scope.wcWidth, // wc Wdith
            [0, 0, $scope.pixelWidth, $scope.pixelHeight]);  // viewport: left, bottom, width, height

    $scope.setSmallViewWC = function () {
        $scope.mSmallView.setWCWidth(parseInt($scope.mSmallViewWCWidth));
    };

    $scope.setSmallViewWCCenter = function () {
        $scope.mSmallView.setWCCenter(
            parseInt($scope.mSmallViewWCCenter[0]),
            parseInt($scope.mSmallViewWCCenter[1])
        );
    };
    
    $scope.mSmallView = new Camera(
                [0, 0],// wc Center
                10, // wc width
                [0, 600, 150, 150]);    // viewport: left, bottom, width, height
    $scope.mSmallView.setBackgroundColor([0, 0, 0, 0.4]);


    $scope.mainTimerHandler = function () {
        // 1. update the world
        $scope.updateModelFromView();
        $scope.mMyWorld.update();
        $scope.updateViewFromModel();
        // Step E: Clear the canvas
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);        // Clear the canvas
        //
        // $scope.mMyWorld.update();
        $scope.mMyWorld.draw($scope.mView);
        $scope.mMyWorld.draw($scope.mSmallView);
    };

    $scope.serviceSelection = function (event) {

        var eventPixelPos = [0, 0];
        eventPixelPos[0] = $scope.mCanvasMouse.getPixelXPos(event);
        eventPixelPos[1] = $scope.mCanvasMouse.getPixelYPos(event);

        $scope.mMyWorld.checkClick($scope.pixelToWc(eventPixelPos));
        $scope.updateViewFromModel();
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
       
        switch (event.which) {
            case 1:
                $scope.mMyWorld.manipulateSelected($scope.pixelToWc(pixelPos));
        };
        $scope.updateViewFromModel();
    };
    $scope.updateModelFromView = function()
    {
        this.mMyWorld.updateFromView($scope.selectedSpeed, $scope.selectedOrbitDistance, 
        $scope.selectedScale, $scope.selectedPlanetSize, $scope.selectedTheta);
    };
    $scope.updateViewFromModel = function()
    {
        $scope.selectedSpeed = $scope.mMyWorld.getSelectedSpeed();
        $scope.selectedScale = $scope.mMyWorld.getSelectedScale();
        $scope.selectedPlanetSize;
        $scope.selectedOrbitDistance = $scope.mMyWorld.getSelectedDistance();
        $scope.selectedTheta = $scope.mMyWorld.getSelectedThetaInPI();
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
    $scope.addChildSystem = function()
    {
        this.mMyWorld.addChildToSelected();
    };
});