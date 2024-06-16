#version 300 es
precision highp float;

#include "@motion-canvas/core/shaders/common.glsl"

uniform vec2 position;
uniform vec4 color;
uniform vec2 size;
uniform float border;
uniform float intensity;
uniform float alpha_max;
uniform float radius;

const float alpha_ramp_dist = 0.1f;
const float alpha_a = 0.5f;
const float alpha_b = 1.2f;

float get_glow(float dist, float radius, float intensity) {
    float v = pow(radius/dist, intensity);
    
    if (abs(v) <= 0.1) return 8.5;
    return v;
}

float rounded_rect_sdf(vec2 sample_pos, vec2 rect_center, vec2 rect_half_size, float r) {
    vec2 d2 = (abs(rect_center - sample_pos) - rect_half_size + vec2(r, r));
    return min(max(d2.x, d2.y), 0.0) + length(max(d2, 0.0)) - r;
}


float get_alpha(float t) {
    if (t >= alpha_ramp_dist) {
        if (t <= 1.0-alpha_ramp_dist) {
            float val = exp(-(((t-alpha_a)*(t-alpha_a))/alpha_b));
            return val;
        }
        float val = exp(-((((1.f-alpha_ramp_dist)-alpha_a)*((1.f-alpha_ramp_dist)-alpha_a))/alpha_b));
        return ((-val)/(alpha_ramp_dist))*(t-1.0+alpha_ramp_dist)+val;
    }
    float val = exp(-(((alpha_ramp_dist-alpha_a)*(alpha_ramp_dist-alpha_a))/alpha_b));
    return ((val)/(alpha_ramp_dist))*(t);
}



void main() {
    vec2 updooted_size = size - vec2(2.0 * border);
    
    vec2 frag_pos = position + ((vec2(2)*sourceUV)-vec2(1))*size/vec2(2);
    
    float dist = rounded_rect_sdf(frag_pos, position, size/vec2(2), 80.0f);
    dist += 0.5*border;

    vec3 col = vec3(0.0);
    
    float glow = get_glow(dist, radius, intensity);
    col += 10.0 * vec3(smoothstep(0.005, 0.003, dist));
    col += glow * color.xyz;

    float alphaX = get_alpha(sourceUV.x);
    float alphaY = get_alpha(sourceUV.y);
    float alpha = min(alpha_max, min(alphaX, alphaY));
    outColor = vec4(col, alpha);
}