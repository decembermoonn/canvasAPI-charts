import { SerieOptionsLine, SerieOptionsPoint, SerieOptionsShape } from "../../model/types";
import LinePlot from "./LinePlot";
import { DataForSerieDrawing } from "../types";

export default class AreaPlot extends LinePlot {

    protected override PIXEL_PADDING = 0;

    protected override performDrawing(data: DataForSerieDrawing): void {
        const { series, mappers, labelFrame, yMinForSeries } = data;
        const bottom = mappers.yFunc(yMinForSeries);

        for (let serieIndex = 0; serieIndex < series.length; serieIndex++) {
            const pointsInSerie = series[serieIndex].points.length;
            if (pointsInSerie < 2) continue;
            const path = new Path2D();
            const { points, options } = series[serieIndex];

            const firstPoint = this.mapSpacePointToPixelPoint(points[0], mappers.xFunc, mappers.yFunc);
            path.moveTo(firstPoint.x, bottom);
            path.lineTo(firstPoint.x, firstPoint.y);
            this.drawValueForPoint(points[0].x, firstPoint.x, labelFrame);
            this.plotKit.pointTools.performDrawPoint(firstPoint, options as SerieOptionsPoint);

            for (let pointIndex = 1; pointIndex < pointsInSerie - 1; pointIndex++) {
                const mappedPoint = this.mapSpacePointToPixelPoint(points[pointIndex], mappers.xFunc, mappers.yFunc);
                path.lineTo(mappedPoint.x, mappedPoint.y);
                this.drawValueForPoint(points[pointIndex].x, mappedPoint.x, labelFrame);
                this.plotKit.pointTools.performDrawPoint(firstPoint, options as SerieOptionsPoint);
            }

            const lastPoint = this.mapSpacePointToPixelPoint(points[pointsInSerie - 1], mappers.xFunc, mappers.yFunc);
            path.lineTo(lastPoint.x, lastPoint.y);
            path.lineTo(lastPoint.x, bottom);
            this.drawValueForPoint(points[pointsInSerie - 1].x, lastPoint.x, labelFrame);
            this.plotKit.pointTools.performDrawPoint(lastPoint, options as SerieOptionsPoint);

            this.plotKit.lineTools.setLineStyle(options as SerieOptionsLine);
            this.plotKit.patternTools.applyShapeOrColor(this.ctx, (options as SerieOptionsShape).shape, options.color);
            this.ctx.fill(path);
            this.ctx.strokeStyle = 'black';
            this.ctx.stroke(path);
        }
        this.ctx.setLineDash([]);
    }
}