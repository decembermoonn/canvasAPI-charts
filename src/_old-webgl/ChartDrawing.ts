// import vsLines from '../shaders/vs.glsl';
// import fsLines from '../shaders/fs.glsl';
// import { ChartOptions, SingleSerieData, TickInfo } from '../models';
// import { createBuffersForAttributes, createProgram, createUniformSetters, prepareView, setUniforms } from '../old-webgl/PlotUtils';
// import MathUtils from '../old-webgl/MathUtils';

// interface FrameRect {
//     x: number;
//     y: number;
//     w: number;
//     h: number;
// }

// export default class ChartDrawing {

//     gl: WebGLRenderingContext;

//     constructor(gl: WebGLRenderingContext) {
//         this.gl = gl;
//     }

//     private getContentFrame(width: number, height: number): FrameRect {
//         const padding = Math.floor(Math.min(width, height) / 100);
//         const contentFrame: FrameRect = {
//             x: padding,
//             y: padding,
//             w: width - 2 * padding,
//             h: height - 2 * padding,
//         };
//         return contentFrame;
//     }

//     private drawTitle(title: string, frame: FrameRect): void {
//         const { canvas } = this.gl;
//         const ctx = canvas.getContext('2d');
//         // might be problematic when drawing multiple texts
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         const FRAME_HEIGHT_DIVIDER = 10;

//         const newH = Math.floor(frame.h / FRAME_HEIGHT_DIVIDER);
//         const titleFrame: FrameRect = {
//             x: frame.x,
//             y: frame.y + frame.h - newH,
//             h: newH,
//             w: frame.w
//         };
//         ctx.fillText(title, titleFrame.x, titleFrame.y, titleFrame.w);
//     }

//     drawPie(series: SingleSerieData[], chartOptions: ChartOptions): void {
//         const { gl } = this;
//         const { canvas } = gl;

//         const contentFrame = this.getContentFrame(gl.canvas.width, gl.canvas.height);
//         if (chartOptions.showTitle && chartOptions.title)
//             this.drawTitle(chartOptions.title, contentFrame);

//         const total = series.map(serie => serie.value).reduce((a, b) => a + b, 0);
//         const fractions = series.map(serie => Math.round(serie.value * 360 / total));
//         const w = canvas.width / 2;
//         const h = canvas.height / 2;

//         const u = new MathUtils();
//         const program = createProgram(gl, vsLines, fsLines);
//         gl.useProgram(program);

//         const setters = createUniformSetters(gl, program);
//         setUniforms(setters, {
//             u_matrix: u.getTransformationMatrix(gl)
//         });

//         prepareView(gl);
//         gl.useProgram(program);

//         let count = 0;
//         fractions.forEach((fraction, index) => {
//             const color = series[index].options.color;
//             setUniforms(setters, {
//                 u_color: '[color.r / 255, color.g / 255, color.b / 255, color.a / 255]'
//             });

//             const points = [];
//             points.push(w, h);

//             const start = count;
//             count += fraction;
//             for (let i = start; i <= count; i += 1) {
//                 const j = i * Math.PI / 180;
//                 points.push(w + Math.sin(j) * Math.floor(w / 2));
//                 points.push(h + Math.cos(j) * Math.floor(w / 2));
//             }

//             const arrays = {
//                 a_position: new Float32Array(points)
//             };
//             const buffers = createBuffersForAttributes(gl, program, arrays);
//             gl.enableVertexAttribArray(buffers.a_position.location);
//             gl.bindBuffer(gl.ARRAY_BUFFER, buffers.a_position.buffer);
//             gl.vertexAttribPointer(buffers.a_position.location, 2, gl.FLOAT, false, 0, 0);
//             gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / 2);
//         });
//     }

//     drawLines(series: number[]): void {
//         const { gl } = this;

