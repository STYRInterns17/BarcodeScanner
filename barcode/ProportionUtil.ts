/**
 * Created by STYR-Curt on 7/27/2017.
 */
export class ProportionUtil {

    private logo: ILogoDetail;
    private strips: IStrip[] = [];
    private dataPoints: IPoint[] = [];


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
            radiansRotated: Math.atan(heightCalcTriangleHeight / heightCalcTriangleWidth) // If the logo is rotated
        };

        this.buildStripLocations();
        this.buildDataPoints();

    }

    public getDataPoints(): IPoint[] {
        return this.dataPoints;
    }

    private buildStripLocations(): void {

        this.strips.push({
            start: {x: 10.5 * this.getTallBarWidth(), y: 43 * this.getShortBarHeight()},
            length: this.logo.BARSPERSTRIP,
            isVertical: false
        });

        this.strips.push({
            start: {x: 36 * this.getTallBarWidth(), y: 17.5 * this.getShortBarHeight()},
            length: this.logo.BARSPERSTRIP,
            isVertical: true
        });

        this.strips.push({
            start: {x: 14.5 * this.getTallBarWidth(), y: 15 * this.getShortBarHeight()},
            length: this.logo.BARSPERSTRIP,
            isVertical: false
        });

        this.strips.push({
            start: {x: 0.5 * this.getTallBarWidth(), y: 30 * this.getShortBarHeight()},
            length: this.logo.BARSPERSTRIP,
            isVertical: false
        });
        this.strips.push({
            start: {x: 2 * this.getTallBarWidth(), y: 4.5 * this.getShortBarHeight()},
            length: this.logo.BARSPERSTRIP,
            isVertical: true
        });

        this.strips.push({
            start: {x: 4.5 * this.getTallBarWidth(), y: 2 * this.getShortBarHeight()},
            length: this.logo.BARSPERSTRIP,
            isVertical: false
        });


    }

    private buildDataPoints(): void {
        for (let i = 0; i < this.strips.length; i++) {
            this.dataPoints.concat(this.getDataPointsOfStrip(this.strips[i]));
        }

        for (let i = 0; i < this.dataPoints.length; i++) {
            // Add offset to account for the rest of the image to DataPoint Coordinates
            this.dataPoints[i] = this.getImageCoordFromLogoCoord(this.dataPoints[i]);
        }
    }

    private getDataPointsOfStrip(strip: IStrip): IPoint[] {
        // ShortBars scans left to right
        // Tall bars are scanned top to bottom
        let data: IPoint[] = [];
        if (strip.isVertical) {
            for (let i = 0; i < this.logo.BARSPERSTRIP; i++) {
                data.push({x: strip.start.x, y: strip.start.y + i * this.getShortBarHeight()})
            }
        } else {
            for (let i = 0; i < this.logo.BARSPERSTRIP; i++) {
                data.push({x: strip.start.x + i * this.getTallBarWidth(), y: strip.start.y})
            }
        }
        return data;

    }

    public getLogoRotation(): number {
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


    private rotatePointAboutTopCorner(logoCoord: IPoint): IPoint {
        // Formula from https://stackoverflow.com/questions/20104611/find-new-coordinates-of-a-point-after-rotation
        // Addition information about translating origin https://gamedev.stackexchange.com/questions/86755/how-to-calculate-corner-positions-marks-of-a-rotated-tilted-rectangle

        // Translate point to topCorner
        let tempX = logoCoord.x - this.topCorner.x;
        let tempY = logoCoord.y - this.topCorner.y;
        // Apply rotation
        let rotatedX = (-tempY * Math.sin(this.logo.radiansRotated)) + (tempX * Math.cos(this.logo.radiansRotated));
        let rotatedY = (tempY * Math.cos(this.logo.radiansRotated)) + (tempX * Math.sin(this.logo.radiansRotated));
        // Undo original translation
        let x = rotatedX + this.topCorner.x;
        let y = rotatedY + this.topCorner.y;
        return {x: x, y: y};
    }

    private getImageCoordFromLogoCoord(logoCoord: IPoint): IPoint {
        let x = logoCoord.x + this.sideCorner.x;
        let y = logoCoord.y + this.topCorner.y

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

export interface IStrip {
    start: IPoint,
    length: number,
    isVertical: boolean
}