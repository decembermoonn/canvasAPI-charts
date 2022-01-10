import { MultiSeriePointData, Point } from "../types";
import { MultiChart } from "../MultiChart";

export class PointChart extends MultiChart {

    seriesData: MultiSeriePointData[];

    public set points(points: Point[]) {
        const count = this.seriesData.filter((serie) => serie.name.startsWith('serie')).length;
        this.seriesData.push(this.getDefaultSerieObject(points, count + 1));
    }

    public set X(argsPerSerie: number[][]) {
        this.seriesData =
            argsPerSerie.map(
                (args, index) => this.getDefaultSerieObject(
                    args.map(arg => ({
                        x: arg,
                        y: 0
                    })), index
                )
            );
    }

    public set Y(vals: number[][]) {
        const { length } = this.seriesData;
        if (!length)
            throw Error('Values on "X" axis must be specified before setting "Y" values.');
        const minLen = Math.min(vals.length, length);
        for (let i = 0; i < minLen; i++) {
            const internalMinLen = Math.min(vals[i].length, this.seriesData[i].points.length);
            for (let j = 0; j < internalMinLen; j++) {
                this.seriesData[i].points[j].y = vals[i][j];
            }
        }
    }

    protected getDefaultSerieObject(points: Point[], index: number): MultiSeriePointData {
        return {
            name: `serie${index}`,
            points,
            options: {
                color: Math.floor(Math.random() * 16777215).toString(16),
                showValue: false,
                showOnLegend: false,
                pointShape: undefined,
                pointSize: 0,
            }
        };
    }

    public draw(): void {
        this.seriesData.forEach((data) => data.points.sort((p1, p2) => (p1.x - p2.x)));
        super.draw({
            series: this.seriesData,
            chartOptions: this.chartOptions
        });
    }
}