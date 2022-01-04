import { ChartOptions, MultiSeriePointData, Point, SerieOptionsPoint } from "../model/types";
import PointPlotKit from "./plotKits/PointPlotKit";
import { FrameRect, MinMax, ValueToPixelMapperFunc, ValueToPixelMapperFuncPair, ValueToPixelMapperOptions } from "./types";

export default class PointPlot {
    readonly ctx: CanvasRenderingContext2D;
    readonly plotKit: PointPlotKit;

    constructor(ctx: CanvasRenderingContext2D, plotKit?: PointPlotKit) {
        this.ctx = ctx;
        this.plotKit = plotKit ?? new PointPlotKit(ctx);
    }

    public draw(series: MultiSeriePointData[], chartOptions: ChartOptions): void {
        const frames = this.plotKit.prepareChartForDrawing(chartOptions, series);
        let plotFrame = frames.find(frame => frame.id === 'content');
        const labelFrame = frames.find(frame => frame.id === 'labels');

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
        this.performDrawing(series, {
            xFunc: xValueToPixelMapperFunc,
            yFunc: yValueToPixelMapperFunc
        }, labelFrame);
    }

    protected performDrawing(series: MultiSeriePointData[], mappers: ValueToPixelMapperFuncPair, labelFrame: FrameRect): void {
        series.forEach(serie => {
            serie.points.forEach(point => {
                const mappedPoint = this.mapSpacePointToPixelPoint(point, mappers.xFunc, mappers.yFunc);
                this.plotKit.performDrawPoint(mappedPoint, serie.options as SerieOptionsPoint);
                this.drawValueForPoint(point.x, mappedPoint.x, labelFrame);
            });
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

    protected mapSpacePointToPixelPoint(point: Point, xMapper: ValueToPixelMapperFunc, yMapper: ValueToPixelMapperFunc): Point {
        return {
            x: xMapper(point.x),
            y: yMapper(point.y)
        };
    }

    protected drawValueForPoint(xValue: number, xPixelPos: number, labelFrame: FrameRect): void {
        const text = String(xValue);
        const { width, actualBoundingBoxAscent } = this.ctx.measureText(text);
        this.ctx.fillText(String(xValue), xPixelPos - width / 2, labelFrame.y + labelFrame.h / 2 + actualBoundingBoxAscent / 2);
    }
}