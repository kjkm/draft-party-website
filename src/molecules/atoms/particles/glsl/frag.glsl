precision mediump float;

uniform sampler2D u_textTexture;
uniform float u_time;
uniform vec4 u_lavaColor;       
uniform vec4 u_backgroundColor; 

uniform int u_blobCount;
uniform vec3 u_blobs[64]; // x, y, radius

varying vec2 v_uv;

float metaball(vec2 uv, vec2 center, float radius) {
    float dist = length(uv - center);
    return radius * radius / (dist * dist + 1e-5);
}

void main() {
    vec2 uv = v_uv;
    vec4 textColor = texture2D(u_textTexture, uv);

    vec2 blob1 = vec2(0.5 + 0.2 * sin(u_time), 0.2 + 0.1 * cos(u_time));
    vec2 blob2 = vec2(0.3 + 0.1 * sin(u_time * 1.3), 0.5 + 0.2 * cos(u_time * 0.7));

    float field = 0.0;
    for (int i = 0; i < 64; ++i) {
        if (i >= u_blobCount) break;
        field += metaball(uv, u_blobs[i].xy, u_blobs[i].z);
    }

    float blobMask = smoothstep(1.0, 1.5, field);

    // Invert the text where blob overlaps
    vec3 invertedText = 1.0 - textColor.rgb;
    vec3 blobbedText = mix(textColor.rgb, invertedText, blobMask);

    vec3 backgroundOrBlob = mix(u_backgroundColor.rgb, u_lavaColor.rgb, blobMask);
    vec3 finalColor = mix(backgroundOrBlob, blobbedText, textColor.a);

    float finalAlpha = mix(u_backgroundColor.a, 1.0, max(textColor.a, blobMask));

    gl_FragColor = vec4(finalColor, finalAlpha);
}