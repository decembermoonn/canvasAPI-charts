import AreaPlot from "../../plot/AreaPlot";
import { ContextSource, MultiSeriePointData, Point } from "../types";
import { LineChart } from "./LineChart";

export class AreaChart extends LineChart {
    constructor(source: ContextSource) {
        super(source);
        this.plot = new AreaPlot(this.context);
    }

    public draw(): void {
        this.seriesData.forEach((data) => data.points.sort((p1, p2) => (p2.x - p1.x)));
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
                shape: undefined,
                pointShape: undefined,
                pointSize: 0,
                dash: [],
                dashWidth: 1,
            }
        };
    }
}