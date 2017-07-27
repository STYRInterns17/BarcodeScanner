/**
 * Created by STYR-Curt on 7/27/2017.
 */
export class ProportionUtil {

    private logo: ILogoDetail;

    /*this.logo = {
     width: 380,
     height: 450,
     barWidth: 10,
     stripHeight: 40,
     BARSPERSTRIP: 24,
     }*/

    // topCorner is as a person looking at the image would say is the top
    constructor(private topCorner: IPoint, private bottomCorner: IPoint, private sideCorner: IPoint) {
        // Order is this way because the bottom corner will always be greater than side
        let widthCalcTriangleWidth = bottomCorner.x - sideCorner.x;
        let widthCalcTriangleHeight = bottomCorner.y - sideCorner.y;

        // Order is different because the top corner will always be get in x but less than y to the side corner
        let heightCalcTriangleWidth = topCorner.x - sideCorner.x;
        let heightCalcTriangleHeight = sideCorner.y - topCorner.y;

        let width = this.getHypotenuseLength(widthCalcTriangleWidth, widthCalcTriangleHeight);
        let height = this.getHypotenuseLength(heightCalcTriangleWidth, heightCalcTriangleHeight);

        this.logo = {
            width: width, // The width of the logo in pixels
            height: height, // The height of the logo in pixels
            barWidth: 1 / 38, // A bar is 1/38th of the logo width
            stripHeight: 4 / 38, // A bar is 4/38ths of the logo width, the logo is drawn
            BARSPERSTRIP: 24, // There are 24 bars of data in each strip of the logo
            radiansRotated: 180 - 90 - Math.atan(heightCalcTriangleHeight / heightCalcTriangleWidth) // If the logo is rotated
        }
    }


    public getStartingPoint(): IPoint {
        // x and y are inverted accross their respective lengths because the calculation are from the bottom right corner but the orgin is in the top left
        let x = this.logo.width - (this.getCornerWidth() + (this.getShortBarWidth() * this.logo.BARSPERSTRIP) - (this.getShortBarWidth() / 2));
        let y = this.logo.height - (this.getCornerHeight() / 2);

        return this.getImageCoordFromLogoCoord({x, y});
    }

    public getHalfWayPoint(): IPoint {
        let x = this.getShortBarWidth() * this.logo.BARSPERSTRIP;
        let y = this.getCornerWidth() + (this.getShortBarWidth() * this.logo.BARSPERSTRIP) - (this.getCornerHeight() / 2);

        return this.getImageCoordFromLogoCoord({x, y});
    }

    public getLogoRotation():number {
        return this.logo.radiansRotated;
    }

    public getShortBarHeight(): number {
        return this.logo.barWidth * this.logo.height;
    }

    public getShortBarWidth(): number {
        return this.logo.stripHeight * this.logo.width;
    }

    public getTallBarHeight(): number {
        return this.logo.stripHeight * this.logo.height;
    }

    public getTallBarWidth(): number {
        return this.logo.barWidth * this.logo.width;
    }

    public getCornerHeight(): number {
        return this.logo.stripHeight * this.logo.height;
    }

    public getCornerWidth(): number {
        return this.logo.stripHeight * this.logo.width;
    }

    private getHypotenuseLength(a: number, b: number): number {
        // Pythagorean theorem
        return Math.sqrt((a * a) + (b * b));
    }


    private getImageCoordFromLogoCoord(logoCoord: IPoint): IPoint {
        // Formula from https://stackoverflow.com/questions/20104611/find-new-coordinates-of-a-point-after-rotation
        // Addition information about translating origin https://gamedev.stackexchange.com/questions/86755/how-to-calculate-corner-positions-marks-of-a-rotated-tilted-rectangle

        // Translate point to topCorner
        let tempX = logoCoord.x  - this.topCorner.x;
        let tempY = logoCoord.y - this.topCorner.y;
        // Apply rotation
        let rotatedX = (tempY * Math.sin(this.logo.radiansRotated)) + (tempX * Math.cos(this.logo.radiansRotated));
        let rotatedY = (-tempY * Math.cos(this.logo.radiansRotated)) + (tempX * Math.sin(this.logo.radiansRotated));
        // Undo original translation
        let x = rotatedX + this.topCorner.x;
        let y = rotatedY + this.topCorner.y;
        return {x: x, y: y};
    }


}

export interface ILogoDetail {
    width: number,
    height: number,
    barWidth: number,
    stripHeight: number,
    BARSPERSTRIP: number,
    radiansRotated: number,
}

export interface IPoint {
    x: number,
    y: number
}