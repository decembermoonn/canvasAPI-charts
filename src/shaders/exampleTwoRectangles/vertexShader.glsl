attribute vec2 a_position;
uniform vec4 u_color;
uniform mat3 u_matrix;
varying vec4 v_color;

void main() {
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    v_color = u_color;
}