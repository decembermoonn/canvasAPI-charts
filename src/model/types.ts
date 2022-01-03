import type { draw } from 'patternomaly';

export interface ChartOptions {
    title: string;
    showTitle: boolean;
    showLegend: boolean;
    showLabels?: boolean;
}

export interface SerieOptionsCommon {
    color: string;
    showValue: boolean;
    showOnLegend: boolean;
}

type DashString = 'l' | 'p' | 'ls' | 'lls' | 'lp' | 'lppp' | 'lpsp';

export type Dash = number[] | DashString;

export interface SerieOptionsLine extends SerieOptionsCommon {
    dash: Dash;
    dashWidth: number;
}

export interface SerieOptionsArea extends SerieOptionsCommon {
    shape?: Parameters<typeof draw>[0];
    borderWidth: number;
}

export interface SerieDataCommon {
    name: string;
    options: SerieOptionsLine | SerieOptionsArea;
}

export interface SingleSerieData extends SerieDataCommon {
    value: number;
}

export interface MultiSerieData extends SerieDataCommon {
    values: number[];
}

export interface Point {
    x: number;
    y: number;
}

export interface MultiSeriePointData extends SerieDataCommon {
    points: Point[];
}

export type ContextSource = string | HTMLCanvasElement | CanvasRenderingContext2D;

export type ResizeObserverEntryUpdated = ResizeObserverEntry & { devicePixelContentBoxSize?: ResizeObserverSize[] }
