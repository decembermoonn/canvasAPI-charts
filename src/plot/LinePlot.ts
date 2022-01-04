import { ChartOptions, MultiSeriePointData, Point, SerieOptionsLine } from "../model/types";
import LinePlotKit from "./plotKits/LinePlotKit";
import { MinMax, ValueToPixelMapperFunc, ValueToPixelMapperOptions } from "./types";

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

        const { tickCount, tickFrame } = this.plotKit.drawGridHorizontalLines(plotFrame, yMinMaxForSeries.min, yMinMaxForSeries.max);
        plotFrame = tickFrame;
        const spaceBetweenTicksPixelHeight = plotFrame.h / (tickCount + 1);

        const xValueToPixelMapperOptions: ValueToPixelMapperOptions = {
            beginningInPixels: plotFrame.x + 10,
            widthOrHeightInPixels: plotFrame.w - 20,
            minValueFromSeries: xMinMaxForSeries.min,
            maxValueFromSeries: xMinMaxForSeries.max
        };
        const yValueToPixelMapperOptions: ValueToPixelMapperOptions = {
            beginningInPixels: plotFrame.y + spaceBetweenTicksPixelHeight,
            widthOrHeightInPixels: plotFrame.h - spaceBetweenTicksPixelHeight,
            minValueFromSeries: yMinMaxForSeries.min,
            maxValueFromSeries: yMinMaxForSeries.max
        };
        const xValueToPixelMapperFunc = this.xGetValueToPixelMapperFunc(xValueToPixelMapperOptions);
        const yValueToPixelMapperFunc = this.yGetValueToPixelMapperFunc(yValueToPixelMapperOptions);

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
        this.ctx.setLineDash([]);
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

    private xGetValueToPixelMapperFunc(opt: ValueToPixelMapperOptions): ValueToPixelMapperFunc {
        return (val): number => {
            return opt.beginningInPixels + opt.widthOrHeightInPixels
                * ((val - opt.minValueFromSeries) / (opt.maxValueFromSeries - opt.minValueFromSeries));
        };
    }

    private yGetValueToPixelMapperFunc(opt: ValueToPixelMapperOptions): ValueToPixelMapperFunc {
        return (val): number => {
            return opt.beginningInPixels + opt.widthOrHeightInPixels
                * (1 - (val - opt.minValueFromSeries) / (opt.maxValueFromSeries - opt.minValueFromSeries));
        };
    }

    private mapSpacePointToPixelPoint(point: Point, xMapper: ValueToPixelMapperFunc, yMapper: ValueToPixelMapperFunc): Point {
        return {
            x: xMapper(point.x),
            y: yMapper(point.y)
        };
    }
}