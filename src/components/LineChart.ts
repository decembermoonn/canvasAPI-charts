import { ContextSource } from "../models";
import { PointChart } from "./PointChart";

export class LineChart extends PointChart {
    constructor(source: ContextSource) {
        super(source);
    }
    public draw(): void {
        this.seriesData.forEach((data) => data.points.sort((p1, p2) => (p2.x - p1.x)));
        throw Error("Not implemented yet");
    }
}