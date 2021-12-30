import { SerieOptions } from "../model/types";

export interface FrameRect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export type PiePartData = Omit<SerieOptions, 'showOnLegend'> & { radians: number, value: number };