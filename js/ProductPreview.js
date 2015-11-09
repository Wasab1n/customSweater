/**
 * Created by Lukas on 2015.10.03.
 */

// Produkto atvaizdavimo klase

function ProductPreview(canvasId, patternCanvasId, productImageSrc, patternImageParam, patternSizeParam, draw3dParam)
{
    // 3d atvaizdavimo kintamieji
    var draw3d = draw3dParam;
    var scene, camera, renderer, plane;
    var canvas3d = document.getElementById("3dCanvas");
    var animationID;
    var keepRendering = true;

    // Peles valdymo kintamieji
    var canvasOffset = $("#" + canvasId).offset();
    var offsetX = canvasOffset.left, offsetY = canvasOffset.top;
    var isDragging = false;
    var previousX = 0, previousY = 0, currentX = 0, currentY = 0;

    // 2d atvaizdavimo kintamieji
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext("2d");
    var patternCanvas = document.getElementById(patternCanvasId);
    var patternContext = patternCanvas.getContext("2d");
    var productImage = new Image();
    var patternImage = patternImageParam;
    var originalPatternImage = new Image();
    originalPatternImage.src = patternImage.src;
    var originalSizePatternImage = new Image();
    originalSizePatternImage.src = patternImage.src;
    var patternImageId = 0;
    var patternImageWidth, patternImageHeight;
    var patternSize = patternSizeParam;

    this.setDraw3d = function(draw3dParam)
    {
        this.draw3d = draw3dParam;
        if (draw3dParam) {
            document.getElementById(canvasId).style.display = "none";
            document.getElementById("3dCanvas").style.display = "";
        } else {
            document.getElementById(canvasId).style.display = "";
            document.getElementById("3dCanvas").style.display = "none";
        }
    }
    this.setDraw3d(draw3dParam);

    this.setPatternSize = function(patternSizeParam)
    {
        patternSize = patternSizeParam;
        draw(0, 0);
        if (draw3d)
            render();
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
        if (draw3d)
            render();
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
        makePattern(offsetX, offsetY);
        if (draw3d) {
            render2D(offsetX, offsetY);
            render3D(offsetX, offsetY);
        } else {
            render2D(offsetX, offsetY);
        }
    }

    var render2D = function(offsetX, offsetY)
    {
        var pattern = context.createPattern(patternImage, 'repeat');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(productImage,0,0);
        context.globalCompositeOperation="source-atop";
        context.rect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(this.patternCanvas, 0, 0, this.patternCanvas.width * patternSize, this.patternCanvas.height * patternSize);
        context.globalCompositeOperation = "multiply";
        context.drawImage(productImage,0,0);
    }

    var render3D = function(offsetX, offsetY)
    {
        plane.material.uniforms.tDiffuse.value.needsUpdate = true;
    }

    var makePattern = function(offsetX, offsetY)
    {
        var pattern = patternContext.createPattern(patternImage, 'repeat');
        patternContext.clearRect(0, 0, this.patternCanvas.width, this.patternCanvas.height);
        patternContext.rect(0, 0, this.patternCanvas.width, this.patternCanvas.height);
        patternContext.translate(currentX, currentY);
        patternContext.fillStyle = pattern;
        //patternContext.fillRect(-offsetX, -offsetY, this.patternCanvas.width, this.patternCanvas.height);
        patternContext.fillRect(-currentX, -currentY, this.patternCanvas.width, this.patternCanvas.height);
        patternContext.translate(-currentX, -currentY);
    }

    var handleMouseDown = function(e)
    {
        if (draw3d) {
            keepRendering = true;
            animationID = animate();
        }
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
        //cancelAnimationFrame(animationID);
        keepRendering = false;
    }

    var handleMouseOut = function(e)
    {
        mousePositionX = parseInt(e.clientX - offsetX);
        mousePositionY = parseInt(e.clientY - offsetY);
        isDragging=false;
        //cancelAnimationFrame(animationID);
        keepRendering = false;
    }

    var handleMouseMove = function(e)
    {
       // animate();
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

    $("#canvas").mousedown(handleMouseDown);
    $("#canvas").mousemove(handleMouseMove);
    $("#canvas").mouseup(handleMouseUp);
    $("#canvas").mouseout(handleMouseOut);
    $("#3dCanvas").mousedown(handleMouseDown);
    $("#3dCanvas").mousemove(handleMouseMove);
    $("#3dCanvas").mouseup(handleMouseUp);
    $("#3dCanvas").mouseout(handleMouseOut);

    function init3d() {
        scene = new THREE.Scene();

        var SCREEN_WIDTH = canvas3d.width, SCREEN_HEIGHT = canvas3d.height;
        var VIEW_ANGLE = 80, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 1000;
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.z = 10;
        scene.add(camera);

        renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas3d});
        renderer.setSize(canvas3d.width, canvas3d.height);

        var DiffuseTexture = new THREE.Texture(canvas);
        var DisplacementTexture = new THREE.ImageUtils.loadTexture("imgs/DisplacementMap.jpg", {}, render);
        var shader = THREE.ShaderLib["normalmap"];
        var fragShader = document.getElementById("fragmentShader").innerHTML;
        var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
        uniforms["enableDisplacement"].value = true;
        uniforms["enableDiffuse"].value = true;
        uniforms["tDisplacement"].value = DisplacementTexture;
        uniforms["tDiffuse"].value = DiffuseTexture;
        uniforms["uDisplacementScale"].value = 1;
        var parameters = {
            fragmentShader: fragShader/*shader.fragmentShader*/,
            vertexShader: shader.vertexShader,
            uniforms: uniforms,
            lights: true
        };
        var NormalMaterial = new THREE.ShaderMaterial(parameters);
        NormalMaterial.wrapAround = true;

        var geometry = new THREE.PlaneGeometry(16, 16, 256, 256);
        geometry.computeTangents();
        plane = new THREE.Mesh(geometry, NormalMaterial);
        scene.add(plane);

        ambientLight = new THREE.AmbientLight(0xFFFFFF);
        scene.add(ambientLight);
    }

    function animate() {
        setTimeout( function() {
            if (keepRendering)
                animationID = requestAnimationFrame( animate );

        }, 1000 / 24 );

        render();
        //if (keepRendering)
           // animationID = requestAnimationFrame(animate);
    }

    function render() {
        renderer.render(scene, camera);
    }

    changeImageDimensions();
    patternImage.onload=function()
    {
        productImage.onload=function()
        {
            canvas.width = productImage.width;
            canvas.height = productImage.height;
            canvas3d.width = productImage.width;
            canvas3d.height = productImage.height;
            if (draw3d)
                init3d();
            draw(0, 0);
        }
        productImage.src = productImageSrc;
    }
}