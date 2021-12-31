import { draw } from "patternomaly";
import { ChartOptions, MultiSerieData, SerieDataCommon } from "../model/types";
import { FrameRect, TickInfo } from "./types";
import { getTickInfo } from "./utils";

export default class PlotKit {
    LABELS_SPACE_MULTIPIER = 0.05;
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    // Ideally this should return Array of FrameRect for each frame.
    public prepareChartForDrawing(chartOptions: ChartOptions, series: SerieDataCommon[]): FrameRect {
        const { ctx } = this;
        const { width, height } = ctx.canvas;
        this.ctx.clearRect(0, 0, width, height);

        let contentFrame = this.getContentFrame();
        this.strokeFrame(contentFrame, 'gray', 3);

        if (chartOptions.showTitle && chartOptions.title)
            contentFrame = this.drawTitle(chartOptions.title, contentFrame);
        if (chartOptions.showLegend)
            contentFrame = this.drawLegend(contentFrame, series);
        return contentFrame;
    }

    public drawLabels(frame: FrameRect): FrameRect {
        const h = frame.h * this.LABELS_SPACE_MULTIPIER;
        return {
            x: frame.x,
            y: frame.y,
            w: frame.w,
            h: frame.h - h
        };
    }

    public drawGridHorizontalLines(series: MultiSerieData[], frame: FrameRect): TickInfo {
        const { ctx } = this;
        const MOST_TICKS = 10;
        const max = Math.max(...series.map(serie => Math.max(...serie.values)));
        const { tickCount, tickHeight } = getTickInfo(max, MOST_TICKS);
        const singleH = frame.h / (tickCount + 1);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'gray';
        for (let i = 1; i <= tickCount + 1; i++) {
            const y = frame.y + singleH * i;
            const val = String((tickCount + 1 - i) * tickHeight);
            const { width } = this.ctx.measureText(val);
            ctx.fillText(val, frame.x, y);
            ctx.beginPath();
            ctx.moveTo(frame.x + width, y);
            ctx.lineTo(frame.x + frame.w, y);
            ctx.stroke();
            ctx.closePath();
        }
        return {
            tickCount,
            tickHeight
        };
    }

    private strokeFrame(frame: FrameRect, color: string, width?: number): void {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width ?? 1;
        this.ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
        this.ctx.strokeStyle = 'black';
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
        this.strokeFrame(titleFrame, 'gray', 1);
        return this.getRemainingContentFrame(contentFrame, titleFrame);
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

    private drawSingleSerieLegend(frame: FrameRect, serie: SerieDataCommon): void {
        const PADDING_MULTIPIER = 0.6;
        const { ctx } = this;
        const { options, name } = serie;

        ctx.fillStyle = options.color;
        if (options.shape != undefined) {
            try {
                ctx.fillStyle = draw(options.shape, options.color, 'black');
            } catch {
                console.warn(`${options.shape} is invalid shape. See documentation.`);
            }
        }

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
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
        const { actualBoundingBoxAscent } = ctx.measureText(name);
        ctx.fillText(name, center.x, center.y + actualBoundingBoxAscent / 2, frame.w - orienationLen);
    }

    private drawLegend(contentFrame: FrameRect, series: SerieDataCommon[]): FrameRect {
        const legendFrame = this.getLegendFrame(contentFrame);
        const PADDING_MULTIPIER = 0.75;
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
}