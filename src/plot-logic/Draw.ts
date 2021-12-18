import { createProgramFromScripts, getTransformationMatrix, prepareView } from "./PlotUtils";
import vertexShaderString from '../shaders/vertexShader.glsl';
import fragmentShaderString from '../shaders/fragmentShader.glsl';
import exampleTwoRectanglesVShaderString from '../shaders/exampleTwoRectangles/vertexShader.glsl';
import exampleTwoRectanglesFShaderString from '../shaders/exampleTwoRectangles/fragmentShader.glsl';
import exampleLinesV from '../shaders/exampleLines/vertexShader.glsl';
import exampleLinesF from '../shaders/exampleLines/fragmentShader.glsl';
import { TickInfo } from "../models";

export default class Draw {
    // Algorithm by 'Mark Ransom'. Ported to JS and modified by me.
    // https://stackoverflow.com/questions/361681/
    getTickInfo(largest: number, mostTicks: number): TickInfo {
        const minimum = largest / mostTicks;
        const magnitude = Math.pow(10, Math.floor(Math.log10(minimum)));
        const residual = minimum / magnitude;
        const table = [1, 1.5, 2, 3, 5, 7, 10];
        const tick = residual < 10 ? table.find((e) => (e > residual)) : 10;
        const tickHeight = tick * magnitude;
        const tickCount = Math.ceil(largest / tickHeight);
        return { tickHeight, tickCount };
    }

    drawLines(gl: WebGLRenderingContext, series: number[]): number {
        const program = createProgramFromScripts(gl, exampleLinesV, exampleLinesF);
        const positionALoc = gl.getAttribLocation(program, 'a_position');
        const colorULoc = gl.getUniformLocation(program, 'u_color');
        const matrixULoc = gl.getUniformLocation(program, 'u_matrix');
        const matrix = getTransformationMatrix(gl);

        const max = Math.max(...series.map(Math.abs));

        const tickInfo = this.getTickInfo(max, 8);
        const w = gl.canvas.width;
        const h = gl.canvas.height;
        const padding = Math.floor(Math.min(w, h) / 100);
        const underLineAreaHeight = (h - 2 * padding) / 7;
        const linesPoints = [];
        const start = padding;
        const end = w - padding;
        for (let i = 1; i <= tickInfo.tickCount; i++) {
            const lineH = i * underLineAreaHeight;
            linesPoints.push(start, lineH, end, lineH);
        }
        console.log(linesPoints);

        const dataBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Int16Array(linesPoints), gl.STATIC_DRAW);

        prepareView(gl);
        gl.useProgram(program);
        gl.uniform4f(colorULoc, 0.7, 0.7, 0.7, 1);
        gl.uniformMatrix3fv(matrixULoc, false, matrix);

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionALoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
        gl.vertexAttribPointer(positionALoc, 2, gl.SHORT, false, 0, 0);
        gl.drawArrays(gl.LINES, 0, linesPoints.length / 2);

        return tickInfo.tickCount * tickInfo.tickHeight;
    }

    drawBars(gl: WebGLRenderingContext, series: number[], max: number): void {
        const program = createProgramFromScripts(gl, exampleLinesV, exampleLinesF);
        const positionALoc = gl.getAttribLocation(program, 'a_position');
        const colorULoc = gl.getUniformLocation(program, 'u_color');
        const matrixULoc = gl.getUniformLocation(program, 'u_matrix');
        const matrix = getTransformationMatrix(gl);

        const w = gl.canvas.width;
        const h = gl.canvas.height;
        const padding = Math.floor(Math.min(w, h) / 100); //np 6 - wtedy H = 588.
        const H = h - 2 * padding;
        const W = w - 2 * padding;
        const multipier = H / max;

        const colPoints = [];
        const COL_NUMS = series.length;
        const colAreaWidth = W / COL_NUMS;

        for (let i = 0; i < COL_NUMS; i++) {
            const colHeight = padding + series[i] * multipier;
            const pointLeftX = padding + (colAreaWidth * i) + (colAreaWidth / 5);
            const pointLeftY = padding + (colAreaWidth * (i + 1)) - (colAreaWidth / 5);
            colPoints.push(pointLeftX, padding, pointLeftX, colHeight, pointLeftY, colHeight);
            colPoints.push(pointLeftX, padding, pointLeftY, padding, pointLeftY, colHeight);
        }

        const dataBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colPoints), gl.STATIC_DRAW);

        gl.useProgram(program);
        gl.uniformMatrix3fv(matrixULoc, false, matrix);
        gl.enableVertexAttribArray(positionALoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
        for (let i = 0; i < COL_NUMS; i++) {
            gl.uniform4f(colorULoc, Math.random(), Math.random(), Math.random(), 1);
            gl.vertexAttribPointer(positionALoc, 2, gl.FLOAT, false, 0, i * 12 * Float32Array.BYTES_PER_ELEMENT);
            gl.drawArrays(gl.TRIANGLES, 0, 12);
        }
    }

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