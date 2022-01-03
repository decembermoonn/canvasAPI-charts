import { ContextSource } from "../model/types";
import { BarChart } from "../model/charts/BarChart";
import { Chart } from "../model/Chart";
import { PieChart } from "../model/charts/PieChart";
import { PointChart } from "../model/charts/PointChart";
import { LineChart } from "../model/charts/LineChart";
import { HistogramChart } from "../model/charts/HistogramChart";
import { AreaChart } from "../model/charts/AreaChart";

export default function serveChart(type: string, source: ContextSource): Chart {
    switch (type.toLowerCase().trim()) {
        case "pie":
            return new PieChart(source);
        case "bar":
            return new BarChart(source);
        case "histogram":
            return new HistogramChart(source);
        case "points":
            return new PointChart(source);
        case "line":
            return new LineChart(source);
        case "area":
            return new AreaChart(source);
        default:
            throw new Error(`${type} chart is not (yet) defined.`);
    }
}