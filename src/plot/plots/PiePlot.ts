import { SerieOptionsShape, SingleSerieData, ShapeType } from "../../model/types";
import Plot from "./../Plot";
import { DataForPlot, FrameRect, PiePartData } from "./../types";

export default class PiePlot extends Plot {

    protected readonly RADIUS_DIVIDER = 2.5;

    draw(data: DataForPlot): void {
        const series = data.series as SingleSerieData[];
        const chartOptions = data.chartOptions;
        const { ctx } = this;
        const frames = this.plotKit.prepareChartForDrawing(chartOptions, series);
        const plotFrame = frames.find(frame => frame.id === 'content');
        const entries = this.mapSeriesToPiePartData(series, chartOptions.precentageValues as boolean);

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
            this.plotKit.patternTools.applyShapeOrColor(ctx, entry.shape as ShapeType, entry.color as string);
            ctx.fill();
            if (typeof entry.borderWidth === 'number' && entry.borderWidth > 0)
                this.strokeBorder(entry.borderWidth);
            if (entry.showValue)
                this.addPieValue(entry.value, pieCenter.x, pieCenter.y, pieRadius, accRadians + entry.radians / 2, plotFrame, chartOptions.precentageValues as boolean);
            accRadians += entry.radians;
        });
    }

    private mapSeriesToPiePartData(series: SingleSerieData[], showPrecentages = false): PiePartData[] {
        const total = series.map(serie => serie.value).reduce((a, b) => a + b, 0);
        return series.map(serie => ({
            radians: serie.value * 2 * Math.PI / total,
            color: serie.options.color,
            borderWidth: (serie.options as SerieOptionsShape).borderWidth,
            shape: (serie.options as SerieOptionsShape).shape,
            showValue: serie.options.showValue,
            value: showPrecentages ? serie.value / total : serie.value
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

    private addPieValue(value: number, xCenter: number, yCenter: number, radius: number, radians: number, plotFrame: FrameRect, precentage: boolean): void {
        const text = precentage ? `${(value * 100).toPrecision(4)}%` : `${value}`;
        const { width, actualBoundingBoxAscent } = this.ctx.measureText(text);
        const maxTextWidth = (plotFrame.w / 2) - radius;

        const xPointOnPie = xCenter + Math.cos(radians) * radius;
        const x = xPointOnPie - (radians > (Math.PI / 2) && radians < (Math.PI * 1.5) ? Math.min(maxTextWidth, width) : 0);
        const y = (yCenter + Math.sin(radians) * (radius + actualBoundingBoxAscent)) + (actualBoundingBoxAscent / 2);

        this.ctx.fillStyle = 'black';
        this.ctx.fillText(text, x, y, maxTextWidth);
    }
}

