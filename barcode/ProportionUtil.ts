/**
 * Created by STYR-Curt on 7/27/2017.
 */
export class ProportionUtil {

    private logo: ILogoDetail;

    /*this.logo = {
     width: 380,
     height: 450,
     BARWIDTH: 10,
     STRIPHEIGHT: 40,
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

        this.logo = {
            width: this.getHypotenuseLength(widthCalcTriangleWidth, widthCalcTriangleHeight),
            height: this.getHypotenuseLength(heightCalcTriangleWidth, heightCalcTriangleHeight),
            BARWIDTH: 10,
            STRIPHEIGHT: 40,
            BARSPERSTRIP: 24,
            radiansRotated: Math.acos(widthCalcTriangleHeight / widthCalcTriangleWidth),
        }
    }


    public getStartingPoint(): IPoint {
        // x and y are inverted accross their respective lengths because the calculation are from the bottom right corner but the orgin is in the top left
        let x = this.logo.width - (this.getCornerWidth() + (this.getShortBarWidth() * this.logo.BARSPERSTRIP));
        let y = this.logo.height - (this.getCornerHeight() / 2);

        return this.getImageCoordFromLogoCoord({x, y});
    }

    public getHalfWayPoint(): IPoint {
        let x = this.getShortBarWidth() * this.logo.BARSPERSTRIP;
        let y = this.getCornerWidth() + (this.getShortBarWidth() * this.logo.BARSPERSTRIP) - (this.getCornerHeight() / 2);

        return this.getImageCoordFromLogoCoord({x, y});
    }

    public getShortBarHeight(): number {
        return this.logo.BARWIDTH / this.logo.height * 100;
    }

    public getShortBarWidth(): number {
        return this.logo.STRIPHEIGHT / this.logo.width * 100;
    }

    public getTallBarHeight(): number {
        return this.logo.STRIPHEIGHT / this.logo.height * 100;
    }

    public getTallBarWidth(): number {
        return this.logo.BARWIDTH / this.logo.width * 100;
    }

    public getCornerHeight(): number {
        return this.logo.STRIPHEIGHT / this.logo.height * 100;
    }

    public getCornerWidth(): number {
        return this.logo.STRIPHEIGHT / this.logo.width * 100;
    }

    private getHypotenuseLength(a: number, b: number): number {
        // Pythagorean theorem
        return Math.sqrt((a * a) + (b * b));
    }


    private getImageCoordFromLogoCoord(logoCoord: IPoint): IPoint {
        // Formula from https://stackoverflow.com/questions/20104611/find-new-coordinates-of-a-point-after-rotation
        // This is for counter clockwise rotation, see source first comment
        let x = (-logoCoord.y * Math.sin(this.logo.radiansRotated)) + (logoCoord.x * Math.cos(this.logo.radiansRotated));
        let y = (logoCoord.y * Math.cos(this.logo.radiansRotated)) + (logoCoord.x * Math.sin(this.logo.radiansRotated));
        return {x: x, y: y};
    }


}

export interface ILogoDetail {
    width: number,
    height: number,
    BARWIDTH: number,
    STRIPHEIGHT: number,
    BARSPERSTRIP: number,
    radiansRotated: number,
}

export interface IPoint {
    x: number,
    y: number
}