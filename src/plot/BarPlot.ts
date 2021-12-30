import { ChartOptions, MultiSerieData, SerieOptions } from "../model/types";
import PlotSkeleton from "./PlotSkeleton";
import { draw } from 'patternomaly';

export default class BarPlot extends PlotSkeleton {
    constructor(skeleton: PlotSkeleton) {
        super(skeleton.ctx);
    }

    fillBar(xpos: number, ypos: number, width: number, height: number, color: string, borderWidth?: number, shape?: SerieOptions['shape']): void {
        this.ctx.fillStyle = color;
        if (shape != undefined) {
            try {
                this.ctx.fillStyle = draw(shape, color, 'black');
            } catch {
                console.warn(`${shape} is invalid shape. See documentation.`);
            }
        }
        this.ctx.fillRect(xpos, ypos, width, height);
        if (borderWidth) {
            this.ctx.lineWidth = height ? borderWidth : 1;
            this.strokeBar(xpos, ypos, width, height);
        }
    }

    strokeBar(xpos: number, ypos: number, width: number, height: number): void {
        const { ctx } = this;
        ctx.beginPath();
        ctx.moveTo(xpos, ypos + height);
        ctx.lineTo(xpos, ypos);
        ctx.lineTo(xpos + width, ypos);
        ctx.lineTo(xpos + width, ypos + height);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    drawBars(labels: string[], series: MultiSerieData[], chartOptions: ChartOptions): void {
        const COL_SPACE_SIZE = 0.75;
        let plotFrame = this.prepareChartForDrawing(chartOptions, series);
        let labelFrameH = 0;
        if (chartOptions.showLabels) {
            const befFrameHeight = plotFrame.h;
            plotFrame = this.drawLabels(plotFrame);
            labelFrameH = befFrameHeight - plotFrame.h;
        }
        const { tickCount, tickHeight } = this.drawGridHorizontalLines(series, plotFrame);

        const serieCount = series.length;
        const barAreas = labels.length;

        // split space for each 'sticked' bars equally
        const singleW = plotFrame.w / barAreas;
        const singleWWithPadding = singleW * COL_SPACE_SIZE;
        const spaceX = (singleW - singleWWithPadding) / 2;
        const oneColumnWidth = singleWWithPadding / serieCount;

        if (chartOptions.showLabels) {
            this.ctx.font = `${Math.floor(labelFrameH)}px sans-serif`;
            this.ctx.fillStyle = 'black';
            for (let i = 0; i < labels.length; i++) {
                const { width } = this.ctx.measureText(labels[i]);
                const xPos = plotFrame.x + i * singleW + spaceX - width / 2 + singleWWithPadding / 2;
                this.ctx.fillText(labels[i], xPos, plotFrame.y + plotFrame.h + labelFrameH * 0.8, singleW);
            }
        }
        for (let i = 0; i < serieCount; i++) {
            for (let j = 0; j < barAreas; j++) {
                const x = (plotFrame.x + j * singleW + spaceX) + (i * oneColumnWidth);
                const h = series[i].values[j] * plotFrame.h / ((tickCount + 1) * tickHeight);
                const y = plotFrame.y + plotFrame.h - h;
                this.fillBar(
                    x,
                    y,
                    oneColumnWidth,
                    h,
                    series[i].options.color,
                    series[i].options.edgeThickness,
                    series[i].options.shape
                );
                if (series[i].options.showValue) {
                    const fontSize = Math.floor(oneColumnWidth * 0.5);
                    const strVal = String(series[i].values[j]);
                    this.ctx.font = `${fontSize}px sans-serif`;
                    const { width } = this.ctx.measureText(strVal);
                    this.ctx.fillStyle = 'black';
                    this.ctx.fillText(strVal, x + oneColumnWidth / 2 - width / 2, y - 4, oneColumnWidth);
                }
            }
        }
    }
}