import { draw } from "patternomaly";
import { SerieOptions } from "../model/types";
import { TickInfo } from "./types";

/**
 * Resize canvas to display size.
 * @param canvas - canvas object.
 * @returns flag indicating whether resize occured.
*/
export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

/**
 * Calculates ticks for several charts. 
 * Algorithm by 'Mark Ransom'. Ported to JS and modified by me.
 * @see {@link https://stackoverflow.com/questions/361681/} for original algorithm code.
 * @param largest - previously determined largest value.
 * @param mostTicks - maximal number of possible ticks.
 * @returns tick height and number of ticks.  
 * @summary
*/
export function getTickInfo(largest: number, mostTicks: number): TickInfo {
    const minimum = largest / mostTicks;
    const magnitude = Math.pow(10, Math.floor(Math.log10(minimum)));
    const residual = minimum / magnitude;
    const table = [1, 1.5, 2, 3, 5, 7, 10];
    const tick = residual < 10 ? table.find((e) => (e > residual)) : 10;
    const tickHeight = tick * magnitude;
    const tickCount = Math.ceil(largest / tickHeight);
    return {
        tickHeight,
        tickCount
    };
}

export function applyShapeOrColor(ctx: CanvasRenderingContext2D, shape: SerieOptions['shape'], color: string): void {
    ctx.fillStyle = color;
    if (shape != undefined) {
        try {
            ctx.fillStyle = draw(shape, color, 'black');
        } catch {
            console.warn(`${shape} is invalid shape. See documentation.`);
        }
    }
}