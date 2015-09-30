<!doctype html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="http://code.jquery.com/jquery.min.js"></script>
    <script src="js/three.min.js"></script>

    <script>
        $(document).ready(function(){
            $('.patternButton').css('cursor', 'pointer');

            var canvas=document.getElementById("canvas");
            var ctx=canvas.getContext("2d");
            var canvasOffset=$("#canvas").offset();
            var offsetX=canvasOffset.left;
            var offsetY=canvasOffset.top;
            var isDragging=false;

            var img1=new Image();
            var img=new Image();

            img.onload=function(){
                img1.onload=function(){
                    start(0, 0);
                }
                img1.src="imgs/sweater.png";
            }

            img.src="imgs/patterns/pattern1.png";

            $(".patternButton").click( function(e) {
                var buttonId = $(this).attr("buttonNumber");
                img.src="imgs/patterns/pattern" + buttonId + ".png";
            });

            function start(offsetX, offsetY){

                ctx.drawImage(img1,0,0);

                ctx.globalCompositeOperation="source-atop";

                ctx.globalAlpha=.85;

                var pattern = ctx.createPattern(img, 'repeat');
                ctx.rect(0, 0, canvas.width, canvas.height);
                ctx.translate(offsetX, offsetY);
                ctx.fillStyle = pattern;
                ctx.fillRect(-offsetX, -offsetY, 600, 600);
                ctx.translate(-offsetX, -offsetY);

                ctx.globalAlpha=.15;
                ctx.drawImage(img1,0,0);
                ctx.drawImage(img1,0,0);
                ctx.drawImage(img1,0,0);

            }

            function handleMouseDown(e){
                canMouseX=parseInt(e.clientX-offsetX);
                canMouseY=parseInt(e.clientY-offsetY);
                isDragging=true;
            }

            function handleMouseUp(e){
                canMouseX=parseInt(e.clientX-offsetX);
                canMouseY=parseInt(e.clientY-offsetY);
                isDragging=false;
            }

            function handleMouseOut(e){
                canMouseX=parseInt(e.clientX-offsetX);
                canMouseY=parseInt(e.clientY-offsetY);
                isDragging=false;
            }

            function handleMouseMove(e){
                canMouseX=parseInt(e.clientX-offsetX);
                canMouseY=parseInt(e.clientY-offsetY);
                if(isDragging){
                    start(canMouseX-128/2, canMouseY-120/2);
                }
            }

            $("#canvas").mousedown(handleMouseDown);
            $("#canvas").mousemove(handleMouseMove);
            $("#canvas").mouseup(handleMouseUp);
            $("#canvas").mouseout(handleMouseOut);
        });
    </script>
</head>

<body>
<div id="container">
    <div id="canvasContainer">
        <canvas id="canvas" width=600 height=600></canvas>
    </div>
    <div id="patterns">
        <ul id="patternList">
            <?php
                $dir = new DirectoryIterator(dirname(__DIR__ . '/imgs/patterns/*'));
                    $i = 1;
                    foreach ($dir as $fileinfo) {
                        if (!$fileinfo->isDot()) {
                            echo "<li buttonNumber='$i' class=\"patternButton\" style=\"background-image: url('imgs/patterns/pattern$i.png')\">$i</li>\n";
                            $i++;
                        }
                    }
            ?>
        </ul>
    </div>
</div>
</body>
</html>