<!doctype html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="http://code.jquery.com/jquery.min.js"></script>
    <script src="js/libs/three.min.js"></script>

    <script src="js/ProductPreview.js"></script>
    <script src="js/EditorMain.js"></script>
</head>

<body>

<canvas id="colourChangeCanvas" width=600 height=600></canvas>
<div id="container">
    <div id="canvasContainer">
        <canvas id="canvas" width=600 height=600></canvas>
    </div>
    <div id="patterns">
        <ul id="patternList">
            <?php
                $dir = new DirectoryIterator(dirname(__DIR__ . '/imgs/patterns/*'));
                    $i = 0;
                    foreach ($dir as $fileinfo) {
                        if (!$fileinfo->isDot() && $fileinfo->isFile()) {
                            echo "<li buttonNumber='$i' class=\"patternButton\" style=\"background-image: url('imgs/patterns/pattern$i.png')\"></li>\n";
                            $i++;
                        }
                    }
            ?>
        </ul>
    </div>
    <div id="colours">
    </div>
</div>
</body>
</html>