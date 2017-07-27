/**
 * Created by STYRLab1 on 7/20/2017.
 */
class scanner {
    private Image: any;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;


    constructor(imageSrc: String) {
        this.Image = new Image();
        this.Image.src = imageSrc;
    }

    public draw() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.canvas.width = this.Image.width;
        this.canvas.height = this.Image.height;
        this.ctx = this.canvas.getContext('2d');


        this.ctx.drawImage(this.Image, 0, 0, this.Image.width, this.Image.height,
            0, 0, this.canvas.width, this.canvas.height);

        this.Image.style.display = 'none';

        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        /*
         * Loads a scaled image to fit the canvas without streching.
         * We find the ratio needed by manipulating the width/height.
         */

        document.getElementById('fileInput').addEventListener('change', () => this.imageLoader(), false);

        let scanImage2 = document.getElementById('scanImage2');
        scanImage2.addEventListener('click', () => this.barcodeScanner2());
        let scanImage = document.getElementById('scanImage');
        scanImage.addEventListener('click', () => this.barcodeScanner());
        let invertColor = document.getElementById('invertColor');
        invertColor.addEventListener('click', () => this.invert());
    }

    private imageLoader() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let reader = new FileReader();
        reader.onload = () => {
            let img = new Image();
            img.onload = () => {
                let ct = document.getElementById('measure');
                ct.appendChild(img);
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                ct.removeChild(img);
                this.ctx.drawImage(img, 0, 0);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }

    private barcodeScanner2() {
        let scanWidth = this.canvas.width / 5;
        let scanHeight = this.canvas.height / 5;
        console.log(scanWidth);
        console.log(scanHeight);
        console.log(this.findBluePixel(scanWidth, scanHeight));
    };

    private static scan(x: number, y: number, barcodeWidth: number) {
        for (let i = 0; i < x; i++) {
            for (let j = 0; j < y; j++) {

            }
        }
    }

    /*
     * Scans pixel by pixel in a line and adds corresponding 1's and
     * 0's into the bitStorage array depending on the color it sees
     */
    private barcodeScanner() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;
        let pixel, rgba;
        let bitStorage = [];
        for (let x = 0; x < this.canvas.width; x++) {
            pixel = this.ctx.getImageData(x, 25, 1, 1); //sx, sy, sw, sh
            data = pixel.data;
            rgba = 'rgba(' + data[0] + ', ' + data[1] +
                ', ' + data[2] + ', ' + (data[3] / 255) + ')';
            if (data[1] + data[2] == 510)
                bitStorage.push(1);
            else
                bitStorage.push(0);
        }
        let count = 0;
        let barcode = [];

        /*
         * Reads 50 integers of bitStorage at a time and determines if
         * it translates to a 1 or 0. We do this by taking the avg.
         */

        let total;
        let bit;
        for (let j = 0; j < bitStorage.length / 50; j++) {
            total = 0;
            for (let k = 0; k < 50; k++) {
                total += bitStorage[count++];
            }
            bit = Math.round(total / 50);
            barcode.push(bit);
        }
        console.log(barcode);
    }

    /*
     * Inverts the colors of the barcode given barcode.
     * Used to see if the barcode value changes.
     */
    private invert() {
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    private findBluePixel(scanWidth: number, scanHeight: number) {
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
                // ctx.fillStyle = "red";
                // ctx.fillRect(Math.round(scanWidth/2), j, 1, 1);
                if (this.isBlue(Math.round(scanWidth / 2), j)) {
                    console.log("Success");
                    this.findCenterCircle(scanWidth / 2, j);
                    return "(" + scanWidth / 2 + "," + j + ")";
                }
                // rgba = 'rgba(' + data[0] + ', ' + data[1] +
                //     ', ' + data[2] + ', ' + (data[3] / 255) + ')';
                // console.log(rgba);
            }
        }
    }

    private isBlue(i: number, j: number) {
        let pixel = this.ctx.getImageData(i, j, 1, 1);
        let data = pixel.data;
        return data[0] < 160 && data[1] < 160 && data[2] > 100;
    }

    private findCenterCircle(x: number, y: number) {
        let circleCoords = [];
        if (this.isBlue(x + 1, y)) {
            //we know we are on left side
            console.log("right is blue");
        } else if (this.isBlue(x - 1, y)) {
            //we know we are on right side
            console.log("left is blue");
        } else {
            //we are at top or bottom
        }
    }
}

new scanner('barcode.png').draw();

