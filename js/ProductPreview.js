/**
 * Created by Lukas on 2015.10.03.
 */

function ProductPreview(canvasId, productImageSrc, patternImageParam, productOpacity)
{
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    var canvasOffset = $("#" + canvasId).offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var isDragging = false;
    var productImage = new Image();
    var patternImage = patternImageParam;
    var canvasReady = true;

    this.setPatternImage = function(patternImageParam)
    {
        patternImage = patternImageParam;
        start(0, 0);
    }

    this.getPatternImage = function()
    {
        return patternImage;
    }

    patternImage.onload=function()
    {
        productImage.onload=function()
        {
            start(0, 0);
        }
        productImage.src = productImageSrc;
    }

    var start = function(offsetX, offsetY)
    {
        var pattern = context.createPattern(patternImage, 'repeat');
        context.drawImage(productImage,0,0);
        context.globalCompositeOperation="source-atop";
        context.globalAlpha=.85;
        context.rect(0, 0, this.canvas.width, this.canvas.height);
        context.translate(offsetX, offsetY);
        context.fillStyle = pattern;
        context.fillRect(-offsetX, -offsetY, this.canvas.width, this.canvas.height);
        context.translate(-offsetX, -offsetY);
        context.globalAlpha=.15;
        for (i = 0; i < productOpacity; i++)
            context.drawImage(productImage,0,0);
    }

    var handleMouseDown = function(e)
    {
        mousePositionX = parseInt(e.clientX - offsetX);
        mousePositionY = parseInt(e.clientY - offsetY);
        isDragging = true;
    }

    var handleMouseUp = function(e)
    {
        mousePositionX = parseInt(e.clientX - offsetX);
        mousePositionY = parseInt(e.clientY - offsetY);
        isDragging=false;
    }

    var handleMouseOut = function(e)
    {
        mousePositionX = parseInt(e.clientX - offsetX);
        mousePositionY = parseInt(e.clientY - offsetY);
        isDragging=false;
    }

    var handleMouseMove = function(e)
    {
        mousePositionX = parseInt(e.clientX - offsetX);
        mousePositionY = parseInt(e.clientY - offsetY);
        if(isDragging){
            start(mousePositionX-128/2, mousePositionY-120/2);
        }
    }

    $("#canvas").mousedown(handleMouseDown);
    $("#canvas").mousemove(handleMouseMove);
    $("#canvas").mouseup(handleMouseUp);
    $("#canvas").mouseout(handleMouseOut);
}