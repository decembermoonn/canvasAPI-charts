export interface ChartOptions {
    title: string;
    showTitle: boolean;
    showLegend: boolean;
}

export interface SerieOptions {
    color: Color;
    showLabels: boolean;
    edgeThickness: number;
    showOnLegend: boolean
}

interface SerieDataCommon {
    name: string;
    options: SerieOptions;
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

export interface Color {
    r: number,
    g: number,
    b: number,
    a: number,
}

export type ContextSource = string | HTMLCanvasElement | WebGLRenderingContext;


export interface TickInfo {
    tickHeight: number;
    tickCount: number;
}

export type ResizeObserverEntryUpdated = ResizeObserverEntry & { devicePixelContentBoxSize?: ResizeObserverSize[] }
