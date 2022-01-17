import AreaPlot from "./plots/AreaPlot";
import BarPlot from "./plots/BarPlot";
import LinePlot from "./plots/LinePlot";
import PiePlot from "./plots/PiePlot";
import Plot from "./Plot";
import PointPlot from "./plots/PointPlot";

const typeToClassPairs = {
    "pie": PiePlot,
    "bar": BarPlot,
    "points": PointPlot,
    "line": LinePlot,
    "area": AreaPlot
};

export default function plotServant(ctx: CanvasRenderingContext2D, type: string): Plot {
    const ClassRef = typeToClassPairs[type as keyof typeof typeToClassPairs];
    if (ClassRef)
        return new ClassRef(ctx, type);
    throw new Error(`Plotter for ${type} is not defined.`);
}