import { ChartOptions, MultiSerieData, SerieOptions } from "../model/types";
import BarPlotKit from "./plotKits/BarPlotKit";
import { applyShapeOrColor } from "./utils";

export default class BarPlot {
    readonly ctx: CanvasRenderingContext2D;
    readonly plotKit: BarPlotKit;
    readonly COL_SPACE_SIZE = 0.75;
    readonly VALUE_BOTTOM_PADDING = 4;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.plotKit = new BarPlotKit(ctx);
    }

    drawBars(labels: string[], series: MultiSerieData[], chartOptions: ChartOptions): void {
        const frames = this.plotKit.prepareChartForDrawing(chartOptions, series);
        const plotFrame = frames.find(frame => frame.id === 'content');
        const labelFrame = frames.find(frame => frame.id === 'labels');
        const { tickCount, tickHeight } = this.plotKit.drawGridHorizontalLines(series, plotFrame);
        const hSpaceBetweenTicks = plotFrame.h / ((tickCount + 1) * tickHeight);

        const serieCount = series.length;
        const barAreas = labels.length;

        const barAreaWidth = plotFrame.w / barAreas;
        const paddingWidth = barAreaWidth * (1 - this.COL_SPACE_SIZE);
        const barAreaWidthPadded = barAreaWidth - 2 * paddingWidth;

        const oneColumnWidth = barAreaWidthPadded / serieCount;

        this.ctx.fillStyle = 'black';
        const yColumnBottom = plotFrame.y + plotFrame.h;
        const pxFontForValue = Math.floor(oneColumnWidth * 0.5);
        this.ctx.font = `${pxFontForValue}px sans-serif`;

        for (let a = 0; a < barAreas; a++) {
            const xAreaBeginning = plotFrame.x + a * barAreaWidth + paddingWidth;
            if (chartOptions.showLabels) {
                this.ctx.font = `${labelFrame.h}px sans-serif`;
                this.ctx.fillStyle = 'black';
                const { width } = this.ctx.measureText(labels[a]);
                const xLabel = xAreaBeginning + (barAreaWidthPadded / 2) - width / 2;
                const yLabel = plotFrame.y + plotFrame.h + labelFrame.h * 0.8;
                this.ctx.fillText(labels[a], xLabel, yLabel, barAreaWidth);
                this.ctx.font = `${pxFontForValue}px sans-serif`;
            }
            for (let s = 0; s < serieCount; s++) {
                const xColumn = xAreaBeginning + s * oneColumnWidth;
                const hColumn = series[s].values[a] * hSpaceBetweenTicks;
                const yColumn = yColumnBottom - hColumn;
                this.drawBar(
                    xColumn,
                    yColumn,
                    oneColumnWidth,
                    hColumn,
                    series[s].options,
                    series[s].values[a]
                );
            }
        }
    }

    private drawBar(xpos: number, ypos: number, width: number, height: number, options: SerieOptions, value: number): void {
        this.fillBar(xpos, ypos, width, height, options);
        const { showValue, borderWidth } = options;
        if (borderWidth)
            this.strokeBar(xpos, ypos, width, height, borderWidth);
        if (showValue)
            this.addBarValue(xpos, ypos, width, value);
    }

    private fillBar(xpos: number, ypos: number, width: number, height: number, options: SerieOptions): void {
        const { color, shape } = options;
        applyShapeOrColor(this.ctx, shape, color);
        this.ctx.fillRect(xpos, ypos, width, height);
    }

    private strokeBar(xpos: number, ypos: number, width: number, height: number, borderWidth: number): void {
        this.ctx.lineWidth = height ? borderWidth : 1;
        this.ctx.beginPath();
        this.ctx.moveTo(xpos, ypos + height);
        this.ctx.lineTo(xpos, ypos);
        this.ctx.lineTo(xpos + width, ypos);
        this.ctx.lineTo(xpos + width, ypos + height);
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();
    }

    private addBarValue(xpos: number, ypos: number, width: number, value: number): void {
        this.ctx.fillStyle = 'black';
        const valueString = String(value);
        const wText = this.ctx.measureText(valueString).width;
        const xValueCentered = xpos + width / 2 - wText / 2;
        this.ctx.fillText(
            valueString,
            xValueCentered,
            ypos - this.VALUE_BOTTOM_PADDING,
            width
        );
    }
}