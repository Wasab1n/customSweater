
$(document).ready(function() {

    var colourChanged = null;
    var patternImage = new Image();
	patternSize = 100;
    patternImage.src = "imgs/patterns/pattern0.png";
	patternImage.width = patternSize;
	patternImage.height = patternSize;
	
	var colourChanger = null;
    var productPreview = new ProductPreview("canvas", "imgs/sweater.png", patternImage);

	
    window.onload = function()
    {
        colourChanger = new ColourChanger(productPreview);
        getColours(productPreview.getPatternImageId());
    };


    function getColours(colourId) {
        $.ajax({
            type: "POST",
            url: "getColours.php",
            data: { patternId : colourId },
            success: function(response) {
                var data = JSON.parse(response);
                colourChanger.setColours(data);
                colourChanger.displayColourButtons();
            }
        });
    }

    $(".patternButton").click( function(e) {
        var buttonId = $(this).attr("buttonNumber");
        var i = productPreview.getPatternImageId();
        if (buttonId != productPreview.getPatternImageId()) {
            var newImage = new Image();
            newImage.src = "imgs/patterns/pattern" + buttonId + ".png";
			newImage.width = patternSize;
			newImage.height = patternSize;
            productPreview.setOriginalPatternImage(newImage);
            productPreview.setPatternImage(newImage);
			productPreview.setPatternButtonID(newImage);
            getColours(productPreview.getPatternImageId());
            colourChanged = null;
        }
    });
	
	$(".sizeButton").click( function(e) {
        var sizeID = $(this).attr("sizeNumber");
		
		if(sizeID == 0) {
			patternSize = 50;
			patternImage.width = 50;
			patternImage.height = 50;
		}
		if(sizeID == 1) {
			patternSize = 75;
			patternImage.width = 75;
			patternImage.height = 75;
		}
		if(sizeID == 2) {
			patternSize = 100;
			patternImage.width = 100;
			patternImage.height = 100;
		}
		
		
		if (colourChanged == null){
			var newImage = new Image();
			var i = productPreview.getPatternButtonId();
			console.log('i =' + i);
			newImage.src = "imgs/patterns/pattern" + i + ".png";
			newImage.width = patternSize;
			newImage.height = patternSize;
			productPreview.setOriginalPatternImage(newImage);
			productPreview.setPatternImage(newImage);
			getColours(i);
		} 
		else {
			var newImage = new Image();
			var i = productPreview.getPatternButtonId();
			newImage.src = "imgs/patterns/pattern" + i + ".png";
			newImage.width = patternSize;
			newImage.height = patternSize;
			productPreview.setOriginalPatternImage(newImage);
			productPreview.setPatternImage(newImage);
			colourChanger.changeImageColour(colourChanged);
			getColours(i);
		}
    });

    $("#colours").on("click", "div", function (e)
    {
        var buttonId = $(this).attr("id");
        if (colourChanged == null || colourChanged != buttonId) {
            colourChanger.changeImageColour(buttonId);
            colourChanged = buttonId;
        }
    });
});

// Spalvos keitiklio klase

function ColourChanger(productPreviewParam)
{
    var productPreview = productPreviewParam;
    var canvas = document.getElementById("colourChangeCanvas");
    var context = canvas.getContext("2d");
    var originalPixels = null;
    var currentPixels = null;
    var canvasReady = false;
    var colours = [];
    var imageColours = [];

    this.getColours = function()
    {
        return colours;
    }

    this.setColours = function(coloursParam)
    {
        colours = coloursParam;
        this.displayColourButtons();
    }

    canvas.onload = function()
    {
        canvasReady = true;
    }

    this.setProductPreview = function(productPreviewParam)
    {
        productPreview = productPreviewParam;
    }

    this.getProductPreview = function()
    {
        return productPreview;
    }

    var getPixels = function()
    {
        var patternImage = productPreview.getOriginalPatternImage();
        canvas.width = patternImage.width;
        canvas.height =  patternImage.height;
        context.drawImage(
            patternImage,0,0,patternImage.naturalWidth,patternImage.naturalHeight,0,0,
            patternImage.width,
            patternImage.height
        );

        originalPixels = context.getImageData(0,0,patternImage.width,patternImage.height);

        imageColours = [];
        for (var i = 0, l = originalPixels.data.length; i < l; i+= 4) {
            var colour = {R: originalPixels.data[i], G: originalPixels.data[i + 1], B: originalPixels.data[i + 2]};
            if (!colourExists(colour, imageColours)) {
                imageColours.push(colour);
            }
        }

        currentPixels = context.getImageData(
            0,
            0,
            patternImage.width,
            patternImage.height
        );
    }

    var colourExists = function(colour, array)
    {
        for (var i = 0; i < array.length; i++) {
            if (array[i].R == colour.R && array[i].G == colour.G && array[i].B == colour.B)
                return true;
        }
        return false;
    }

    var getColourIndex = function(colour)
    {
        for (var i = 0; i < imageColours.length; i++) {
            if (imageColours[i].R == colour.R && imageColours[i].G == colour.G && imageColours[i].B == colour.B)
                return i;
        }
        return -1;
    }

    var changeColour = function(colourId)
    {
        canvasReady = false;
        if(!originalPixels) return;
        var newColours = colours[colourId];

        var index = 0;
        for (var i = 0, l = originalPixels.data.length; i < l; i+= 4) {
            var pixelColour = {R: originalPixels.data[i], G: originalPixels.data[i + 1], B: originalPixels.data[i + 2]};
            var colourIndex = getColourIndex(pixelColour);
            if (colourIndex >= newColours.length) {
                currentPixels.data[i] = newColours[index].R;
                currentPixels.data[i + 1] = newColours[index].G;
                currentPixels.data[i + 2] = newColours[index].B;
                index++;
                if (index >= newColours.length) index = 0;
            } else {
                if (currentPixels.data[i + 3] > 0) {
                    currentPixels.data[i] = newColours[colourIndex].R;
                    currentPixels.data[i + 1] = newColours[colourIndex].G;
                    currentPixels.data[i + 2] = newColours[colourIndex].B;
                }
            }
        }

        context.putImageData(currentPixels, 0, 0);
        return canvas.toDataURL("image/png");
    }

    this.changeImageColour = function(colourId)
    {
        getPixels();
        var colourURL = changeColour(colourId);
        var newImage = new Image();
        newImage.src = colourURL;
        productPreview.setPatternImage(newImage);
    }


    this.displayColourButtons = function()
    {
        var colourDiv = document.getElementById("colours");
        while (colourDiv.firstChild) {
            colourDiv.removeChild(colourDiv.firstChild);
        }
        for (i = 0; i < colours.length; i++) {
            getPixels();
            var colourURL = changeColour(i);
            var colourImage = new Image();
            colourImage.src = colourURL;
            var newDiv = document.createElement("div");
            newDiv.className = "colourButton";
            newDiv.style.backgroundImage = "url(" + colourURL + ")";
            newDiv.id = i;
            colourDiv.appendChild(newDiv);
        }
    }
}

