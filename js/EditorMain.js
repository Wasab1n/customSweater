

$(document).ready(function() {

    var colourChanged = false;
    var patternImage = new Image();
    patternImage.src = "imgs/patterns/pattern1.png";

    var colourChanger = null;
    var productPreview = new ProductPreview("canvas", "imgs/sweater.png", patternImage, 4);

    $(".patternButton").click( function(e) {
        var buttonId = $(this).attr("buttonNumber");
        var newImage = new Image();
        newImage.src = "imgs/patterns/pattern" + buttonId + ".png";
        productPreview.setPatternImage(newImage);
        colourChanged = false;
    });

    window.onload = function()
    {
        colourChanger = new ColourChanger(productPreview);

        $.ajax({
            type: "POST",
            url: "getColours.php",
            data: { patternId : productPreview.getPatternImageId() },
            success: function(response) {
                var data = JSON.parse(response);
                //alert(data);
            }
        })
    };

    $("#colours").on("click", "div", function (e)
    {
        if (!colourChanged) {
            colourChanger.changeImageColour();
            colourChanged = true;
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
        canvas.width = productPreview.getPatternImage().width;
        canvas.height = productPreview.getPatternImage().height;
        context.drawImage(
            productPreview.getPatternImage(),
            0,
            0,
            productPreview.getPatternImage().naturalWidth,
            productPreview.getPatternImage().naturalHeight,
            0,
            0,
            productPreview.getPatternImage().width,
            productPreview.getPatternImage().height
        );
        originalPixels = context.getImageData(
            0,
            0,
            productPreview.getPatternImage().width,
            productPreview.getPatternImage().height
        );
        currentPixels = context.getImageData(
            0,
            0,
            productPreview.getPatternImage().width,
            productPreview.getPatternImage().height
        );
    }

    var hexToRGB = function(hex)
    {
        var long = parseInt(hex.replace(/^#/, ""), 16);
        return {
            R: (long >>> 16) & 0xff,
            G: (long >>> 8) & 0xff,
            B: long & 0xff
        }
    };

    var changeColour = function()
    {
        canvasReady = false;
        if(!originalPixels) return;
        var newColor = hexToRGB("#ac1564");

        for (var i = 0, l = originalPixels.data.length; i < l; i+= 4) {
            if (currentPixels.data[i + 3] > 0) {
                currentPixels.data[i] = originalPixels.data[i] / 255 * newColor.R;
                currentPixels.data[i + 1] = originalPixels.data[i + 1] / 255 * newColor.G;
                currentPixels.data[i + 2] = originalPixels.data[i + 2] / 255 * newColor.B;
            }
        }

        context.putImageData(currentPixels, 0, 0);
        return canvas.toDataURL("image/png");
    }

    this.changeImageColour = function()
    {
        getPixels();
        var colourURL = changeColour();
        var newImage = new Image();
        newImage.src = colourURL;
        productPreview.setPatternImage(newImage);
    }

    getPixels();
    var colourDiv = document.getElementById("colours");
    var colourURL = changeColour();
    var colourImage = new Image();
    colourImage.src = colourURL;
    var newDiv = document.createElement("div");
    newDiv.className = "colourButton";
    newDiv.style.backgroundImage = "url(" + colourURL + ")";
    colourDiv.appendChild(newDiv);
    var newDivv = document.createElement("div");
    newDivv.style.backgroundImage = "url(imgs/patterns/colours/pattern1/1.bmp)";
    newDivv.style.width = "50px";
    newDivv.style.height = "50px";
    colourDiv.appendChild(newDivv);
}