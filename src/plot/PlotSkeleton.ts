import { ChartOptions } from "../model/types";
import { FrameRect } from "./types";

export default class PlotSkeleton {
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    private strokeFrameForTest(frame: FrameRect, color: string): void {
        this.ctx.strokeStyle = color;
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

    private drawLegend(contentFrame: FrameRect): FrameRect {
        const legendFrame = this.getLegendFrame(contentFrame);
        this.strokeFrameForTest(legendFrame, 'green');
        return this.getRemainingContentFrame(contentFrame, legendFrame);
    }

    protected prepareChartForDrawing(chartOptions: ChartOptions): FrameRect {
        const { ctx } = this;
        const { width, height } = ctx.canvas;
        this.ctx.clearRect(0, 0, width, height);

        let contentFrame = this.getContentFrame();
        this.strokeFrameForTest(contentFrame, 'blue');
        if (chartOptions.showTitle && chartOptions.title)
            contentFrame = this.drawTitle(chartOptions.title, contentFrame);
        if (chartOptions.showLegend)
            contentFrame = this.drawLegend(contentFrame);
        this.strokeFrameForTest(contentFrame, 'yellow');
        return contentFrame;
    }
}