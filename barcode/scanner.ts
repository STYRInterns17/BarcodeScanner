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
        let generateImage = document.getElementById('generate');
        generateImage.addEventListener('click', () => this.generateImage())
        let scan = document.getElementById('scan');
        scan.addEventListener('click', () => this.scan());
    }

    private generateImage() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let img = new ImageGenerator("1234ABCD1234ABCD1234ABCD", 1000).exportImage();
        img.onload = () => {
            let ct = document.getElementById('measure');
            ct.appendChild(img);
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            ct.removeChild(img);
            this.ctx.drawImage(img, 0, 0);
        };
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
        let scanWidth = this.canvas.width / 3;
        let scanHeight = this.canvas.height / 4;

        console.log(scanWidth);
        console.log(scanHeight);
        console.log(this.findFirstBluePixel(scanWidth, scanHeight));
    };

    private scan() {

        let topCorner: IPoint = {
            x: 840,
            y: 3
        };
        let sideCorner: IPoint = {
            x: 3,
            y: 840
        };
        let bottomCorner: IPoint = {
            x: 709,
            y: 1546
        };

        let heightCalcTriangleWidth = topCorner.x - sideCorner.x;

        let heightCalcTriangleHeight = sideCorner.y - topCorner.y;

        let rotateAngle = Math.atan(heightCalcTriangleHeight / heightCalcTriangleWidth);

        this.ctx.translate(topCorner.x, topCorner.y);
        this.ctx.rotate(rotateAngle);
        this.ctx.fillRect(0, 0, 100, 10);


        let Proportions = new ProportionUtil(topCorner, bottomCorner, sideCorner);
        let imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        let data = imageData.data;
        let pixel, rgba;
        let bitStorage = [];

        for (let x = 226; x < (this.canvas.width / 36) * 24; x++) {
            for (let y = 988; y < (this.canvas.width / 36) * 24; y++) {

                //Check Color
                pixel = this.ctx.getImageData(x, y, 1, 1);
                console.log(x, y);
                this.ctx.fillStyle = "FF00FF";
                this.ctx.fillRect(x, y, 1, 1);
                data = pixel.data;
                rgba = 'rgba(' + data[0] + ', ' + data[1] +
                    ', ' + data[2] + ', ' + (data[3] / 255) + ')';
                console.log(rgba);

                if (data[0] + data[1] + data[2] == 765) //765
                    bitStorage.push(1);
                else if (data[0] + data[1] + data[2] == 420) //420
                    bitStorage.push(0);

                //Add width && Rotate Both points
                x += Proportions.getShortBarWidth() - y * Math.sin(Proportions.getLogoRotation()) + x * Math.cos(Proportions.getLogoRotation());

                y += y * Math.cos(Proportions.getLogoRotation()) + x * Math.sin(Proportions.getLogoRotation());

                console.log(x, y);

                let newPoint: IPoint = {
                    x: x,
                    y: y
                };

                Proportions.getImageCoordFromLogoCoord(newPoint);
            }
        }
        console.log(bitStorage);
    }

    private rotateImage() {
        //Set origin of the screen to the side corner pixel

        //Check if the image after a single counter clockwise rotation
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

    private findFirstBluePixel(scanWidth: number, scanHeight: number) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < scanHeight; j++) {
                let scanX = Math.round(scanWidth / 4 * (3 - i) + scanWidth);
                let scanY = j;
                // this.ctx.fillStyle = "red";
                // this.ctx.fillRect(Math.round(scanWidth / 4) * (3 - i) + scanWidth, j, 1, 1);
                if (this.isBlue(scanX, scanY)) {
                    console.log(this.isBlue(904, 66));
                    console.log("Success");
                    console.log("First blue pixel: ", scanX, " ", scanY);

                    //find top corner of top blue square
                    let firstCoord = this.findTopSquareCorner(scanX, scanY, []);
                    let secondCoord = this.findRightSquareCorner(scanX, scanY, []);
                    console.log(firstCoord, secondCoord);

                    //calculate bluesquare width based of the two corners found
                    let blueSquareWidth = Math.sqrt((Math.pow(firstCoord.x - secondCoord.x, 2)) + Math.pow(firstCoord.y - secondCoord.y, 2));
                    // calculated corners of blue squares we need to check and verify the actual corners
                    let topLeftDist = (blueSquareWidth * 45) / 4;
                    let topBottomDist = (blueSquareWidth * 38) / 4;
                    console.log(topLeftDist, topBottomDist);
                    //this.findBluePixelEstimated(topLeftDist, scanWidth);
                    this.ctx.translate(firstCoord.x, firstCoord.y);
                    this.ctx.rotate(Math.PI / 4);
                    this.ctx.fillRect(0, 1183, 100, 100);
                    this.ctx.fillRect(994, 1183, 2, 2);
                    return ("Found blue pixel");
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

    private findTopSquareCorner(x: number, y: number, squareCoords: Array<IPoint>): IPoint {
        // this.ctx.fillStyle = "red";
        // this.ctx.fillRect(x, y, 1, 1);
        let coord: IPoint = {x: x, y: y};
        if (this.isBlue(x + 1, y)) {
            //we know we are on the left side
            squareCoords.push(coord);
            return this.findTopSquareCorner(x + 1, y - 1, squareCoords);
        } else if (this.isBlue(x - 1, y)) {
            //we know we are on right side
            squareCoords.push(coord);
            return this.findTopSquareCorner(x - 1, y - 1, squareCoords);
        } else {
            return (coord);
        }
    }

    private findRightSquareCorner(x: number, y: number, squareCoords: Array<IPoint>): IPoint {
        squareCoords = [];
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(x, y, 1, 1);
        let coord: IPoint = {x: x, y: y};
        //Might need to increase search area as pixels around square edges tend to be lighter blue
        if (this.isBlue(x + 1, y + 1)) {
            //we know we are on the left side
            console.log("RECURSION!!!");
            return this.findRightSquareCorner(x + 1, y + 1, squareCoords);
        } else {
            //we are at top of square
            console.log(squareCoords);
            return (coord)

        }
    }

    private findBluePixelEstimated(y, scanWidth: number) {
        for (let j = 0; j < scanWidth / 2; j++) {
            let scanX = j;
            let scanY = y;
            if (this.isBlue(scanX, scanY)) {
                console.log("Hooray we found the second square")
                console.log("found the second square at: ",scanX, scanY);
            }
        }
        for (let j = 0; j < scanWidth / 2; j++) {
            let scanX = j;
            let scanY = y + 50;
            if (this.isBlue(scanX, scanY)) {
                console.log("found the second square at: ",scanX, scanY);
            }
        }
        for (let j = 0; j < scanWidth / 2; j++) {
            let scanX = j;
            let scanY = y - 50;
            if (this.isBlue(scanX, scanY)) {
                console.log("found the second square at: ",scanX, scanY);
            }
        }
    }

    private findLeftSquareCorner(x: number, y: number,): IPoint {
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(x, y, 1, 1);
        let coord: IPoint = {x: x, y: y};
        //Might need to increase search area as pixels around square edges tend to be lighter blue
        if (this.isBlue(x - 1, y + 1)) {
            //we know we are on the UPPER left side
            console.log("RECURSIONLEFT!!!");
            return this.findLeftSquareCorner(x - 1, y + 1);
        } else if (this.isBlue(x - 1, y - 1)) {
            console.log("RECURSIONLEFT!!!!!!!");
            return this.findLeftSquareCorner(x - 1, y - 1);
        } else {
            //we are on leftSquare corner
            return (coord)

        }
    }

}

interface IPoint {
    x: number,
    y: number
}
new scanner('barcode.png').draw();