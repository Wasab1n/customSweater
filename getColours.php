<?php

// Graþina aplanke esanèiø paveikslëliø spalvas ([0, 0] kordinatëje esanèio pixelio);

class Colour
{
    public $R;
    public $B;
    public $G;

    function __construct($red, $green, $blue)
    {
        $this->R = $red;
        $this->G = $green;
        $this->B = $blue;
    }
}

$dir = new DirectoryIterator(dirname(__DIR__ . "/imgs/patterns/colours/pattern" . $_POST["patternId"]  . "/*"));
$selections = array();
foreach ($dir as $fileinfo) {
    if (/*!$fileinfo->isDot() && $fileinfo->isFile()*/ !$fileinfo->isDot() && $fileinfo->isDir()) {
        $selectionDirectory = new DirectoryIterator($fileinfo->getPath() . "/" . $fileinfo->getFilename());
        $colours = array();
        foreach ($selectionDirectory as $file) {
            if (!$file->isDot() && $file->isFile()) {
                $filename = $file->getFilename();
                $image = imagecreatefrompng($file->getPath() . "/" . $filename);
                $imageColour = imagecolorat($image, 0, 0);
                $r = ($imageColour >> 16) & 0xFF;
                $g = ($imageColour >> 8) & 0xFF;
                $b = $imageColour & 0xFF;
                $colour = new Colour($r, $g, $b);
                array_push($colours, $colour);
            }
        }
        if (!empty($colours))
            array_push($selections, $colours);
    }
}

echo json_encode($selections);
