import { ChartOptions, SingleSerieData } from "../model/types";
import PlotSkeleton from "./PlotSkeleton";
import { PiePartData } from "./types";
import { draw } from 'patternomaly';

export default class PiePlot extends PlotSkeleton {

    constructor(skeleton: PlotSkeleton) {
        super(skeleton.ctx);
    }

    drawPie(series: SingleSerieData[], chartOptions: ChartOptions): void {
        const RADIUS_DIVIDER = 2.5;
        const { ctx } = this;
        const plotFrame = this.prepareChartForDrawing(chartOptions, series);
        const data = this.mapSeriesToPiePartData(series);
        const radius = Math.min(plotFrame.w, plotFrame.h) / RADIUS_DIVIDER;
        const center = {
            x: plotFrame.x + plotFrame.w / 2,
            y: plotFrame.y + plotFrame.h / 2
        };

        let total = 0;
        ctx.strokeStyle = 'black';

        data.forEach(entry => {
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.arc(center.x, center.y, radius, total, total + entry.radians);
            ctx.lineTo(center.x, center.y);

            ctx.fillStyle = entry.color;
            if (entry.shape != undefined) {
                try {
                    ctx.fillStyle = draw(entry.shape, entry.color, 'black');
                } catch {
                    console.warn(`${entry.shape} is invalid shape. See documentation.`);
                }
            }
            ctx.fill();
            if (entry.edgeThickness > 0) {
                ctx.lineWidth = entry.edgeThickness;
                ctx.stroke();
            }
            if (entry.showValue) {
                const radVal = total + entry.radians / 2;
                ctx.fillStyle = 'black';
                ctx.font = `${Math.floor(radius / 5)}px sans-serif`;

                const text = String(entry.value);
                const { width, actualBoundingBoxAscent } = ctx.measureText(text);
                const x = (center.x + Math.cos(radVal) * (radius + width)) - (width / 2);
                const y = (center.y + Math.sin(radVal) * (radius + actualBoundingBoxAscent)) + (actualBoundingBoxAscent / 2);
                ctx.fillText(text, x, y);
            }
            total += entry.radians;
        });
    }

    private mapSeriesToPiePartData(series: SingleSerieData[]): PiePartData[] {
        const total = series.map(serie => serie.value).reduce((a, b) => a + b, 0);
        return series.map(serie => ({
            radians: serie.value * 2 * Math.PI / total,
            color: serie.options.color,
            edgeThickness: serie.options.edgeThickness,
            shape: serie.options.shape,
            showValue: serie.options.showValue,
            value: serie.value
        }));
    }
}

