import { ChartOptions, MultiChartOptions, SerieDataCommon } from "../../model/types";
import { BoxFrameAndTextCoords, FrameRect, TickInfo } from "../types";
import { parseFloatWithoutPadding } from "../utils";
import LinePlotTools from "./LinePlotTools";
import PatternPlotTools from "./PatternPlotTools";
import PointPlotTools from "./PointPlotTools";

export default class PlotKit {
    readonly CHART_BORDER_COLOR = '#202020';
    readonly DIVIDER_LINE_COLOR = '#484848';
    readonly HORIZONTAL_LINE_COLOR = '#808080';

    readonly TITLE_AREA_MULTIPIER = 0.1;
    readonly LEGEND_AREA_MULTIPIER = 0.1;
    readonly LEGEND_PADDING_MULTIPIER = 1;
    readonly SERIE_LEGEND_PER_LEVEL = 5;
    readonly SERIE_PADDING_MULTIPIER = 0.15;
    readonly LABELS_AREA_MULTIPIER = 0.05;
    readonly MOST_TICKS = 10;
    readonly ctx: CanvasRenderingContext2D;
    readonly plotType: string;
    readonly lineTools: LinePlotTools;
    readonly patternTools: PatternPlotTools;
    readonly pointTools: PointPlotTools;

    constructor(ctx: CanvasRenderingContext2D, plotType: string) {
        this.ctx = ctx;
        this.plotType = plotType;
        this.lineTools = new LinePlotTools(ctx);
        this.patternTools = new PatternPlotTools(ctx);
        this.pointTools = new PointPlotTools(ctx);
    }


