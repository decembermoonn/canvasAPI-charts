import { MultiSeriePointData, Point } from "../types";
import { LineChart } from "./LineChart";

export class AreaChart extends LineChart {
    protected getDefaultSerieObject(points: Point[], index: number): MultiSeriePointData {
        const obj = super.getDefaultSerieObject(points, index);
        Object.assign(obj.options, {
            shape: undefined,
        });
        return obj;
    }
}