import { Point, SerieOptionsArea } from "../model/types";

export interface TickInfo {
    tickHeight: number;
    tickCount: number;
}

export interface FrameRect {
    id?: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export type PiePartData = Omit<SerieOptionsArea, 'showOnLegend'> & { radians: number, value: number };

export interface BoxFrameAndTextCoords {
    boxFrame: FrameRect;
    textCoords: Point & { maxW: number };
}