//         const max = Math.max(...series.map(Math.abs));
//         const tickInfo = this.getTickInfo(max, 8);
//         const w = gl.canvas.width;
//         const h = gl.canvas.height;
//         const padding = Math.floor(Math.min(w, h) / 100);
//         const underLineAreaHeight = (h - 2 * padding) / 7;
//         const linesPoints = [];
//         const start = padding;
//         const end = w - padding;
//         for (let i = 1; i <= tickInfo.tickCount; i++) {
//             const lineH = i * underLineAreaHeight;
//             linesPoints.push(start, lineH, end, lineH);
//         }

//         const u = new MathUtils();
//         const uniforms = {
//             u_color: [0.7, 0.7, 0.7, 1],
//             u_matrix: u.getTransformationMatrix(gl)
//         };
//         const arrays = {
//             a_position: new Int16Array(linesPoints)
//         };
//         const program = createProgram(gl, vsLines, fsLines);
//         gl.useProgram(program);
//         const setters = createUniformSetters(gl, program);
//         setUniforms(setters, uniforms);
//         const buffers = createBuffersForAttributes(gl, program, arrays);
//         prepareView(gl);

//         gl.useProgram(program);
//         gl.enableVertexAttribArray(buffers.a_position.location);
//         gl.bindBuffer(gl.ARRAY_BUFFER, buffers.a_position.buffer);
//         gl.vertexAttribPointer(buffers.a_position.location, 2, gl.SHORT, false, 0, 0);
//         gl.drawArrays(gl.LINES, 0, linesPoints.length / 2);
//     }

//     drawBars(series: number[]): void {
//         const { gl } = this;

//         const w = gl.canvas.width;
//         const h = gl.canvas.height;
//         const padding = Math.floor(Math.min(w, h) / 100); //np 6 - wtedy H = 588.
//         const H = h - 2 * padding;
//         const W = w - 2 * padding;
//         const multipier = H / Math.max(...series);

//         const colPoints = [];
//         const COL_NUMS = series.length;
//         const colAreaWidth = W / COL_NUMS;

//         for (let i = 0; i < COL_NUMS; i++) {
//             const colHeight = padding + series[i] * multipier;
//             const pointLeftX = padding + (colAreaWidth * i) + (colAreaWidth / 5);
//             const pointLeftY = padding + (colAreaWidth * (i + 1)) - (colAreaWidth / 5);
//             colPoints.push(pointLeftX, padding, pointLeftX, colHeight, pointLeftY, colHeight);
//             colPoints.push(pointLeftX, padding, pointLeftY, padding, pointLeftY, colHeight);
//         }

//         const program = createProgram(gl, vsLines, fsLines);
//         gl.useProgram(program);
//         const setters = createUniformSetters(gl, program);

//         const arrays = {
//             a_position: new Float32Array(colPoints)
//         };
//         const bufferInfo = createBuffersForAttributes(gl, program, arrays);
//         setUniforms(setters, {
//             u_matrix: new MathUtils().getTransformationMatrix(gl)
//         });
//         gl.enableVertexAttribArray(bufferInfo.a_position.location);
//         gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.a_position.buffer);
//         for (let i = 0; i < COL_NUMS; i++) {
//             setUniforms(setters, {
//                 u_color: [Math.random(), Math.random(), Math.random(), 1]
//             });
//             gl.vertexAttribPointer(bufferInfo.a_position.location, 2, gl.FLOAT, false, 0, i * 12 * Float32Array.BYTES_PER_ELEMENT);
//             gl.drawArrays(gl.TRIANGLES, 0, 12);
//         }
//     }


//     getTickInfo(largest: number, mostTicks: number): TickInfo {
//         const minimum = largest / mostTicks;
//         const magnitude = Math.pow(10, Math.floor(Math.log10(minimum)));
//         const residual = minimum / magnitude;
//         const table = [1, 1.5, 2, 3, 5, 7, 10];
//         const tick = residual < 10 ? table.find((e) => (e > residual)) : 10;
//         const tickHeight = tick * magnitude;
//         const tickCount = Math.ceil(largest / tickHeight);
//         return { tickHeight, tickCount };
//     }
// }

