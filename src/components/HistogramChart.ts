import { ContextSource } from "../models";
import { BarChart } from "./BarChart";

export class HistogramChart extends BarChart {
    constructor(source: ContextSource) {
        super(source);
    }

    public draw(): void {
        throw Error("Not implemented yet");
    }
}