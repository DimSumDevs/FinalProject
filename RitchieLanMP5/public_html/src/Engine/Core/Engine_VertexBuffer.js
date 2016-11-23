/*
 * File: EngineCore_VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 * 
 * Notice, this is a singleton object.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Float32Array: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

// The VertexBuffer object
gEngine.VertexBuffer = (function () {
    // reference to the vertex positions for the square in the gl context
    var mSquareVertexBuffer = null;
    var mCircleVertexBuffer = null;

    // First: define the vertices for a square
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
  
    var kCircleVertices = 50;
    var computeCircleVertices = function (v) {
        var theta = 2 * Math.PI / kCircleVertices;
        var i, x, y, offset = 3;
        v[0] = 0; v[1] = 0; v[2] = 0;
        for (i = 0; i < kCircleVertices; i++) {
            x = Math.cos(i * theta);
            y = Math.sin(i * theta);
            v[offset] = x; offset++;
            v[offset] = y; offset++;
            v[offset] = 0; offset++;
        }
        v[offset] = Math.cos(0); offset++;
        v[offset] = Math.sin(0); offset++;
        v[offset] = 0.0;
    };

    var initialize = function () {
        var gl = gEngine.Core.getGL();

        // Step A: Create a buffer on the gGL context for our vertex positions
        mSquareVertexBuffer = gl.createBuffer();
        // Step B: Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);
        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);
        
        
        // now do circle
        var v = [];
        computeCircleVertices(v);
        mCircleVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mCircleVertexBuffer);
        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
    };

    var getSquareVertexRef = function () { return mSquareVertexBuffer; };
    var getSquareVertexSize = function () { return 4; };
    var getCircleVertexRef = function () { return mCircleVertexBuffer; };
    var getCircleVertexSize = function() { return kCircleVertices + 2; };
    
    var mPublic = {
        initialize: initialize,
        getSquareVertexRef: getSquareVertexRef,
        getSquareVertexSize: getSquareVertexSize,
        getCircleVertexRef: getCircleVertexRef,
        getCircleVertexSize: getCircleVertexSize
    };

    return mPublic;
}());