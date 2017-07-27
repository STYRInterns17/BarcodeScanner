/**
 * Created by STYRLab1 on 7/20/2017.
 */

var img = new Image();
img.src = 'barcode.png';

img.width = 1400;
img.height = 50;

img.onload = function() { draw(this); };

function draw(img) {

    var canvas = document.getElementById('canvas') as HTMLCanvasElement;
    var ctx = canvas.getContext('2d');

    document.getElementById('fileInput').addEventListener('change', imageLoader, false);

    ctx.drawImage(img, 0, 0, img.width, img.height,
        0, 0, canvas.width, canvas.height);

    img.style.display = 'none';

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var data = imageData.data;

    var bitStorage = [];


    var context = canvas.getContext("2d");

    var barcodeScanner2 = function(){
        var scanWidth = canvas.width/5;
        var scanHeight = canvas.height/5;
        console.log(scanWidth);
        console.log(scanHeight);
        console.log(findBluePixel(scanWidth, scanHeight));
    };

    function findBluePixel(scanWidth: number, scanHeight: number){
        for (var i = 0; i < 100; i++) {
            for (var j = 0; j < 100; j++){
                // ctx.fillStyle = "red";
                // ctx.fillRect(Math.round(scanWidth/2), j, 1, 1);
                if(isBlue(Math.round(scanWidth/2),j){
                    console.log("Success");
                    findCenterCircle(scanWidth/2, j);
                    return "(" + scanWidth/2 + "," + j + ")";
                }
                // rgba = 'rgba(' + data[0] + ', ' + data[1] +
                //     ', ' + data[2] + ', ' + (data[3] / 255) + ')';
                // console.log(rgba);
            }
        }
    }

    function isBlue(i: number, j: number){
        let pixel = ctx.getImageData(i, j, 1, 1);
        data = pixel.data;
        if(data[0] < 160 && data[1] < 160 && data[2] > 100){
            return true;
        }
        return false;
    }

    function findCenterCircle(x: number, y: number){
        var circleCoords = [];
        if(isBlue(x + 1, y)){
            //we know we are on left side
            console.log("right is blue");
        }else if(isBlue(x - 1,y)){
            //we know we are on right side
            console.log("left is blue");
        }else{
            //we are at top or bottom
        }
    }

    /*
     * Loads a scaled image to fit the canvas without streching.
     * We find the ratio needed by manipulating the width/height.
     */
    function imageLoader() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function(){
                var ct = document.getElementById('measure');
                ct.appendChild(img);
                /*var wrh = img.width / img.height;
                 var newWidth = canvas.width;
                 var newHeight = newWidth / wrh;
                 if (newHeight > canvas.height) {
                 newHeight = canvas.height;
                 newWidth = newHeight * wrh;
                 }*/
                canvas.width  = this.width;
                canvas.height = this.height;
                ct.removeChild(img);
                ctx.drawImage(this,0,0);
            }
            img.src = reader.result;
        }
        reader.readAsDataURL(fileInput.files[0]);
    }

    var scanImage2 = document.getElementById('scanImage2');
    scanImage2.addEventListener('click', barcodeScanner2);
    //var invertColor = document.getElementById('invertColor');
    //nvertColor.addEventListener('click', invert);
}
