import type { draw } from 'patternomaly';

export interface TickInfo {
    tickHeight: number;
    tickCount: number;
}

export interface FrameRect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface PiePartData {
    rad: number;
    color: string;
    thickness: number;
    shape?: Parameters<typeof draw>[0]
}
