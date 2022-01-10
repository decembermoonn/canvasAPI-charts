import { MultiSeriePointData, Point } from "../types";
import { PointChart } from "./PointChart";

export class LineChart extends PointChart {
    protected override getDefaultSerieObject(points: Point[], index: number): MultiSeriePointData {
        const obj = super.getDefaultSerieObject(points, index);
        Object.assign(obj.options, {
            dash: [],
            dashWidth: 1,
        });
        return obj;
    }
}