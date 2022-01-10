import { MultiSeriePointData, Point } from "../types";
import { PointChart } from "./PointChart";

export class LineChart extends PointChart {
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