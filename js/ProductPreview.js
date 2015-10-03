/**
 * Created by Lukas on 2015.10.03.
 */

function ProductPreview(canvasId, productImageSrc, patternImageSrc, productOpacity)
{
    this.canvas = document.getElementById(canvasId);
    var context = this.canvas.getContext("2d");
    var canvasOffset = $("#" + canvasId).offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var isDragging = false;

    var productImage = new Image();
    var patternImage = new Image();
    patternImage.onload=function()
    {
        productImage.onload=function()
        {
            start(0, 0);
        }
        productImage.src = productImageSrc;
    }

    patternImage.src = patternImageSrc;

    this.productImage = productImage;
    this.patternImage = patternImage;

    function start(offsetX, offsetY)
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

    function handleMouseDown(e)
    {
        mousePositionX = parseInt(e.clientX - offsetX);
        mousePositionY = parseInt(e.clientY - offsetY);
        isDragging = true;
    }

    function handleMouseUp(e)
    {
        mousePositionX = parseInt(e.clientX - offsetX);
        mousePositionY = parseInt(e.clientY - offsetY);
        isDragging=false;
    }

    function handleMouseOut(e)
    {
        mousePositionX = parseInt(e.clientX - offsetX);
        mousePositionY = parseInt(e.clientY - offsetY);
        isDragging=false;
    }

    function handleMouseMove(e)
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