import { ChartOptions, MultiSerieData, SerieDataCommon } from "../../model/types";
import { FrameRect, TickInfo } from "../types";
import { applyShapeOrColor, getTickInfo } from "../utils";

export default class BasicPlotKit {
    readonly TITLE_AREA_MULTIPIER = 0.1;
    readonly LEGEND_AREA_MULTIPIER = 0.1;
    readonly LEGEND_PADDING_MULTIPIER = 0.75;
    readonly SERIE_LEGEND_PER_LEVEL = 5;
    readonly SERIE_PADDING_MULTIPIER = 0.6;
    readonly MOST_TICKS = 10;
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public prepareChartForDrawing(chartOptions: ChartOptions, series: SerieDataCommon[]): FrameRect[] {
        const { ctx } = this;
        const { width, height } = ctx.canvas;
        this.ctx.clearRect(0, 0, width, height);

        const frames: FrameRect[] = [];
        let emptyFrame = this.getFrame(0, 0, width, height, 'content');
        this.strokeFrame(emptyFrame, 'gray', 3);

        if (chartOptions.showTitle && chartOptions.title) {
            const titleFrame = this.getTitleFrame(emptyFrame);
            frames.push(titleFrame);
            this.drawTitle(chartOptions.title, titleFrame);
            emptyFrame = this.cutFrames(emptyFrame, titleFrame);
        }

        if (chartOptions.showLegend) {
            const legendFrame = this.getLegendFrame(emptyFrame);
            frames.push(legendFrame);
            this.drawLegend(series, legendFrame);
            emptyFrame = this.cutFrames(emptyFrame, legendFrame);
        }

        frames.push(emptyFrame);
        return frames;
    }

    private getTitleFrame(frame: FrameRect): FrameRect {
        const { x, y, w, h } = frame;
        const hSpace = h * this.TITLE_AREA_MULTIPIER;
        return this.getFrame(x, y, w, hSpace, 'title');
    }

    private getLegendFrame(frame: FrameRect): FrameRect {
        const { x, y, w, h } = frame;
        const hSpace = h * this.LEGEND_AREA_MULTIPIER;
        return this.getFrame(x, y + h - hSpace, w, hSpace, 'legend');
    }

    protected getFrame(x: number, y: number, w: number, h: number, id?: string): FrameRect {
        return { id, x, y, w, h };
    }

    protected cutFrames(frame: FrameRect, cut: FrameRect): FrameRect {
        const h = frame.h === cut.h ? frame.h : frame.h - cut.h;
        const y = frame.y === cut.y ? frame.y + cut.h : frame.y;
        const { x, w, id } = frame;
        //const x = frame.x === cut.x ? frame.x : frame.x + cut.w;
        //const w = frame.w === cut.w ? frame.w : frame.w - cut.w;
        return { x, y, w, h, id };
    }

    private strokeFrame(frame: FrameRect, color: string, width?: number): void {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width ?? 1;
        this.ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
        this.ctx.strokeStyle = 'black';
    }

    public drawGridHorizontalLines(series: MultiSerieData[], frame: FrameRect): TickInfo {
        const { ctx } = this;
        const max = Math.max(...series.map(serie => Math.max(...serie.values)));
        const { tickCount, tickHeight } = getTickInfo(max, this.MOST_TICKS);
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

    private drawTitle(title: string, titleFrame: FrameRect): void {
        const { ctx } = this;
        const { x, y, w, h } = titleFrame;
        ctx.font = `${Math.floor(h / 2)}px sans-serif`;
        const textMeasurement = ctx.measureText(title);
        const textWidth = textMeasurement.width;
        const textHeight = textMeasurement.actualBoundingBoxAscent;
        const textPositionX = x + w / 2 - textWidth / 2;
        const textPositionY = y + h / 2 + textHeight / 2;
        ctx.fillText(title, textPositionX, textPositionY, w);
        this.strokeFrame(titleFrame, 'gray', 1);
    }

    private drawLegend(series: SerieDataCommon[], legendFrame: FrameRect): void {
        const newW = legendFrame.w * this.LEGEND_PADDING_MULTIPIER;
        legendFrame.x = legendFrame.x + (legendFrame.w - newW) / 2;
        legendFrame.w = newW;

        const levels = Math.ceil(series.length / this.SERIE_LEGEND_PER_LEVEL);
        const frameW = legendFrame.w / Math.min(series.length, this.SERIE_LEGEND_PER_LEVEL);
        const frameH = legendFrame.h / levels;
        for (let i = 0; i < series.length; i++) {
            this.drawSingleSerieLegend({
                x: legendFrame.x + frameW * (i % this.SERIE_LEGEND_PER_LEVEL),
                y: legendFrame.y + frameH * (Math.floor(i / this.SERIE_LEGEND_PER_LEVEL)),
                w: frameW,
                h: frameH
            }, series[i]);
        }
    }

    private drawSingleSerieLegend(frame: FrameRect, serie: SerieDataCommon): void {
        const { ctx } = this;
        const { options, name } = serie;

        applyShapeOrColor(ctx, options.shape, options.color);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        const orienationLen = Math.min(frame.w, frame.h);
        const boxEdgeWidth = orienationLen * this.SERIE_PADDING_MULTIPIER;
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
}