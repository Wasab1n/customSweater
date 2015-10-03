/**
 * Created by Lukas on 2015.10.03.
 */

$(document).ready(function(){

    var productPreview = new ProductPreview("canvas", "imgs/sweater.png", "imgs/patterns/pattern1.png", 5);

    $(".patternButton").click( function(e) {
        var buttonId = $(this).attr("buttonNumber");
        productPreview.patternImage.src = "imgs/patterns/pattern" + buttonId + ".png";
    });
});