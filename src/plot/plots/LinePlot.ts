import { SerieOptionsLine, SerieOptionsPoint } from "../../model/types";
import PointPlot from "./PointPlot";
import { DataForSerieDrawing } from "./../types";

export default class LinePlot extends PointPlot {

    protected override performDrawing(data: DataForSerieDrawing): void {
        const { series, mappers, labelFrame } = data;

        for (let serieIndex = 0; serieIndex < series.length; serieIndex++) {
            const pointsInSerie = series[serieIndex].points.length;
            if (pointsInSerie < 2) continue;
            const path = new Path2D();
            const { points, options } = series[serieIndex];

            const firstPoint = this.mapSpacePointToPixelPoint(points[0], mappers.xFunc, mappers.yFunc);
            path.moveTo(firstPoint.x, firstPoint.y);
            this.drawValueForPoint(points[0].x, firstPoint.x, labelFrame);
            this.plotKit.pointTools.performDrawPoint(firstPoint, options as SerieOptionsPoint);

            for (let pointIndex = 1; pointIndex < pointsInSerie; pointIndex++) {
                const mappedPoint = this.mapSpacePointToPixelPoint(points[pointIndex], mappers.xFunc, mappers.yFunc);
                path.lineTo(mappedPoint.x, mappedPoint.y);
                this.drawValueForPoint(points[pointIndex].x, mappedPoint.x, labelFrame);
                this.plotKit.pointTools.performDrawPoint(mappedPoint, options as SerieOptionsPoint);
            }

            this.plotKit.lineTools.setLineStyle(options as SerieOptionsLine);
            this.ctx.stroke(path);
        }
        this.ctx.setLineDash([]);
    }
}