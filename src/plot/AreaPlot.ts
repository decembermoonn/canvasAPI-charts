import { SerieOptionsLine, SerieOptionsShape } from "../model/types";
import LinePlot from "./LinePlot";
import PlotKit from "./plotKits/PlotKit";
import { DataForSerieDrawing } from "./types";

export default class AreaPlot extends LinePlot {
    PIXEL_PADDING = 0;

    protected override performDrawing(data: DataForSerieDrawing): void {
        const { series, mappers, labelFrame } = data;
        const bottom = mappers.yFunc(data.yMinForSeries);
        if (this.plotKit == undefined)
            this.plotKit = new PlotKit(this.ctx, this);
        series.forEach(serie => {
            this.plotKit.lineTools.setLineStyle(serie.options as SerieOptionsLine);
            this.plotKit.patternTools.applyShapeOrColor(this.ctx, (serie.options as SerieOptionsShape).shape, serie.options.color);
            const path = new Path2D();
            serie.points.forEach((point, index) => {
                const mappedPoint = this.mapSpacePointToPixelPoint(point, mappers.xFunc, mappers.yFunc);
                if (index == 0) {
                    path.moveTo(mappedPoint.x, bottom);
                    path.lineTo(mappedPoint.x, mappedPoint.y);
                } else if (index == serie.points.length - 1) {
                    path.lineTo(mappedPoint.x, mappedPoint.y);
                    path.lineTo(mappedPoint.x, bottom);
                    path.closePath();
                } else {
                    path.lineTo(mappedPoint.x, mappedPoint.y);
                }
                this.drawValueForPoint(point.x, mappedPoint.x, labelFrame);
            });
            this.ctx.fill(path);
        });
        this.ctx.setLineDash([]);
    }
}