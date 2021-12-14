import { ContextSource } from "../models";
import { Chart } from "./Chart";
import { PieChart } from "./PieChart";

export default function serveChart(type: string, source: ContextSource): Chart {
    switch (type.toLowerCase().trim()) {
        case "pie":
            return new PieChart(source);
        default:
            throw new Error(`${type} chart is not defined.`)
    }
}