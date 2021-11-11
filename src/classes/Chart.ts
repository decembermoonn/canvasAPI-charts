import DrawUtils from "./DrawUtils";
import vertexShaderString from '../shaders/vertexShader.glsl';
import fragmentShaderString from '../shaders/fragmentShader.glsl';

export default class Chart {
    drawF(gl: WebGLRenderingContext): void {
        const program = this.createProgramFromScripts(gl);
        gl.useProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix')

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        this.setGeometry(gl);
        gl.enableVertexAttribArray(positionAttributeLocation);

        const size = 2;             // 2 components per iteration
        const type = gl.FLOAT;      // type of component (32bit float)
        const normalize = false;    // don't normalize data
        const stride = 0            // move size * sizeof(type) bits to get next position
        const offset = 0            // starts at that bit
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        const drawUtils: DrawUtils = new DrawUtils();
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
        gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);

        const primitiveType = gl.TRIANGLES;
        const count = 18;
        gl.drawArrays(primitiveType, offset, count);
    }

    private createProgramFromScripts(gl: WebGLRenderingContext) {
        const vertexShaderSource = vertexShaderString;
        const fragmentShaderSource = fragmentShaderString;
        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = this.createProgram(gl, vertexShader, fragmentShader);
        return program;
    }

    private createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) return shader;

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    private createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) return program;

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    private setGeometry(gl: WebGLRenderingContext): void {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                // left column
                0, 0,
                30, 0,
                0, 150,
                0, 150,
                30, 0,
                30, 150,

                // top rung
                30, 0,
                100, 0,
                30, 30,
                30, 30,
                100, 0,
                100, 30,

                // middle rung
                30, 60,
                67, 60,
                30, 90,
                30, 90,
                67, 60,
                67, 90,
            ]),
            gl.STATIC_DRAW);
    }
}