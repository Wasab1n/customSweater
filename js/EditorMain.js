
$(document).ready(function() {

    var colourChanged = null;
    var patternImage = new Image();
    patternImage.src = "imgs/patterns/pattern0.png";

    var colourChanger = null;
    var productPreview = new ProductPreview("canvas", "patternCanvas", "imgs/sweater.png", patternImage, 1, "webgl");
    var mouseHandler = new MouseHandler(productPreview);

    $(window).load(function() {
        colourChanger = new ColourChanger(productPreview);
        getColours(productPreview.getPatternImageId());
    });

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
            productPreview.setOriginalPatternImage(newImage);
            productPreview.setOriginalSizePatternImage(newImage);
            productPreview.setPatternImage(newImage);
            getColours(productPreview.getPatternImageId());
            colourChanged = null;
        }
    });

    $(".sizeButton").click( function(e) {
        var sizeID = $(this).attr("sizeNumber");

        console.log(sizeID);
        switch(sizeID) {
            case '2':
                productPreview.setPatternSize(1.5);
                break;
            case '1':
                productPreview.setPatternSize(1.25);
                break;
            case '0':
                productPreview.setPatternSize(1);
                break;
        }

    });

    $("#colours").on("click", "div", function (e)
    {
        var buttonId = $(this).attr("id");
        var id = buttonId.split(" ");
        if (colourChanged == null || colourChanged != buttonId) {
            colourChanger.changeImageColour(id[0],id[1]);
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
    var colours = [];           //masyvas su galimais spalvu deriniais
    var colour = [];           //bendras masyvas, kuriame yra visu spalvu paleciu spalvos
    var imageColours = [];      //masyvas saugantis originalaus rasto skirtingu spalvu pikseliu informacija.
    
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
    
    
    //Sujungiamps visu spalvu paleciu spalvos i viena bendra masyva 
    var combineColours = function(){
        colour = [];
        var newColour;
        for(var i = 0; i < colours.length; i++){
            for(var j = 0; j < colours[i].length; j++){
                newColour = { 
                    R: colours[i][j].R, 
                    G: colours[i][j].G, 
                    B: colours[i][j].B };
                if(!colourExists(newColour, colour)){
                    colour.push(newColour);
                }
            }
        }
    }

    var getPixels = function()
    {
        var patternImage = productPreview.getOriginalPatternImage();
        canvas.width = patternImage.width;
        canvas.height =  patternImage.height;
        context.drawImage(
            patternImage,
            0,
            0,
            patternImage.naturalWidth,
            patternImage.naturalHeight,
            0,
            0,
            patternImage.width,
            patternImage.height
        );

        originalPixels = context.getImageData(
            0,
            0,
            patternImage.width,
            patternImage.height
        );
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
        // Paima ra�to atskir� detali� spalvas.
        var newColours = colours[colourId];

        var index = 0;
        // Eina per visus paveiksliuko pixelius
        for (var i = 0, l = originalPixels.data.length; i < l; i+= 4) {
            // Paima pixelio spalv�
            var pixelColour = {R: originalPixels.data[i], G: originalPixels.data[i + 1], B: originalPixels.data[i + 2]};
            // Suranda kuri� spalv� reikia naudoti pagal originalaus paveiksliuko pixelio spalv�
            var colourIndex = getColourIndex(pixelColour);
            if (colourIndex >= newColours.length) {
                // Pakeicia pixelio spalva, jeigu foldery nera tiek paveiksliuku su spalvom kokio indexo dabar reikia,
                // tai imama pirma spalva ir didinamas indexas ir t.t. Jeigu neranda spalvos pagal ta indexa tai ima
                // tas kurios yra is eiles visas.
                currentPixels.data[i] = newColours[index].R;
                currentPixels.data[i + 1] = newColours[index].G;
                currentPixels.data[i + 2] = newColours[index].B;
                index++;
                // Jei jau priejo prie paskutines spalvos vel pradeda per nauja
                if (index >= newColours.length) index = 0;
            } else {
                // Tikrina ar pixelis nera visiskai permatomas, nes ner prasmes keist spalva jei nematomas pixelis
                if (currentPixels.data[i + 3] > 0) {
                    // Pakeicia spalva pixelio ir situo atveju foldery yra tiek spalvu, kiek reikia kad pakeist visu
                    // rasto daliu spalvas.
                    currentPixels.data[i] = newColours[colourIndex].R;
                    currentPixels.data[i + 1] = newColours[colourIndex].G;
                    currentPixels.data[i + 2] = newColours[colourIndex].B;
                }
            }
        }

        context.putImageData(currentPixels, 0, 0);
        return canvas.toDataURL("image/png");
    }
    
    var replaceColour = function(oldColorId, newColorId){
        
        canvasReady = false;
        if(!originalPixels) return;
        
        var oldColour = imageColours[oldColorId];
        var newColour = colour[newColorId];
        
        for(var i = 0; i < originalPixels.data.length; i += 4){
            if(originalPixels.data[i] == oldColour.R && originalPixels.data[i+1] == oldColour.G && originalPixels.data[i+2] == oldColour.B){
                currentPixels.data[i] = newColour.R;
                currentPixels.data[i+1] = newColour.G;
                currentPixels.data[i+2] = newColour.B;
            }
        }
        context.putImageData(currentPixels, 0, 0);
        return canvas.toDataURL("image/png");
    }
    

    //Main
    this.changeImageColour = function(oldColorId, newColourId)
    {
        //getPixels();  
        //combineColours();
        
        var colourURL = replaceColour(oldColorId, newColourId);
        var newImage = new Image();
        newImage.src = colourURL;

        productPreview.setPatternImage(newImage);
        productPreview.setOriginalSizePatternImage(newImage);
    }


    this.displayColourButtons = function()
    {
        combineColours();
        var newDiv;
        var colourDiv = document.getElementById("colours");
        while (colourDiv.firstChild) {
            colourDiv.removeChild(colourDiv.firstChild);
        }
        getPixels();
        for (var i = 0; i < imageColours.length; i++) {
            for(var j = 0; j < colour.length; j++){
            //var colourURL = replaceColour(1,1);
            //var colourImage = new Image();
            //colourImage.src = colourURL;
            newDiv = document.createElement("div");
            newDiv.className = "colourButton";
            //newDiv.style.backgroundImage = "url(" + colourURL + ")";
            newDiv.style.backgroundColor = "rgb(" + colour[j].R + "," + colour[j].G + ","+ colour[j].B + ")";
            newDiv.id =  i + " " + j;
            colourDiv.appendChild(newDiv);
            
            }
            
        }
        /*for(var i = 0; i < imageColours.length; i++){
            getPixels();
            var colourURL = replaceColour(1,1);
            var colourImage = new Image();
            colourImage.src = colourURL;
            for(var j = 0; j < colour.length; j++){
                newDiv = $("<div/>", {
                id: i*10*j,
                "class": "colourButton",
                style: "rgb(" + colour[i].R + "," + colour[i].G + ","+ colour[i].B + ")"
                });
            }
            newDiv.appendTo("#colours");
        }*/
    
    }
}
