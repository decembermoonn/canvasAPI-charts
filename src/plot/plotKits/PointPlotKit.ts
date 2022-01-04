import { draw } from "patternomaly";
import { Point, SerieDataCommon, SerieOptionsPoint } from "../../model/types";
import { BoxFrameAndTextCoords } from "../types";
import BasicPlotKit from "./BasicPlotKit";

export default class PointPlotKit extends BasicPlotKit {

    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
    }

    protected override performDrawSingleSerieLegend(boxFrameAndTextCoords: BoxFrameAndTextCoords, serie: SerieDataCommon): void {
        const { ctx } = this;
        const { options, name } = serie;
        const { boxFrame, textCoords } = boxFrameAndTextCoords;
        this.performDrawPoint({
            x: boxFrame.x + boxFrame.w / 2,
            y: boxFrame.y + boxFrame.h / 2
        }, options as SerieOptionsPoint);
        ctx.fillText(name, textCoords.x, textCoords.y, textCoords.maxW);
    }

    public performDrawPoint(coords: Point, options: SerieOptionsPoint): void {
        const { pointShape, pointSize, color } = options;
        if (pointShape == undefined) return;

        const transform: DOMMatrix2DInit = {
            e: coords.x - pointSize / 2,
            f: coords.y - pointSize / 2
        };
        let canvasPattern: CanvasPattern;
        try {
            canvasPattern = draw(pointShape, 'rgba(0,0,0,0)', color, pointSize * 2);
        } catch {
            console.warn(`${pointShape} is invalid shape. See documentation.`);
            return;
        }
        canvasPattern.setTransform(transform);
        this.ctx.fillStyle = canvasPattern;
        this.ctx.fillRect(transform.e, transform.f, pointSize, pointSize);
        this.ctx.fillStyle = 'black';
    }
}