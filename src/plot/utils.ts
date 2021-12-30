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

export function getTickCount(largest: number, mostTicks: number): number {
    const minimum = largest / mostTicks;
    const magnitude = Math.pow(10, Math.floor(Math.log10(minimum)));
    const residual = minimum / magnitude;
    const table = [1, 1.5, 2, 3, 5, 7, 10];
    const tick = residual < 10 ? table.find((e) => (e > residual)) : 10;
    const tickHeight = tick * magnitude;
    return Math.ceil(largest / tickHeight);
}