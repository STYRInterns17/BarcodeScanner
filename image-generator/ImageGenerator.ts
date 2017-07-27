/**
 * Created by STYRLabs2 on 7/20/2017.
 */
const TABLE = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";


class ImageGenerator {
    private inputString: String;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private imageWidth: number;
    private imageHeight: number;

    constructor(inputStr: String, imageWidth: number, imageHeight: number) {
        this.inputString = inputStr;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
    }

    public createImage() {

        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = "blue";
        //right most edge of circle is 100px away from left corner of S


        // this.ctx.arc(280,270, 20, 0 , 360, false);
        // this.ctx.fill();
        // this.ctx.closePath();
        // this.ctx.arc(280,680, 20, 0 , 360, false);
        // this.ctx.fill();
        // this.ctx.closePath();
        // this.ctx.arc(900,270, 20, 0 , 360, false);
        // this.ctx.fill();
        // this.ctx.closePath();

        this.ctx.translate(300, 0);
        //this.ctx.rotate((Math.PI/180)* 40);

        this.ctx.save();

        let ans = [];
        var pad = "000000";
        for (let i = 0; i < this.inputString.length; i++) {
            let str = TABLE.indexOf(this.inputString.charAt(i)).toString(2);
            ans.push(pad.substring(0, pad.length - str.length) + str);
        }
        console.log(ans);

        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(0, 50, 40, 40);

        this.ctx.fillRect(340, 460, 40, 40);
        //this.ctx.strokeRect(340, 460, 40, 40);


        this.populateSection(ans[20], 40, 50, 60, 40, 0, false);
        this.populateSection(ans[21], 100, 50, 60, 40, 0, false);
        this.populateSection(ans[22], 160, 50, 60, 40, 0, false);
        this.populateSection(ans[23], 220, 50, 60, 40, 0, false);
        this.populateSection(ans[19], 90, -40, 60, 40, 90, true);
        this.populateSection(ans[18], 150, -40, 60, 40, 90, true);
        this.populateSection(ans[17], 210, -40, 60, 40, 90, true);
        this.populateSection(ans[16], 270, -40, 60, 40, 90, true);
        this.populateSection(ans[15], 0, 330, 60, 40, 0, true);
        this.populateSection(ans[14], 60, 330, 60, 40, 0, true);
        this.populateSection(ans[13], 120, 330, 60, 40, 0, true);
        this.populateSection(ans[12], 180, 330, 60, 40, 0, true);

        this.populateSection(ans[11], 140, 180, 60, 40, 0, true);
        this.populateSection(ans[10], 200, 180, 60, 40, 0, true);
        this.populateSection(ans[9], 260, 180, 60, 40, 0, true);
        this.populateSection(ans[8], 320, 180, 60, 40, 0, true);
        this.populateSection(ans[7], 220, -380, 60, 40, 90, true);
        this.populateSection(ans[6], 280, -380, 60, 40, 90, true);
        this.populateSection(ans[5], 340, -380, 60, 40, 90, true);
        this.populateSection(ans[4], 400, -380, 60, 40, 90, true);
        this.populateSection(ans[3], 280, 460, 60, 40, 0, false);
        this.populateSection(ans[2], 220, 460, 60, 40, 0, false);
        this.populateSection(ans[1], 160, 460, 60, 40, 0, false);
        this.populateSection(ans[0], 100, 460, 60, 40, 0, false);
        this.ctx.fillRect(100, 50, 10, 450);
        this.ctx.fillRect(0, 300, 380, 10);
    }

    private populateSection(binaryStr, x, y, width, height, angle, reverse: boolean) {
        this.ctx.save();
        this.ctx.strokeStyle = "black";
        this.ctx.rotate((Math.PI / 180) * angle);
        this.ctx.translate(x, y);
        this.ctx.strokeRect(0, 0, width, height);

        if (reverse) {
            let inverseJ=0;
            for (let j = binaryStr.length - 1; j >= 0; j--) {
                console.log(j);
                console.log(binaryStr[j]);
                this.ctx.fillStyle = binaryStr[j] === '1'?'orange':'white';
                this.ctx.fillRect(inverseJ * 10, 0, width / 6, height);
                this.ctx.strokeRect(inverseJ * 10, 0, width / 6, height);
                inverseJ++;
            }
        }
        else {
            for (let j = 0; j < binaryStr.length; j++) {
                if (binaryStr.charAt(j) == '1') {
                    this.ctx.fillStyle = 'orange';
                    this.ctx.fillRect(j * 10, 0, width / 6, height);
                    this.ctx.strokeRect(j * 10, 0, width / 6, height);
                } else {
                    this.ctx.fillStyle = "white";
                    this.ctx.fillRect(j * 10, 0, width / 6, height);
                    this.ctx.strokeRect(j * 10, 0, width / 6, height);
                }
            }
        }

        console.log(binaryStr);
        this.ctx.restore();
    }
}

new ImageGenerator("1234ABCD1234ABCD1234ABCD", 300, 300).createImage();

