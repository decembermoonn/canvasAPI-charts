// Needed to mock getContext with simple function,
// to prevent Mocha from spawning errors.

export default function (): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.HTMLCanvasElement.prototype.getContext = (): void => {
        console.warn("Using getContext Mock");
    };
}