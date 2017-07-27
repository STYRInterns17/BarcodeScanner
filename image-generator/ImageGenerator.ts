/**
 * Created by STYRLabs2 on 7/20/2017.
 */

class ImageGenerator {
    private inputString: String;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private imageWidthHeight: number;
    private image: HTMLImageElement;
    private TABLE: String;

    constructor(inputStr: String, imageWidth: number) {
        this.image = new Image();
        this.image.height = imageWidth;
        this.image.width = imageWidth;
        this.inputString = inputStr;
        this.imageWidthHeight = imageWidth;
        this.TABLE = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.createImage();
    }

    private createImage() {
        //Image is 38 boxWidths wide by 45 boxwidths long
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        //calculate canvas height necessary for rotation to still be within canvas
        let canvasHeight = Math.sqrt(Math.pow(this.imageWidthHeight, 2) + Math.pow((this.imageWidthHeight * 45) / 38, 2));
        this.canvas.width = canvasHeight;
        this.canvas.height = canvasHeight;
        this.ctx.fillStyle = "blue";

        //single boxunit is 1 width by 4 height
        let boxWidth = this.imageWidthHeight / 38;
        let boxHeight = boxWidth * 4;

        this.ctx.save();

        let ans = [];
        var pad = "000000";
        for (let i = 0; i < this.inputString.length; i++) {
            let str = this.TABLE.indexOf(this.inputString.charAt(i)).toString(2);
            ans.push(pad.substring(0, pad.length - str.length) + str);
        }
        console.log(ans);

        this.ctx.translate(canvasHeight / 2, canvasHeight / 2);
        this.ctx.rotate((Math.PI/180)* 45);
        //this.ctx.strokeRect(0, 0, 10, 10);
        this.ctx.fillStyle = "green";

        //Draw locator BLUE locator squares
        //this.ctx.fillRect(-this.imageWidthHeight / 2, -(this.imageWidthHeight * 45) / 76, this.imageWidthHeight, (this.imageWidthHeight * 45) / 38);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(-this.imageWidthHeight / 2, -(this.imageWidthHeight * 45) / 76, boxWidth * 4, boxWidth * 4);
        this.ctx.fillRect(this.imageWidthHeight / 2 - boxWidth * 4, (this.imageWidthHeight * 45) / 76 - boxWidth * 4, boxWidth * 4, boxWidth * 4);
        this.ctx.fillRect(-this.imageWidthHeight / 2, (this.imageWidthHeight * 45) / 76 - boxWidth * 4, boxWidth * 4, boxWidth * 4);

        this.ctx.translate(-this.imageWidthHeight / 2, -(this.imageWidthHeight * 45) / 76);

        //draw binary data
        this.populateSection(ans[20], boxWidth * 4, 0, boxWidth * 6, boxHeight, 0, false);
        this.populateSection(ans[21], boxWidth * 10, 0, boxWidth * 6, boxHeight, 0, false);
        this.populateSection(ans[22], boxWidth * 16, 0, boxWidth * 6, boxHeight, 0, false);
        this.populateSection(ans[23], boxWidth * 22, 0, boxWidth * 6, boxHeight, 0, false);
        this.populateSection(ans[19], boxWidth * 4, -boxWidth * 4, boxWidth * 6, boxHeight, 90, true);
        this.populateSection(ans[18], boxWidth * 10, -boxWidth * 4, boxWidth * 6, boxHeight, 90, true);
        this.populateSection(ans[17], boxWidth * 16, -boxWidth * 4, boxWidth * 6, boxHeight, 90, true);
        this.populateSection(ans[16], boxWidth * 22, -boxWidth * 4, boxWidth * 6, boxHeight, 90, true);
        this.populateSection(ans[15], 0, boxWidth * 28, boxWidth * 6, boxHeight, 0, true);
        this.populateSection(ans[14], boxWidth * 6, boxWidth * 28, boxWidth * 6, boxHeight, 0, true);
        this.populateSection(ans[13], boxWidth * 12, boxWidth * 28, boxWidth * 6, boxHeight, 0, true);
        this.populateSection(ans[12], boxWidth * 18, boxWidth * 28, boxWidth * 6, boxHeight, 0, true);

        this.populateSection(ans[11], boxWidth * 14, boxWidth * 13, boxWidth* 6, boxHeight, 0, true);
        this.populateSection(ans[10], boxWidth * 20, boxWidth * 13, boxWidth* 6, boxHeight, 0, true);
        this.populateSection(ans[9], boxWidth * 26, boxWidth * 13, boxWidth* 6, boxHeight, 0, true);
        this.populateSection(ans[8], boxWidth * 32, boxWidth * 13, boxWidth* 6, boxHeight, 0, true);
        this.populateSection(ans[7], boxWidth * 17, -boxWidth * 38, boxWidth * 6, boxHeight, 90, true);
        this.populateSection(ans[6], boxWidth * 23, -boxWidth * 38, boxWidth * 6, boxHeight, 90, true);
        this.populateSection(ans[5], boxWidth * 29, -boxWidth * 38, boxWidth * 6, boxHeight, 90, true);
        this.populateSection(ans[4], boxWidth * 35, -boxWidth * 38, boxWidth * 6, boxHeight, 90, true);
        this.populateSection(ans[3], boxWidth * 28, boxWidth * 41, boxWidth * 6, boxHeight, 0, false);
        this.populateSection(ans[2], boxWidth * 22, boxWidth * 41, boxWidth * 6, boxHeight, 0, false);
        this.populateSection(ans[1], boxWidth * 16, boxWidth * 41, boxWidth * 6, boxHeight, 0, false);
        this.populateSection(ans[0], boxWidth * 10, boxWidth * 41, boxWidth * 6, boxHeight, 0, false);

        this.image.src = this.canvas.toDataURL("image/png");
    }

    private populateSection(binaryStr, x, y, width, height, angle, reverse: boolean) {
        this.ctx.save();
        this.ctx.strokeStyle = "black";
        this.ctx.rotate((Math.PI / 180) * angle);
        this.ctx.translate(x, y);
        this.ctx.strokeRect(0, 0, width, height);

        if (reverse) {
            let inverseJ = 0;
            for (let j = binaryStr.length - 1; j >= 0; j--) {
                this.ctx.fillStyle = binaryStr[j] === '1' ? 'orange' : 'white';
                this.ctx.fillRect(inverseJ * width / 6, 0, width / 6, height);
                this.ctx.strokeRect(inverseJ * width / 6, 0, width / 6, height);
                inverseJ++;
            }
        }
        else {
            for (let j = 0; j < binaryStr.length; j++) {
                if (binaryStr.charAt(j) == '1') {
                    this.ctx.fillStyle = 'orange';
                    this.ctx.fillRect(j * width / 6, 0, width / 6, height);
                    this.ctx.strokeRect(j * width / 6, 0, width / 6, height);
                } else {
                    this.ctx.fillStyle = "white";
                    this.ctx.fillRect(j * width / 6, 0, width / 6, height);
                    this.ctx.strokeRect(j * width / 6, 0, width / 6, height);
                }
            }
        }

        this.ctx.restore();
    }

    public exportImage(): HTMLImageElement{
        return this.image;
    }
}

new ImageGenerator("1234ABCD1234ABCD1234ABCD", 1000);