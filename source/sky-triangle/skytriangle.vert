
precision lowp float;

@import ../shaders/facade.vert;

#if __VERSION__ == 100
    attribute vec2 a_vertex;
#else 
    layout(location = 0) in vec2 a_vertex;
#endif

uniform mat4 u_inverseViewProjection;

out vec2 v_uv;
out vec4 v_ray;

void main()
{
    v_uv = a_vertex.xy;
    v_ray = u_inverseViewProjection * vec4(a_vertex, 1.0, 1.0);

    gl_Position = vec4(a_vertex, 1.0, 1.0);
}
