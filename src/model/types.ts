import type { draw } from 'patternomaly';

// Utils
export type ContextSource = string | HTMLCanvasElement | CanvasRenderingContext2D;

export interface Point {
    x: number;
    y: number;
}

type DashString = 'l' | 'p' | 'ls' | 'lls' | 'lp' | 'lppp' | 'lpsp';

export type Dash = number[] | DashString;

// Chart Options
export interface ChartOptions {
    title: string;
    showTitle: boolean;
    showLegend: boolean;
}

export interface MultiChartOptions extends ChartOptions {
    showLabels: boolean;
}

// Serie Options
export interface SerieOptionsCommon {
    color: string;
    showValue: boolean;
    showOnLegend: boolean;
}

export interface SerieOptionsPoint extends SerieOptionsCommon {
    pointShape: Parameters<typeof draw>[0];
    pointSize: number
}

export interface SerieOptionsLine extends SerieOptionsPoint {
    dash: Dash;
    dashWidth: number;
}

export interface SerieOptionsShape extends SerieOptionsCommon {
    shape?: Parameters<typeof draw>[0];
    borderWidth: number;
}

// Serie Data
export interface SerieDataCommon {
    name: string;
    options: SerieOptionsPoint | SerieOptionsLine | SerieOptionsShape;
}

export interface SingleSerieData extends SerieDataCommon {
    value: number;
}

export interface MultiSerieData extends SerieDataCommon {
    values: number[];
}

export interface MultiSeriePointData extends SerieDataCommon {
    points: Point[];
}