    /**
     * Clears canvas and splits whole canvas in three areas:
     * - Title area (`title`),
     * - Chart area (`content`),
     * - Legend area (`legend`)
     * 
     * Title and Legend frames are completly drawn. Chart frame is empty.
     * @returns Those three frames.
    */
    public prepareChartForDrawing(chartOptions: ChartOptions | MultiChartOptions, series: SerieDataCommon[]): FrameRect[] {
        const { ctx } = this;
        const { width, height } = ctx.canvas;
        this.ctx.clearRect(0, 0, width, height);

        const frames: FrameRect[] = [];
        let emptyFrame = this.getFrame(0, 0, width, height, 'content');
        this.strokeFrame(emptyFrame, this.DIVIDER_LINE_COLOR, 5);

        if (chartOptions.showTitle && chartOptions.title) {
            const titleFrame = this.getTitleFrame(emptyFrame);
            frames.push(titleFrame);
            this.drawTitle(chartOptions.title, titleFrame);
            emptyFrame = this.cutFrames(emptyFrame, titleFrame);
        }

        if (chartOptions.showLegend) {
            const legendFrame = this.getLegendFrame(emptyFrame, series.length);
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

    private getLegendFrame(frame: FrameRect, serieCount: number): FrameRect {
        const { x, y, w, h } = frame;
        const delta = serieCount >= 10 ? Math.sqrt((serieCount - 10) / 10) : 0;
        const hSpace = h * (0.1 + delta * this.LEGEND_AREA_MULTIPIER);
        return this.getFrame(x, y + h - hSpace, w, hSpace, 'legend');
    }

    /**
     * Should be removed and instead getLabelsFrameFilled should be used
     * But... No time for implementation...
     * @returns label frame basic.
     * @deprecated
    */
    public getBasicLabelsFrame(frame: FrameRect): FrameRect {
        const { x, y, w, h } = frame;
        const hSpace = h * this.LABELS_AREA_MULTIPIER;
        return this.getFrame(x, y + h - hSpace, w, hSpace, 'labels');
    }

    protected getFrame(x: number, y: number, w: number, h: number, id?: string): FrameRect {
        return { id, x, y, w, h };
    }

    public cutFrames(frame: FrameRect, cut: FrameRect): FrameRect {
        const h = frame.h === cut.h ? frame.h : frame.h - cut.h;
        const y = frame.y === cut.y ? frame.y + cut.h : frame.y;
        const { x, w, id } = frame;
        //const x = frame.x === cut.x ? frame.x : frame.x + cut.w;
        //const w = frame.w === cut.w ? frame.w : frame.w - cut.w;
        return { x, y, w, h, id };
    }

    /**
     * Calculate width of OY values in content frame.
     * @param tickInfo - previously calculated TickInfo
     * @param minVal - value with which tickInfo begins
     * @param font - font of OY values
     * @returns width of OY values in content frame
    */
    public getWidthOfValuesPane(tickInfo: TickInfo, minVal: number, font: number): number {
        const { tickCount, tickHeight } = tickInfo;
        this.ctx.font = `${font}px sans-serif`;
        const yAxisTextMaxWidth = this.measureTickTextMaxWidth(tickCount, tickHeight, minVal);
        return yAxisTextMaxWidth;
    }

    /**
     * Gets two frames from plot frame
     * - Content frame (`content`),
     * - Labels frame (`labels`),
     * @param plotFrame
     * @param oyWidth - width of calculated pane for OY values
     * @param labels - array of labels
     * @param areaWidth - width of single area
     * @param areas - number of all areas
     * @returns width of OY values in content frame
    */
    public getLabelsFrameFilled(plotFrame: FrameRect, oyWidth: number, labels: string[], areaWidth: number, areas: number): FrameRect[] {
        // Get initial frame height and longest label string
        const MAX_LOOP = 4;
        const num = Math.max(...labels.map(label => label.length));
        const txt = labels.find(e => e.length === num);
        let labelFrameH = plotFrame.h * this.LABELS_AREA_MULTIPIER;

        // Set initial font and measure text
        this.ctx.font = `${labelFrameH}px sans-serif`;
        let measurement = this.ctx.measureText(txt);

        // If measured text is too large, try to shrink it few times
        let iLoop = 1;
        for (; iLoop < MAX_LOOP && measurement.width > areaWidth; iLoop++) {
            const newFontSize = Math.max(labelFrameH - iLoop, 5);
            this.ctx.font = `${newFontSize}px sans-serif`;
            measurement = this.ctx.measureText(txt);
        }
        let width = measurement.width;

        // Save context state
        this.ctx.save();

        // If shrinking didn't work - its time to rotate all labels 90 degrees
        const rot = iLoop === MAX_LOOP;
        const ROTATED_HEIGHT_ADDITIONAL_MULTIP = 0.1;
        if (rot) {
            labelFrameH = (1 + ROTATED_HEIGHT_ADDITIONAL_MULTIP) * measurement.width;
            width = measurement.actualBoundingBoxAscent;
        }

        // Draw labels
        const xAreaAdditional = (areaWidth - width) / 2;
        const yAreaAdditional = (labelFrameH - measurement.actualBoundingBoxAscent) / 2;

        const xAreaBeginning = (plotFrame.x + oyWidth)
            + (rot ? 2 * xAreaAdditional : xAreaAdditional);
        const yArea = plotFrame.y + plotFrame.h
            - (rot ? labelFrameH * ROTATED_HEIGHT_ADDITIONAL_MULTIP * 0.5 : yAreaAdditional);

        this.ctx.translate(xAreaBeginning, yArea);
        if (rot) this.ctx.rotate(-Math.PI / 2);

        for (let a = 0; a < areas; a++) {
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(labels[a], 0, 0);
            const translation = rot ? [0, areaWidth] : [areaWidth, 0];
            this.ctx.translate(translation[0], translation[1]);
        }

        // Restore default context state
        this.ctx.restore();

        // Return fra
        const contentFrame = {
            id: 'content',
            x: plotFrame.x,
            y: plotFrame.y,
            w: plotFrame.w,
            h: plotFrame.h - labelFrameH
        };
        const labelsFrame = {
            id: 'labels',
            x: plotFrame.x,
            y: contentFrame.y + contentFrame.h,
            w: contentFrame.w,
            h: labelFrameH
        };
        return [contentFrame, labelsFrame];
    }

    private strokeFrame(frame: FrameRect, color: string, width?: number): void {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width ?? 1;
        this.ctx.strokeRect(frame.x, frame.y, frame.w, frame.h);
        this.ctx.strokeStyle = 'black';
    }

    private measureTickTextMaxWidth(tickCount: number, tickHeight: number, min: number): number {
        let maxMeasurement = 0;
        for (let i = 1; i <= tickCount + 1; i++) {
            const measurement = this.ctx.measureText(
                String(
                    parseFloatWithoutPadding(min + (tickCount + 1 - i) * tickHeight, 4)
                )
            ).width;
            if (measurement > maxMeasurement)
                maxMeasurement = measurement;
        }
        return maxMeasurement;
    }

    /**
     * Gets two frames from plot frame
     * - Content frame (`content`),
     * - Labels frame (`labels`),
     * @param frame - frame dedicated to OY values and plot content (without labels frame)
     * @param tickInfo - previously calculated TickInfo
     * @param min - number from which ticking should begin
     * @param font - font of OY values
     * @returns frame of only plotting content to be filled in future
    */
    public drawGridHorizontalLines(frame: FrameRect, tickInfo: TickInfo, min: number, font: number): FrameRect {
        const { ctx } = this;
        const { tickCount, tickHeight } = tickInfo;
        const singleH = frame.h / (tickCount + 1);
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.HORIZONTAL_LINE_COLOR;
        ctx.font = `${font}px sans-serif`;
        const maxWidth = this.measureTickTextMaxWidth(tickCount, tickHeight, min);
        for (let i = 1; i <= tickCount + 1; i++) {
            const y = frame.y + singleH * i;
            const val = String(parseFloatWithoutPadding(min + (tickCount + 1 - i) * tickHeight, 4));
            const { width } = ctx.measureText(val);
            ctx.fillText(val, frame.x + (maxWidth - width), y);
            ctx.beginPath();
            ctx.moveTo(frame.x + maxWidth, y);
            ctx.lineTo(frame.x + frame.w, y);
            ctx.stroke();
            ctx.closePath();
        }
        return {
            x: frame.x + maxWidth,
            y: frame.y,
            w: frame.w - maxWidth,
            h: frame.h
        };
    }

    private drawTitle(title: string, titleFrame: FrameRect): void {
        const { ctx } = this;
        const { x, y, w, h } = titleFrame;

        ctx.font = `${Math.floor(h / 2)}px sans-serif`;
        let textMeasurement = ctx.measureText(title);
        let textWidth = textMeasurement.width;

        if (textWidth > w) {
            ctx.font = `${Math.floor((h / 2) * (w / textWidth))}px sans-serif`;
            textMeasurement = ctx.measureText(title);
            textWidth = textMeasurement.width;
        }

        const textHeight = textMeasurement.actualBoundingBoxAscent;
        const textPositionX = x + w / 2 - textWidth / 2;
        const textPositionY = y + h / 2 + textHeight / 2;
        ctx.fillText(title, textPositionX, textPositionY, w);
        this.strokeFrame(titleFrame, this.DIVIDER_LINE_COLOR, 1);
    }

    private drawLegend(series: SerieDataCommon[], legendFrame: FrameRect): void {
        this.strokeFrame(legendFrame, this.DIVIDER_LINE_COLOR, 1);
        const levels = Math.ceil(series.length / this.SERIE_LEGEND_PER_LEVEL);
        const frameW = legendFrame.w / Math.min(series.length, this.SERIE_LEGEND_PER_LEVEL);
        const frameH = legendFrame.h / levels;

        for (let i = 0; i < series.length; i++) {
            this.drawSingleSerieLegend({
                x: legendFrame.x + frameW * (i % this.SERIE_LEGEND_PER_LEVEL),
                y: legendFrame.y + frameH * (Math.floor(i / this.SERIE_LEGEND_PER_LEVEL)),
                w: frameW,
                h: frameH
            }, series[i], series.length);
        }
    }

    protected drawSingleSerieLegend(frame: FrameRect, serie: SerieDataCommon, serieCount: number): void {
        const boxFrameAndTextCoords = this.prepareSingleSerieLegend(frame, serie, serieCount);
        this.performDrawSingleSerieLegend(boxFrameAndTextCoords, serie);
    }

    protected prepareSingleSerieLegend(frame: FrameRect, serie: SerieDataCommon, serieCount: number): BoxFrameAndTextCoords {
        const { ctx } = this;
        const { name } = serie;

        const sEdgeOuterBox = Math.min(frame.w, frame.h);
        const sPadding = sEdgeOuterBox * this.SERIE_PADDING_MULTIPIER;
        const sEdgeInnerBox = sEdgeOuterBox - 2 * sPadding;

        const moreThanOneLevel = serieCount > this.SERIE_LEGEND_PER_LEVEL;
        const fontDivider = moreThanOneLevel ? 2 : 3;
        ctx.font = `${Math.floor(sEdgeOuterBox / fontDivider)}px sans-serif`;

        const { width, actualBoundingBoxAscent } = ctx.measureText(name);
        const overlap = width > frame.w - sEdgeOuterBox;
        const boxAndTextW = width + sEdgeOuterBox;

        const boxFrame = {
            x: frame.x + (overlap || moreThanOneLevel ? sPadding : (frame.w - boxAndTextW) / 2),
            y: frame.y + sPadding,
            w: sEdgeInnerBox,
            h: sEdgeInnerBox
        };
        const textCoords = {
            x: boxFrame.x + sEdgeInnerBox + sPadding,
            y: boxFrame.y + (sEdgeInnerBox / 2) + (actualBoundingBoxAscent / 2),
            maxW: overlap || moreThanOneLevel ? frame.w - sEdgeOuterBox : (frame.w - (frame.w - boxAndTextW) / 2 - sEdgeOuterBox)
        };
        return {
            boxFrame,
            textCoords,
        };
    }

    protected performDrawSingleSerieLegend(boxFrameAndTextCoords: BoxFrameAndTextCoords, serie: SerieDataCommon): void {
        if (["bar", "pie", "area"].includes(this.plotType))
            this.patternTools.performDrawSingleSerieLegend(boxFrameAndTextCoords, serie);
        if (this.plotType === "points")
            this.pointTools.performDrawSingleSerieLegend(boxFrameAndTextCoords, serie);
        if (this.plotType === "line") {
            this.lineTools.performDrawSingleSerieLegend(boxFrameAndTextCoords, serie);
        }
    }
}