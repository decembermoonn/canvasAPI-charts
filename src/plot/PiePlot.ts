import { ChartOptions, SingleSerieData } from "../model/types";
import PlotSkeleton from "./PlotSkeleton";
import { PiePartData } from "./types";

export default class PiePlot extends PlotSkeleton {

    constructor(skeleton: PlotSkeleton) {
        super(skeleton.ctx);
    }

    drawPie(series: SingleSerieData[], chartOptions: ChartOptions): void {
        // should be 2 to fill whole available space
        const RADIUS_DIVIDER = 2.5;
        const { ctx } = this;
        const plotFrame = this.prepareChartForDrawing(chartOptions);
        const data = this.mapSeriesToPieDegAndColor(series);
        const radius = Math.min(plotFrame.w, plotFrame.h) / RADIUS_DIVIDER;
        const center = {
            x: plotFrame.x + plotFrame.w / 2,
            y: plotFrame.y + plotFrame.h / 2
        };
        let total = 0;
        //fill
        data.forEach(entry => {
            ctx.fillStyle = entry.color;
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.arc(center.x, center.y, radius, total, total += entry.rad);
            ctx.lineTo(center.x, center.y);
            ctx.fill();
        });
        total = 0;
        //stroke
        data.forEach(entry => {
            if (entry.thickness > 0) {
                ctx.strokeStyle = 'black';
                ctx.lineWidth = entry.thickness;
                ctx.beginPath();
                ctx.moveTo(center.x, center.y);
                ctx.arc(center.x, center.y, radius, total, total += entry.rad);
                ctx.lineTo(center.x, center.y);
                ctx.stroke();
            } else {
                total += entry.rad;
            }
        });
    }

    private mapSeriesToPieDegAndColor(series: SingleSerieData[]): PiePartData[] {
        const total = series.map(serie => serie.value).reduce((a, b) => a + b, 0);
        return series.map(serie => ({
            rad: serie.value * 2 * Math.PI / total,
            color: serie.options.color,
            thickness: serie.options.edgeThickness
        }));
    }
}

