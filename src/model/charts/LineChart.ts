import LinePlot from "../../plot/LinePlot";
import { ContextSource } from "../types";
import { PointChart } from "./PointChart";

export class LineChart extends PointChart {
    constructor(source: ContextSource) {
        super(source, true);
        this.plot = new LinePlot(this.context);
    }
    public draw(): void {
        this.seriesData.forEach((data) => data.points.sort((p1, p2) => (p1.x - p2.x)));
        this.plot.draw(this.seriesData, this.chartOptions);
    }
}