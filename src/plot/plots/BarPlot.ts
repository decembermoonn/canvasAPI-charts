import { MultiChartOptions, MultiSerieData, SerieOptionsShape } from "../../model/types";
import { getTickInfo } from "../utils";
import Plot from "./../Plot";
import { DataForPlot } from "./../types";

export default class BarPlot extends Plot {

    protected readonly COL_SPACE_SIZE = 0.75;
    protected readonly VALUE_BOTTOM_PADDING = 4;

    draw(data: DataForPlot): void {
        const MIN_VAL = 0;
        const Y_LABEL_FONT = 18;
        const series = data.series as MultiSerieData[];
        const chartOptions = data.chartOptions as MultiChartOptions;

        const labels = data.dataLabels;
        const serieCount = series.length;
        const barAreas = labels.length;

        //get three main frames
        let allFrames = this.plotKit.prepareChartForDrawing(chartOptions, series);
        let plotFrame = allFrames.find(frame => frame.id === 'content');

        //split content frame into two
        const maxValueFromSeries = Math.max(...series.map(serie => Math.max(...serie.values)));
        const tickInfo = getTickInfo(this.plotKit.MOST_TICKS, MIN_VAL, maxValueFromSeries);
        const oYwidth = this.plotKit.yGetAxisTextMaxWidth(tickInfo, MIN_VAL, Y_LABEL_FONT);
        const contentWidth = plotFrame.w - oYwidth;

        //having final 'w':
        const barAreaWidth = contentWidth / barAreas;
        const paddingWidth = barAreaWidth * (1 - this.COL_SPACE_SIZE);
        const barAreaWidthPadded = barAreaWidth - 2 * paddingWidth;
        const oneColumnWidth = barAreaWidthPadded / serieCount;

        if (chartOptions.showLabels) {
            const frames = this.plotKit.getLabelsFrameFilled(plotFrame, contentWidth, oYwidth, labels, barAreaWidth, barAreas);
            allFrames = allFrames.filter(frame => frame.id !== 'content');
            allFrames.push(...frames);
        }

        const { tickCount, tickHeight } = tickInfo;
        plotFrame = allFrames.find(frame => frame.id === 'content');
        plotFrame = this.plotKit.drawGridHorizontalLinesNew(plotFrame, tickInfo, MIN_VAL, Y_LABEL_FONT);
        const hSpaceBetweenTicks = plotFrame.h / ((tickCount + 1) * tickHeight);

        this.ctx.fillStyle = 'black';
        const yColumnBottom = plotFrame.y + plotFrame.h;
        const pxFontForValue = Math.floor(oneColumnWidth * 0.5);
        this.ctx.font = `${pxFontForValue}px sans-serif`;

        for (let a = 0; a < barAreas; a++) {
            const xAreaBeginning = plotFrame.x + a * barAreaWidth + paddingWidth;
            for (let s = 0; s < serieCount; s++) {
                const xColumn = xAreaBeginning + s * oneColumnWidth;
                const hColumn = series[s].values[a] * hSpaceBetweenTicks;
                const yColumn = yColumnBottom - hColumn;
                this.drawBar(
                    xColumn,
                    yColumn,
                    oneColumnWidth,
                    hColumn,
                    series[s].options as SerieOptionsShape,
                    series[s].values[a]
                );
            }
        }
    }

    private drawBar(xpos: number, ypos: number, width: number, height: number, options: SerieOptionsShape, value: number): void {
        this.fillBar(xpos, ypos, width, height, options);
        const { showValue, borderWidth } = options;
        if (borderWidth)
            this.strokeBar(xpos, ypos, width, height, borderWidth);
        if (showValue)
            this.addBarValue(xpos, ypos, width, value);
    }

    private fillBar(xpos: number, ypos: number, width: number, height: number, options: SerieOptionsShape): void {
        const { color, shape } = options;
        this.plotKit.patternTools.applyShapeOrColor(this.ctx, shape, color);
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