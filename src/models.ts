export interface Color {
    r: number,
    g: number,
    b: number,
    a: number,
}

export type ContextSource = string | HTMLCanvasElement | WebGLRenderingContext;


export type ResizeObserverEntryUpdated = ResizeObserverEntry & { devicePixelContentBoxSize?: ResizeObserverSize[] }
