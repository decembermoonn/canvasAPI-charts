import { ContextSource } from "../model/types";
import { BarChart } from "../model/BarChart";
import { Chart } from "../model/Chart";
import { PieChart } from "../model/PieChart";
import { PointChart } from "../model/PointChart";

export default function serveChart(type: string, source: ContextSource): Chart {
    switch (type.toLowerCase().trim()) {
        case "pie":
            return new PieChart(source);
        case "bar":
            return new BarChart(source);
        case "points":
            return new PointChart(source);
        default:
            throw new Error(`${type} chart is not defined.`);
    }
}