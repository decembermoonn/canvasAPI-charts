import { ContextSource } from "../models";
import { PieChart } from "./PieChart";

export default function serveChart(type: string, source: ContextSource) {
    switch (type.toLowerCase().trim()) {
        case "pie":
            return new PieChart(source);
        default:
            throw new Error(`${type} chart is not defined.`)
    }
}