import { ChartOptions, MultiSeriePointData, Point, SerieOptionsLine } from "../model/types";
import LinePlotKit from "./plotKits/LinePlotKit";
import { MinMax, ValueToPixelMapperFunc } from "./types";

export default class LinePlot {
    readonly ctx: CanvasRenderingContext2D;
    readonly plotKit: LinePlotKit;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.plotKit = new LinePlotKit(ctx);
    }

    drawPoints(series: MultiSeriePointData[], chartOptions: ChartOptions): void {
        const frames = this.plotKit.prepareChartForDrawing(chartOptions, series);
        let plotFrame = frames.find(frame => frame.id === 'content');
        // const labelFrame = frames.find(frame => frame.id === 'labels');

        const xMinMaxForSeries = this.getMinMaxForSeries(series, 'x');
        const yMinMaxForSeries = this.getMinMaxForSeries(series, 'y');
        console.log(xMinMaxForSeries, yMinMaxForSeries);

        plotFrame = this.plotKit.drawGridHorizontalLines(plotFrame, yMinMaxForSeries.min, yMinMaxForSeries.max).tickFrame;

        const xValueToPixelMapperFunc = this.xGetValueToPixelMapperFunc(plotFrame.x, plotFrame.w, xMinMaxForSeries.min, xMinMaxForSeries.max);
        const yValueToPixelMapperFunc = this.yGetValueToPixelMapperFunc(plotFrame.y, plotFrame.h, yMinMaxForSeries.min, yMinMaxForSeries.max);

        series.forEach(serie => {
            this.plotKit.setLineStyle(serie.options as SerieOptionsLine);
            this.ctx.beginPath();
            serie.points.forEach((point, index) => {
                const mappedPoint = this.mapSpacePointToPixelPoint(point, xValueToPixelMapperFunc, yValueToPixelMapperFunc);
                if (index == 0) {
                    this.ctx.moveTo(mappedPoint.x, mappedPoint.y);
                } else {
                    this.ctx.lineTo(mappedPoint.x, mappedPoint.y);
                    this.ctx.moveTo(mappedPoint.x, mappedPoint.y);
                }
            });
            this.ctx.closePath();
            this.ctx.stroke();
        });
    }

    private getMinMaxForSeries(series: MultiSeriePointData[], of: 'x' | 'y'): MinMax {
        if (series.length) {
            const firstSerieWithValues = series.findIndex(serie => serie.points.length);
            if (firstSerieWithValues >= 0) {
                const firstPossibleMinMax = series[firstSerieWithValues].points[0][of];
                const initialMinMax = {
                    x: firstPossibleMinMax,
                    y: firstPossibleMinMax
                };
                const minMaxReduceFunc = this.minMaxReduceFuncFactory(of);
                const minMaxForSeriesArray = series.map(
                    serie => serie.points.reduce(minMaxReduceFunc, initialMinMax),
                );
                const xMinMaxForSeries = minMaxForSeriesArray.reduce(
                    minMaxReduceFunc, minMaxForSeriesArray[0]
                );
                return {
                    min: xMinMaxForSeries.x,
                    max: xMinMaxForSeries.y
                };
            }
        }
        return {
            min: 0,
            max: 0
        };
    }

    private minMaxReduceFuncFactory(of: 'x' | 'y') {
        return (prev: Point, cur: Point): Point => {
            return {
                x: prev.x > cur[of] ? cur[of] : prev.x,
                y: prev.y < cur[of] ? cur[of] : prev.y
            };
        };
    }

    private xGetValueToPixelMapperFunc(bPX: number, wPX: number, bVX: number, eVX: number): ValueToPixelMapperFunc {
        return (val): number => {
            return bPX + wPX * ((val - bVX) / (eVX - bVX));
        };
    }

    private yGetValueToPixelMapperFunc(bPY: number, wPY: number, bVY: number, eVY: number): ValueToPixelMapperFunc {
        return (val): number => {
            return bPY + wPY * (1 - (val - bVY) / (eVY - bVY));
        };
    }

    private mapSpacePointToPixelPoint(point: Point, xMapper: ValueToPixelMapperFunc, yMapper: ValueToPixelMapperFunc): Point {
        return {
            x: xMapper(point.x),
            y: yMapper(point.y)
        };
    }
}