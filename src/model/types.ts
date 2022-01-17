import type { draw } from 'patternomaly';

// Utils
export type ContextSource = string | HTMLCanvasElement | CanvasRenderingContext2D;

export interface Point {
    x: number;
    y: number;
}

type DashString = 'l' | 'p' | 'ls' | 'lls' | 'lp' | 'lppp' | 'lpsp';

export type Dash = number[] | DashString;

export type ShapeType = Parameters<typeof draw>[0];

// Chart Options
export interface ChartOptions extends Record<string, unknown> {
    title: string;
    showTitle: boolean;
    showLegend: boolean;
}

export interface MultiChartOptions extends ChartOptions {
    showLabels: boolean;
}

// Serie Options
export interface SerieOptionsCommon extends Record<string, unknown> {
    color: string;
    showValue: boolean;
    showOnLegend: boolean;
}

export interface SerieOptionsPoint extends SerieOptionsCommon {
    pointShape: ShapeType;
    pointSize: number
}

export interface SerieOptionsLine extends SerieOptionsPoint {
    dash: Dash;
    dashWidth: number;
}

export interface SerieOptionsShape extends SerieOptionsCommon {
    shape?: ShapeType;
    borderWidth: number;
}

// Serie Data
export interface SerieDataCommon {
    name: string;
    options: SerieOptionsCommon | SerieOptionsPoint | SerieOptionsLine | SerieOptionsShape;
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