import { ContextSource } from "../types";
import { PointChart } from "./PointChart";

export class LineChart extends PointChart {
    constructor(source: ContextSource) {
        super(source);
    }
    public draw(): void {
        this.seriesData.forEach((data) => data.points.sort((p1, p2) => (p1.x - p2.x)));
        this.plot.drawPoints(this.seriesData, this.chartOptions);
    }
}