/**
 * Created by Lukas on 2015.10.03.
 */

// Produkto atvaizdavimo klase

function ProductPreview(canvasId, patternCanvasId, productImageSrc, patternImageParam, patternSizeParam)
{
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    var patternContext = document.getElementById(patternCanvasId).getContext("2d");
    var canvasOffset = $("#" + canvasId).offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var isDragging = false;
    var productImage = new Image();
    var patternImage = patternImageParam;
    var originalPatternImage = new Image();
    originalPatternImage.src = patternImage.src;
    var originalSizePatternImage = new Image();
    originalSizePatternImage.src = patternImage.src;
    var canvasReady = true;
    var patternImageId = 0;
    var previousX = 0;
    var previousY = 0;
    var currentX = 0;
    var currentY = 0;
    var patternImageWidth, patternImageHeight;
    var patternSize = patternSizeParam;

    this.setPatternSize = function(patternSizeParam)
    {
        patternSize = patternSizeParam;
        draw(0, 0);
    }

    this.setOriginalSizePatternImage = function(originalSizePatternImageParam)
    {
        var newImage = new Image();
        newImage.src = originalSizePatternImageParam.src;
        originalSizePatternImage = newImage;
    }

    this.setOriginalPatternImage = function(originalPatternImageParam)
    {
        var newImage = new Image();
        newImage.src = originalPatternImageParam.src;
        originalPatternImage = newImage;
    }

    this.getOriginalPatternImage = function()
    {
        return originalPatternImage;
    }

    this.setPatternImage = function(patternImageParam)
    {
        var patternImageSource = patternImageParam.src.split("/");
        patternImageId = patternImageSource[patternImageSource.length - 1].split(".")[0];
        patternImageId = patternImageId[patternImageId.length - 1];
        patternImage = patternImageParam;
        changeImageDimensions();
        currentX = currentY = 0;
        draw(0, 0);
    }

    this.getPatternImageId = function()
    {
        return patternImageId;
    }

    this.getPatternImage = function()
    {
        return patternImage;
    }

    var changeImageDimensions = function() {
        if (patternImage.width < canvas.width || patternImage.height < canvas.height) {
            patternImageWidth = 2000;
            patternImageHeight = 2000;
        } else {
            patternImageWidth = patternImage.width;
            patternImageHeight = patternImage.height;
        }
    }

    var draw = function(offsetX, offsetY)
    {
        var pattern = context.createPattern(patternImage, 'repeat');
        makePattern(offsetX, offsetY);
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(productImage,0,0);
        context.globalCompositeOperation="source-atop";
        context.globalAlpha=1;
        context.rect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(patternCanvas, 0, 0, patternCanvas.width * patternSize, patternCanvas.height * patternSize);
        context.globalAlpha=1;
        context.globalCompositeOperation = "multiply";
        context.drawImage(productImage,0,0);
    }

    var makePattern = function(offsetX, offsetY)
    {
        var pattern = patternContext.createPattern(patternImage, 'repeat');
        patternContext.clearRect(0, 0, this.patternCanvas.width, this.patternCanvas.height);
        patternContext.rect(0, 0, this.patternCanvas.width, this.patternCanvas.height);
        patternContext.translate(currentX, currentY);
        patternContext.fillStyle = pattern;
        patternContext.fillRect(-offsetX, -offsetY, this.patternCanvas.width, this.patternCanvas.height);
        patternContext.fillStyle = pattern;
        patternContext.fillRect(-currentX, -currentY, this.patternCanvas.width, this.patternCanvas.height);
        //patternContext.drawImage(patternImage, 0, 0);
        patternContext.translate(-currentX, -currentY);
    }

    var handleMouseDown = function(e)
    {
        mousePositionX = parseInt(e.clientX - offsetX);
        mousePositionY = parseInt(e.clientY - offsetY);
        previousX = mousePositionX;
        previousY = mousePositionY;
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
            //console.log(mousePositionX - previousX);
           // console.log(mousePositionY - previousY);
            if ((currentX - 600 + patternImageWidth > 0 || mousePositionX - previousX > 0) && (currentX < 0 || mousePositionX - previousX < 0)) {
                if (currentX + mousePositionX - previousX < -patternImageWidth + canvas.width) {
                    currentX = -patternImageWidth + canvas.width;
                } else if (currentX + mousePositionX - previousX > 0) {
                    currentX = 0;
                } else {
                    currentX = currentX + (mousePositionX - previousX) / patternSize;
                }
            }
            if ((currentY - 600 + patternImageHeight > 0 || mousePositionY - previousY > 0) && (currentY < 0 || mousePositionY - previousY < 0)) {
                if (currentY + mousePositionY - previousY < -patternImageHeight + canvas.height) {
                    currentY = -patternImageHeight + canvas.height;
                } else if (currentY + mousePositionY - previousY > 0) {
                    currentY = 0;
                } else {
                    currentY = currentY + (mousePositionY - previousY) / patternSize;
                }
            }
            //console.log(currentX);
            //console.log(currentY);
            previousX = mousePositionX;
            previousY = mousePositionY;
            draw(mousePositionX, mousePositionY);
        }
    }

    changeImageDimensions();
    $("#canvas").mousedown(handleMouseDown);
    $("#canvas").mousemove(handleMouseMove);
    $("#canvas").mouseup(handleMouseUp);
    $("#canvas").mouseout(handleMouseOut);

    patternImage.onload=function()
    {
        productImage.onload=function()
        {
            draw(0, 0);
        }
        productImage.src = productImageSrc;
    }
}