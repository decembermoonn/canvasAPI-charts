import { ContextSource } from "../model/types";
import { BarChart } from "../model/charts/BarChart";
import { Chart } from "../model/Chart";
import { PieChart } from "../model/charts/PieChart";
import { PointChart } from "../model/charts/PointChart";
import { LineChart } from "../model/charts/LineChart";
import { HistogramChart } from "../model/charts/HistogramChart";
import { AreaChart } from "../model/charts/AreaChart";

const typeToClassPairs = {
    "pie": PieChart,
    "bar": BarChart,
    "histogram": HistogramChart,
    "points": PointChart,
    "line": LineChart,
    "area": AreaChart
};

export default function serveChart(type: string, source: ContextSource): Chart {
    const ClassRef = typeToClassPairs[type.toLowerCase().trim() as keyof typeof typeToClassPairs];
    if (ClassRef)
        return new ClassRef(source, type);
    throw new Error(`${type} chart is not defined.`);
}