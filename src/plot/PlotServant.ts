import AreaPlot from "./plots/AreaPlot";
import BarPlot from "./plots/BarPlot";
import LinePlot from "./plots/LinePlot";
import PiePlot from "./plots/PiePlot";
import Plot from "./Plot";
import PointPlot from "./plots/PointPlot";

const typeToClassPairs = {
    "pie": PiePlot,
    "bar": BarPlot,
    "histogram": BarPlot,
    "points": PointPlot,
    "line": LinePlot,
    "area": AreaPlot
};

export default function plotServant(ctx: CanvasRenderingContext2D, type: string): Plot {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const ClassRef = typeToClassPairs[type];
    if (ClassRef)
        return new ClassRef(ctx);
    throw new Error(`Plotter for ${type} is not defined.`);
}