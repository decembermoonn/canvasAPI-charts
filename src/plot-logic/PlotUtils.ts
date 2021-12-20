/*
Based on 'twgls.js' by Gregg Tavares.
Reason behind not using this library directly are:
- desire to recreate lib to understand underlying functionality better
- problems with including m4 and vec3
- it weights too much
*/

type UniformSetterFunction = (data: number[]) => void;
type UniformSettersObject = Record<string, UniformSetterFunction>;
interface AttributeBufferObject {
    buffer: WebGLBuffer;
    byteLength: number;
    location: number;
}
type AttributeBufferObjects = Record<string, AttributeBufferObject>;

/**
 * Resize canvas to display size.
 * @param canvas - canvas object.
 * @returns flag indicating whether resize occured.
*/
export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

/**
 * Creates program with attached shaders.
 * @param gl - context.
 * @param vs - vertex shader string source.
 * @param fs - fragment shader string source.
 * @returns linked program with attached shaders.
*/
export function createProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
    const program = createProgramFromShaders(gl, vertexShader, fragmentShader);
    return program;
}

/**
 * Creates shader.
 * @param gl - context.
 * @param type - type of shader (gl.VERTEX_SHADER, gl.FRAGMENT_SHADER).
 * @param source - shader string source.
 * @returns compiled shader.
*/
function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw Error(log);
}

/**
 * Creates program having shaders compiled.
 * @param gl - context.
 * @param vsO - vertex shader.
 * @param fsO - fragment shader.
 * @returns linked program.
*/
function createProgramFromShaders(gl: WebGLRenderingContext, vsO: WebGLShader, fsO: WebGLShader): WebGLProgram {
    const program = gl.createProgram();
    gl.attachShader(program, vsO);
    gl.attachShader(program, fsO);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw Error(log);
}

/**
 * Update viewport and prepare canvas.
 * @param gl - context.
*/
export function prepareView(gl: WebGLRenderingContext): void {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

/**
 * @return flag indicating whether attribute or uniform is built-in.
*/
function isBuiltIn(name: WebGLActiveInfo['name']): boolean {
    return name.startsWith("gl_") || name.startsWith("webgl_");
}

/**
 * @param gl - context.
 * @param type - type of uniform.
 * @param loc - location of uniform in program.
 * @return setter for uniform.
*/
function getUniformSetterByType(gl: WebGLRenderingContext, type: WebGLActiveInfo['type'], loc: WebGLUniformLocation): UniformSetterFunction {
    switch (type) {
        case gl.FLOAT:
            return (data): void => gl.uniform1fv(loc, data);
        case gl.FLOAT_VEC2:
            return (data): void => gl.uniform2fv(loc, data);
        case gl.FLOAT_VEC3:
            return (data): void => gl.uniform3fv(loc, data);
        case gl.FLOAT_VEC4:
            return (data): void => gl.uniform4fv(loc, data);
        case gl.INT:
            return (data): void => gl.uniform1iv(loc, data);
        case gl.INT_VEC2:
            return (data): void => gl.uniform2iv(loc, data);
        case gl.INT_VEC3:
            return (data): void => gl.uniform3iv(loc, data);
        case gl.INT_VEC4:
            return (data): void => gl.uniform4iv(loc, data);
        case gl.FLOAT_MAT2:
            return (data): void => gl.uniformMatrix2fv(loc, false, data);
        case gl.FLOAT_MAT3:
            return (data): void => gl.uniformMatrix3fv(loc, false, data);
        case gl.FLOAT_MAT4:
            return (data): void => gl.uniformMatrix4fv(loc, false, data);
        default:
            throw Error(`Type 0x${type} is invalid.`);
    }
}

/**
 * Creates uniform setters to easily set uniforms located in program.
 * @param gl - context.
 * @param program - program in which uniforms are located.
 * @return <uniform name, setter for uniform> pairs.
*/
export function createUniformSetters(gl: WebGLRenderingContext, program: WebGLProgram): UniformSettersObject {
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    const uniformSetters: UniformSettersObject = {};

    for (let i = 0; i < numUniforms; i++) {
        const uniformInfo = gl.getActiveUniform(program, i);
        const { name } = uniformInfo;
        if (!isBuiltIn(name)) {
            const location = gl.getUniformLocation(program, name);
            if (location != null) {
                const setter = getUniformSetterByType(gl, uniformInfo.type, location);
                const subName = name.endsWith('[0]') ? name.substr(0, name.length - 3) : name;
                uniformSetters[subName] = setter;
            }
        }
    }
    return uniformSetters;
}

/**
 * Sets uniforms using 'data' and setters specified in 'setters'. 
 * @param setters - setters created via {@link createUniformSetters}.
 * @param data - data for setters, keys should match setter keys.
 * @return <uniform name, setter for uniform> pairs.
*/
export function setUniforms(setters: UniformSettersObject, data: Record<string, number[]>): void {
    for (const item in data) {
        setters[item](data[item]);
    }
}

/**
 * Creates uniform for each attribute (as key) in data
 * and stores data (as value for key) in this buffer.
 * @param gl - context.
 * @param program - program.
 * @param data - <attribute, BufferSource> pairs.
 * @return buffer with data, lenght in bytes of buffer element, location of attribute.
*/
export function createBuffersForAttributes(gl: WebGLRenderingContext, program: WebGLProgram, data: Record<string, BufferSource>): AttributeBufferObjects {
    const bufferInfo: AttributeBufferObjects = {};
    for (const attrib in data) {
        const location = gl.getAttribLocation(program, attrib);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data[attrib], gl.STATIC_DRAW);
        bufferInfo[attrib] = {
            buffer,
            byteLength: data[attrib].byteLength,
            location
        };
    }
    return bufferInfo;
}