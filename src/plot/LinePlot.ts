import { MultiSeriePointData, SerieOptionsLine } from "../model/types";
import PlotKit from "./plotKits/PlotKit";
import PointPlot from "./PointPlot";
import { FrameRect, ValueToPixelMapperFuncPair } from "./types";

export default class LinePlot extends PointPlot {
    protected override performDrawing(series: MultiSeriePointData[], mappers: ValueToPixelMapperFuncPair, labelFrame: FrameRect): void {
        if (this.plotKit == undefined)
            this.plotKit = new PlotKit(this.ctx, this);
        series.forEach(serie => {
            this.plotKit.lineTools.setLineStyle(serie.options as SerieOptionsLine);
            this.ctx.beginPath();
            serie.points.forEach((point, index) => {
                const mappedPoint = this.mapSpacePointToPixelPoint(point, mappers.xFunc, mappers.yFunc);
                if (index == 0) {
                    this.ctx.moveTo(mappedPoint.x, mappedPoint.y);
                } else {
                    this.ctx.lineTo(mappedPoint.x, mappedPoint.y);
                    this.ctx.moveTo(mappedPoint.x, mappedPoint.y);
                }
                this.drawValueForPoint(point.x, mappedPoint.x, labelFrame);
            });
            this.ctx.closePath();
            this.ctx.stroke();
        });
        this.ctx.setLineDash([]);
    }
}