import { createProgramFromScripts, getTransformationMatrix, prepareView } from "./PlotUtils";

export default class Draw {
    drawF(gl: WebGLRenderingContext): void {
        const program = createProgramFromScripts(gl);
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