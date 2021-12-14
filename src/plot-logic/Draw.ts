import { createProgramFromScripts, getTransformationMatrix, prepareView } from "./PlotUtils";
import vertexShaderString from '../shaders/vertexShader.glsl';
import fragmentShaderString from '../shaders/fragmentShader.glsl';
import exampleTwoRectanglesVShaderString from '../shaders/exampleTwoRectangles/vertexShader.glsl';
import exampleTwoRectanglesFShaderString from '../shaders/exampleTwoRectangles/fragmentShader.glsl';

export default class Draw {
    drawRect(gl: WebGLRenderingContext): void {
        // INIT
        const program = createProgramFromScripts(gl, exampleTwoRectanglesVShaderString, exampleTwoRectanglesFShaderString);

        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
        const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
        const matrix = getTransformationMatrix(gl);

        const dataBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Int16Array([0, 0, 0, 50, 50, 50, 0, 0, 50, 0, 50, 50]), gl.STATIC_DRAW);

        // RENDER
        prepareView(gl);
        gl.useProgram(program);
        gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);

        // RENDER -> DRAW 1
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.uniform4f(colorUniformLocation, 0.5, 0.5, 0.5, 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.SHORT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // REDNER -> DRAW 2
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.uniform4f(colorUniformLocation, 0.1, 0.5, 0.9, 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.SHORT, false, 0, 6 * Int16Array.BYTES_PER_ELEMENT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    drawF(gl: WebGLRenderingContext): void {
        const program = createProgramFromScripts(gl, vertexShaderString, fragmentShaderString);
        gl.useProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix')

        prepareView(gl);

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

        const matrix = getTransformationMatrix(gl);
        gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);

        const primitiveType = gl.TRIANGLES;
        const count = 18;
        gl.drawArrays(primitiveType, offset, count);
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