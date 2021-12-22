export interface ChartOptions {
    title: string;
    showTitle: boolean;
    showLegend: boolean;
}

export interface SerieOptions {
    color: string;
    showLabels: boolean;
    edgeThickness: number;
    showOnLegend: boolean
}

export interface SerieDataCommon {
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

export type ContextSource = string | HTMLCanvasElement | CanvasRenderingContext2D;

export type ResizeObserverEntryUpdated = ResizeObserverEntry & { devicePixelContentBoxSize?: ResizeObserverSize[] }