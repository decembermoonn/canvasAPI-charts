import { Point, SerieOptionsArea } from "../model/types";

export interface TickInfo {
    tickHeight: number;
    tickCount: number;
    tickFrame?: FrameRect;
}

export interface FrameRect {
    id?: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface MinMax {
    min: number;
    max: number;
}

export type PiePartData = Omit<SerieOptionsArea, 'showOnLegend'> & { radians: number, value: number };

export interface BoxFrameAndTextCoords {
    boxFrame: FrameRect;
    textCoords: Point & { maxW: number };
}

export type ValueToPixelMapperFunc = (value: number) => number

export interface ValueToPixelMapperFuncPair {
    xFunc: ValueToPixelMapperFunc;
    yFunc: ValueToPixelMapperFunc;
}

export interface ValueToPixelMapperOptions {
    beginningInPixels: number;
    widthOrHeightInPixels: number;
    minValueFromSeries: number;
    maxValueFromSeries: number;
}