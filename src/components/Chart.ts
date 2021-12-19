import { ContextSource, ResizeObserverEntryUpdated } from "../models";

export abstract class Chart {

    context: WebGLRenderingContext;

    resizeObserver: ResizeObserver;

    // every time set viewport to those values.
    displayWidth: number;
    displayHeight: number;

    constructor(source: ContextSource) {
        let analyzedElement = source;
        if (typeof analyzedElement === 'string') {
            analyzedElement = document.getElementById(analyzedElement.replace('/^#/', '')) as HTMLCanvasElement;
        }
        if (analyzedElement instanceof HTMLCanvasElement) {
            this.context = analyzedElement.getContext('webgl');
        }
        else if (analyzedElement instanceof WebGLRenderingContext) {
            this.context = analyzedElement;
        }
        else throw Error('Argument must be valid ID, HTMLCanvasElement or WebGLRenderingContext');
        this.initializeCanvas();
    }

    public abstract set X(value: string[] | number[] | number[][]);
    public abstract set Y(value: number[] | number[][]);
    // public abstract set configuration(config: unknown);
    public abstract draw(): void;

    /*
        Content under this line will probably be deleted!
    */
    private initializeCanvas(): void {
        this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntryUpdated[]) => this.onResizeCallback(entries));
        const { canvas } = this.context;
        try {
            this.resizeObserver.observe(canvas, { box: 'device-pixel-content-box' });
        } catch (ex) {
            // device-pixel-content-box is not supported so fallback to this
            this.resizeObserver.observe(canvas, { box: 'content-box' });
        }
    }

    private onResizeCallback(entries: ResizeObserverEntryUpdated[]): void {
        entries.forEach((entry) => {
            const dpr = entry.devicePixelContentBoxSize ? 1 : window.devicePixelRatio;
            const { inlineSize, blockSize }: ResizeObserverSize = this.getWidthAndHeight(entry);
            console.log(`Resize to ${inlineSize} x ${blockSize}, dpr ${dpr}`);
            //this.setNewCanvasSize(inlineSize, blockSize, dpr);
        });
    }

    private getWidthAndHeight(entry: ResizeObserverEntryUpdated): ResizeObserverSize {
        if (entry.devicePixelContentBoxSize) return entry.devicePixelContentBoxSize[0];
        if (entry.contentBoxSize) return entry.contentBoxSize[0];
        return {
            inlineSize: entry.contentRect.width,
            blockSize: entry.contentRect.height
        };
    }

    private setNewCanvasSize(width: number, height: number, dpr: number): void {
        const displayWidth = Math.round(width * dpr);
        const displayHeight = Math.round(height * dpr);
        this.displayWidth = displayWidth;
        this.displayHeight = displayHeight;
    }
}