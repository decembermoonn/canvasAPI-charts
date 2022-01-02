import { ChartOptions, SingleSerieData } from "../model/types";
import BasicPlotKit from "./plotKits/BasicPlotKit";
import { PiePartData } from "./types";
import { applyShapeOrColor } from "./utils";

export default class PiePlot {
    readonly ctx: CanvasRenderingContext2D;
    readonly plotKit: BasicPlotKit;
    readonly RADIUS_DIVIDER = 2.5;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.plotKit = new BasicPlotKit(ctx);
    }

    drawPie(series: SingleSerieData[], chartOptions: ChartOptions): void {
        const { ctx } = this;
        const frames = this.plotKit.prepareChartForDrawing(chartOptions, series);
        const plotFrame = frames.find(frame => frame.id === 'content');
        const entries = this.mapSeriesToPiePartData(series);

        const pieRadius = Math.min(plotFrame.w, plotFrame.h) / this.RADIUS_DIVIDER;
        const pieCenter = {
            x: plotFrame.x + plotFrame.w / 2,
            y: plotFrame.y + plotFrame.h / 2
        };

        let accRadians = 0;
        ctx.strokeStyle = 'black';
        ctx.font = `${Math.floor(pieRadius / 5)}px sans-serif`;

        entries.forEach(entry => {
            this.makePiePartPath(pieCenter.x, pieCenter.y, pieRadius, accRadians, accRadians + entry.radians);
            applyShapeOrColor(ctx, entry.shape, entry.color);
            ctx.fill();
            if (entry.borderWidth > 0)
                this.strokeBorder(entry.borderWidth);
            if (entry.showValue)
                this.addPieValue(entry.value, pieCenter.x, pieCenter.y, pieRadius, accRadians + entry.radians / 2);
            accRadians += entry.radians;
        });
    }

    private mapSeriesToPiePartData(series: SingleSerieData[]): PiePartData[] {
        const total = series.map(serie => serie.value).reduce((a, b) => a + b, 0);
        return series.map(serie => ({
            radians: serie.value * 2 * Math.PI / total,
            color: serie.options.color,
            borderWidth: serie.options.borderWidth,
            shape: serie.options.shape,
            showValue: serie.options.showValue,
            value: serie.value
        }));
    }

    private makePiePartPath(xCenter: number, yCenter: number, radius: number, startAngle: number, endAngle: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(xCenter, yCenter);
        this.ctx.arc(xCenter, yCenter, radius, startAngle, endAngle);
        this.ctx.lineTo(xCenter, yCenter);
    }

    private strokeBorder(width: number): void {
        this.ctx.lineWidth = width;
        this.ctx.stroke();
    }

    private addPieValue(value: number, xCenter: number, yCenter: number, radius: number, radians: number): void {
        const text = String(value);
        const { width, actualBoundingBoxAscent } = this.ctx.measureText(text);
        const x = (xCenter + Math.cos(radians) * (radius + width)) - (width / 2);
        const y = (yCenter + Math.sin(radians) * (radius + actualBoundingBoxAscent)) + (actualBoundingBoxAscent / 2);
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(text, x, y);
    }
}

