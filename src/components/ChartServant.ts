import { ContextSource } from "../models";
import { BarChart } from "./BarChart";
import { Chart } from "./Chart";
import { PieChart } from "./PieChart";

export default function serveChart(type: string, source: ContextSource): Chart {
    switch (type.toLowerCase().trim()) {
        case "pie":
            return new PieChart(source);
        case "bar":
            return new BarChart(source);
        default:
            throw new Error(`${type} chart is not defined.`);
    }
}