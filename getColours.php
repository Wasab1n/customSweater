<?php

// Graþina aplanke esanèiø paveikslëliø spalvas ([0, 0] kordinatëje esanèio pixelio);

class Colour {
    public $red;
    public $green;
    public $blue;

    function __construct($red, $green, $blue)
    {
        $this->red = $red;
        $this->green = $green;
        $this->blue = $blue;
    }
}

$dir = new DirectoryIterator(dirname(__DIR__ . "/imgs/patterns/colours/pattern" . $_POST["patternId"]  . "/*"));
$i = 1;
$colours = array();
foreach ($dir as $fileinfo) {
    if (!$fileinfo->isDot() && $fileinfo->isFile()) {
        $filename = $fileinfo->getFilename();
        $image = imagecreatefrompng(__DIR__ . "/imgs/patterns/colours/pattern" . $_POST["patternId"] . "/" . $filename);
        $imageColour = imagecolorat($image, 0, 0);
        $r = ($imageColour >> 16) & 0xFF;
        $g = ($imageColour >> 8) & 0xFF;
        $b = $imageColour & 0xFF;
        $colour = new Colour($r, $g, $b);
        array_push($colours, $colour);
    }
}

echo json_encode($colours);
