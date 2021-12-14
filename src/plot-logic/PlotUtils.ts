import MathUtils from './MathUtils';

export function createProgramFromScripts(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
    const program = createProgram(gl, vertexShader, fragmentShader);
    return program;
}

export function prepareView(gl: WebGLRenderingContext): void {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

export function getTransformationMatrix(gl: WebGLRenderingContext): number[] {
    const drawUtils: MathUtils = new MathUtils();
    const translationX = 0;
    const translationY = 0;
    const rotationInDegrees = 0;
    const scaleX = 1;
    const scaleY = 1;

    const identityMatrix = drawUtils.identityMatrix();
    const projectionMatrix = drawUtils.projectionMatrix(gl.canvas.width, gl.canvas.height);
    const translationMatrix = drawUtils.translationMatrix(translationX, translationY);
    const rotationMatrix = drawUtils.rotationMatrix(rotationInDegrees);
    const scaleMatrix = drawUtils.scaleMatrix(scaleX, scaleY);

    let matrix = drawUtils.multiplyMatrices(identityMatrix, projectionMatrix);
    matrix = drawUtils.multiplyMatrices(matrix, translationMatrix);
    matrix = drawUtils.multiplyMatrices(matrix, rotationMatrix);
    matrix = drawUtils.multiplyMatrices(matrix, scaleMatrix);
    return matrix;
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}