import LinePlot from "../../plot/LinePlot";
import { ContextSource, MultiSeriePointData, Point } from "../types";
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
    protected override getDefaultSerieObject(points: Point[], index: number): MultiSeriePointData {
        return {
            name: `serie${index}`,
            points,
            options: {
                color: Math.floor(Math.random() * 16777215).toString(16),
                showValue: false,
                showOnLegend: false,
                pointShape: undefined,
                pointSize: 0,
                dash: [],
                dashWidth: 1,
            }
        };
    }
}