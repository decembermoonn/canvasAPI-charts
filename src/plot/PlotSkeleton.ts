import { ChartOptions, MultiSerieData, SerieDataCommon } from "../model/types";
import { FrameRect, TickInfo } from "./types";
import { getTickInfo } from "./utils";

export default class PlotSkeleton {
    ctx: CanvasRenderingContext2D;
    strokeFrameForTestEnabled = true;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    private strokeFrameForTest(frame: FrameRect, color: string): void {
        if (this.strokeFrameForTestEnabled) {
            this.ctx.strokeStyle = color;
            this.ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
            this.ctx.strokeStyle = 'black';
        }
    }

    private getContentFrame(): FrameRect {
        const { width, height } = this.ctx.canvas;
        const padding = Math.floor(Math.min(width, height) / 100);
        return {
            x: padding,
            y: padding,
            w: width - 2 * padding,
            h: height - 2 * padding,
        };
    }

    private getTitleFrame(contentFrame: FrameRect): FrameRect {
        const FRAME_HEIGHT_DIVIDER = 10;
        const newH = Math.floor(contentFrame.h / FRAME_HEIGHT_DIVIDER);
        return {
            x: contentFrame.x,
            y: contentFrame.y,
            h: newH,
            w: contentFrame.w
        };
    }

    private getRemainingContentFrame(prev: FrameRect, recent: FrameRect): FrameRect {
        return {
            x: prev.x,
            y: prev.y < recent.y ? prev.y : recent.y + recent.h,
            w: prev.w,
            h: prev.h - recent.h
        };
    }

    private getLegendFrame(frame: FrameRect): FrameRect {
        const FRAME_HEIGHT_DIVIDER = 10;
        const newH = Math.floor(frame.h / FRAME_HEIGHT_DIVIDER);
        return {
            x: frame.x,
            y: frame.y + frame.h - newH,
            h: newH,
            w: frame.w
        };
    }

    private drawTitle(title: string, contentFrame: FrameRect): FrameRect {
        const { ctx } = this;
        const titleFrame = this.getTitleFrame(contentFrame);
        const { x, y, w, h } = titleFrame;
        ctx.font = `${Math.floor(h / 2)}px sans-serif`;
        const textMeasurement = ctx.measureText(title);
        const textWidth = textMeasurement.width;
        const textHeight = textMeasurement.actualBoundingBoxAscent;
        const textPositionX = x + w / 2 - textWidth / 2;
        const textPositionY = y + h / 2 + textHeight / 2;
        ctx.fillText(title, textPositionX, textPositionY, w);
        this.strokeFrameForTest(titleFrame, 'red');
        return this.getRemainingContentFrame(contentFrame, titleFrame);
    }

    private drawSingleSerieLegend(frame: FrameRect, serie: SerieDataCommon): void {
        const PADDING_MULTIPIER = 0.6;
        const { ctx } = this;
        const { options, name } = serie;
        ctx.fillStyle = options.color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        this.strokeFrameForTest(frame, options.color);
        const orienationLen = Math.min(frame.w, frame.h);
        const boxEdgeWidth = orienationLen * PADDING_MULTIPIER;
        const newFrame = {
            x: frame.x + (orienationLen - boxEdgeWidth) / 2,
            y: frame.y + (orienationLen - boxEdgeWidth) / 2,
            w: boxEdgeWidth,
            h: boxEdgeWidth,
        };
        ctx.fillRect(newFrame.x, newFrame.y, newFrame.w, newFrame.h);
        ctx.strokeRect(newFrame.x, newFrame.y, newFrame.w, newFrame.h);
        const center = {
            x: frame.x + orienationLen,
            y: frame.y + orienationLen / 2,
        };
        ctx.fillStyle = 'black';
        ctx.font = `${Math.floor(orienationLen / 4)}px sans-serif`;
        ctx.fillText(name, center.x, center.y, frame.w - orienationLen);
    }

    private drawLegend(contentFrame: FrameRect, series: SerieDataCommon[]): FrameRect {
        const legendFrame = this.getLegendFrame(contentFrame);
        const PADDING_MULTIPIER = 0.75;
        this.strokeFrameForTest(legendFrame, 'green');
        const newW = legendFrame.w * PADDING_MULTIPIER;
        legendFrame.x = legendFrame.x + (legendFrame.w - newW) / 2;
        legendFrame.w = newW;

        const SERIE_LEGEND_PER_LEVEL = 5;
        const levels = Math.ceil(series.length / SERIE_LEGEND_PER_LEVEL);
        const frameW = legendFrame.w / Math.min(series.length, SERIE_LEGEND_PER_LEVEL);
        const frameH = legendFrame.h / levels;
        for (let i = 0; i < series.length; i++) {
            this.drawSingleSerieLegend({
                x: legendFrame.x + frameW * (i % SERIE_LEGEND_PER_LEVEL),
                y: legendFrame.y + frameH * (Math.floor(i / SERIE_LEGEND_PER_LEVEL)),
                w: frameW,
                h: frameH
            }, series[i]);
        }
        return this.getRemainingContentFrame(contentFrame, legendFrame);
    }

    protected prepareChartForDrawing(chartOptions: ChartOptions, series: SerieDataCommon[]): FrameRect {
        const { ctx } = this;
        const { width, height } = ctx.canvas;
        this.ctx.clearRect(0, 0, width, height);

        let contentFrame = this.getContentFrame();
        this.strokeFrameForTest(contentFrame, 'blue');
        if (chartOptions.showTitle && chartOptions.title)
            contentFrame = this.drawTitle(chartOptions.title, contentFrame);
        if (chartOptions.showLegend)
            contentFrame = this.drawLegend(contentFrame, series);
        this.strokeFrameForTest(contentFrame, 'yellow');
        return contentFrame;
    }

    protected drawGridHorizontalLines(series: MultiSerieData[], frame: FrameRect): TickInfo {
        const { ctx } = this;
        const MOST_TICKS = 10;
        const max = Math.max(...series.map(serie => Math.max(...serie.values)));
        const tickInfo = getTickInfo(max, MOST_TICKS);
        const singleH = frame.h / tickInfo.tickCount + 1;
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'gray';
        for (let i = 1; i <= tickInfo.tickCount; i++) {
            const y = frame.y + singleH * i;
            ctx.beginPath();
            ctx.moveTo(frame.x, y);
            ctx.lineTo(frame.x + frame.w, y);
            ctx.stroke();
            ctx.closePath();
        }
        return tickInfo;
    }
}