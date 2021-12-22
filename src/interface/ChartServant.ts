import { ContextSource } from "../model/types";
import { BarChart } from "../model/BarChart";
import { Chart } from "../model/Chart";
import { PieChart } from "../model/PieChart";

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