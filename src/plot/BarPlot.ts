import { ChartOptions, MultiSerieData } from "../model/types";
import PlotSkeleton from "./PlotSkeleton";

export default class BarPlot extends PlotSkeleton {
    constructor(skeleton: PlotSkeleton) {
        super(skeleton.ctx);
    }

    drawBar(xpos: number, ypos: number, width: number, height: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.fillRect(xpos, ypos, width, height);
    }

    drawBars(series: MultiSerieData[], chartOptions: ChartOptions): void {
        const COL_SPACE_SIZE = 0.75;
        const plotFrame = this.prepareChartForDrawing(chartOptions, series);
        const tickInfo = this.drawGridHorizontalLines(series, plotFrame);

        const barCount = series.length;
        const singleW = plotFrame.w / barCount;
        const singleWWithPadding = singleW * COL_SPACE_SIZE;
        const spaceX = (singleW - singleWWithPadding) / 2;
        const serieCount = series[0].values.length;
        const oneColumnWidth = singleWWithPadding / serieCount * COL_SPACE_SIZE;
        for (let i = 0; i < serieCount; i++) {
            for (let j = 0; j < barCount; j++) {
                const h = series[j].values[i] * plotFrame.h / tickInfo.tickCount + 1;
                this.drawBar(
                    (plotFrame.x + j * singleW + spaceX) + (i * oneColumnWidth),
                    plotFrame.y + plotFrame.h - h,
                    oneColumnWidth,
                    h,
                    series[i].options.color,
                );
            }
        }
    }
}