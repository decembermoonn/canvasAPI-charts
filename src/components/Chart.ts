import { ContextSource } from "../models";

export abstract class Chart {

    context: WebGLRenderingContext;

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
    }
    public abstract set X(value: string[] | number[]);
    public abstract set Y(value: number[]);
    public abstract set configuration(config: unknown);
    public abstract draw(): void;
}