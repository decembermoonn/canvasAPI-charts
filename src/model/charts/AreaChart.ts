import { ContextSource } from "../types";
import { PointChart } from "./PointChart";

export class AreaChart extends PointChart {
    constructor(source: ContextSource) {
        super(source);
    }

    public draw(): void {
        this.seriesData.forEach((data) => data.points.sort((p1, p2) => (p2.x - p1.x)));
        throw Error("Not implemented yet");
    }
}