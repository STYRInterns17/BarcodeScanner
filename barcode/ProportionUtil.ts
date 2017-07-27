/**
 * Created by STYR-Curt on 7/27/2017.
 */
export class ProportionUtil {

    private logo: ILogoDetail;

    /*this.logo = {
     LOGOWIDTH: 380,
     LOGOHEIGHT: 450,
     BARWIDTH: 10,
     STRIPHEIGHT: 40,
     BARSPERSTRIP: 24,
     }*/

    constructor(topCorner: { x: number, y: number }, bottomCorner: { x: number, y: number }, sideCorner: { x: number, y: number }) {
        // Order is this way because the bottom corner will always be below side corner
        let widthCalcTriangleWidth = sideCorner.x - bottomCorner.x;
        let widthCalcTriangleHeight = sideCorner.y - bottomCorner.y;

        // Order is reversed because the top corner will always be above the side corner
        let heightCalcTriangleWidth = topCorner.x - sideCorner.x;
        let heightCalcTriangleHeight = topCorner.y - sideCorner.y;

        this.logo = {
            LOGOWIDTH: this.getHypotenuseLength(widthCalcTriangleWidth,widthCalcTriangleHeight),
            LOGOHEIGHT: this.getHypotenuseLength(heightCalcTriangleWidth,heightCalcTriangleHeight),
            BARWIDTH: 10,
            STRIPHEIGHT: 40,
            BARSPERSTRIP: 24,
        }
    }


    public getStartingPoint(): { x: number, y: number } {
        let x = this.getCornerWidth() + (this.getShortBarWidth() * this.logo.BARSPERSTRIP);
        let y = this.getCornerHeight() / 2;

        return {x: x, y: y};
    }

    private getShortBarHeight(): number {
        return this.logo.BARWIDTH / this.logo.LOGOHEIGHT;
    }

    private getShortBarWidth(): number {
        return this.logo.STRIPHEIGHT / this.logo.LOGOWIDTH;
    }

    private getTallBarHeight(): number {
        return this.logo.STRIPHEIGHT / this.logo.LOGOHEIGHT;
    }

    private getTallBarWidth(): number {
        return this.logo.BARWIDTH / this.logo.LOGOWIDTH;
    }

    private getCornerHeight(): number {
        return this.logo.STRIPHEIGHT / this.logo.LOGOHEIGHT;
    }

    private getCornerWidth(): number {
        return this.logo.STRIPHEIGHT / this.logo.LOGOWIDTH;
    }

    private getHypotenuseLength(a:number, b:number) {
        // Pythagorean theorem
        return Math.sqrt((a * a) + (b * b));
    }


}

export interface ILogoDetail {
    LOGOWIDTH: number,
    LOGOHEIGHT: number,
    BARWIDTH: number,
    STRIPHEIGHT: number,
    BARSPERSTRIP: number
}