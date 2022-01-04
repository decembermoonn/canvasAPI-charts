import { SerieDataCommon } from "../../model/types";
import { BoxFrameAndTextCoords } from "../types";

export default abstract class AbstractPlotTools {
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public abstract performDrawSingleSerieLegend(boxFrameAndTextCoords: BoxFrameAndTextCoords, serie: SerieDataCommon): void;
}