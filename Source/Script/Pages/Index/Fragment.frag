uniform float time;
uniform float gradientAngle;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
	vec2 modifiedUv = vec2(vUv.x, 1.0 - vUv.y);
	vec2 center = vec2(0.5);
	float distanceToCenter = distance(modifiedUv, center);

	vec4 hotColor1 = vec4(255.0 / 255.0, 69.0 / 255.0, 0.0 / 255.0, 0.21);
	vec4 hotColor2 = vec4(139.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.21);
	vec4 hotColor3 = vec4(0.0, 0.0, 0.0, 0.21);

	vec4 coldColor1 = vec4(0.0, 100.0 / 255.0, 255.0 / 255.0, 0.21);
	vec4 coldColor2 = vec4(0.0, 0.0, 139.0 / 255.0, 0.21);
	vec4 coldColor3 = vec4(0.0, 0.0, 0.0, 0.21);

	float hotColdMix = (vNormal.x + 1.0) / 2.0;

	vec2 direction = vec2(cos(gradientAngle), sin(gradientAngle));
	float gradientFactor = dot(normalize(modifiedUv - center), direction) * 0.5 + 0.5;

	vec4 hotGradient = mix(hotColor1, hotColor2, smoothstep(0.0, 0.21, distanceToCenter));
	hotGradient = mix(hotGradient, hotColor3, smoothstep(0.21, 1.0, distanceToCenter));

	vec4 coldGradient = mix(coldColor1, coldColor2, smoothstep(0.0, 0.21, distanceToCenter));
	coldGradient = mix(coldGradient, coldColor3, smoothstep(0.21, 1.0, distanceToCenter));

	vec4 radialGradient = mix(coldGradient, hotGradient, gradientFactor); // Use gradientFactor here

	float effectSize = 0.021;
	float effectIntensity = 0.021;
	float effectDistance = mod(modifiedUv.y + time, effectSize) - effectSize;

	effectIntensity *= smoothstep(effectSize, 0.0, abs(effectDistance));

	vec4 hotEffectColor = vec4(255.0 / 255.0, 69.0 / 255.0, 0.0, effectIntensity);
	vec4 coldEffectColor = vec4(0.0, 191.0 / 255.0, 255.0 / 255.0, effectIntensity);
	vec4 effectColor = mix(coldEffectColor, hotEffectColor, hotColdMix);

	radialGradient = mix(radialGradient, effectColor, effectIntensity);

	float opacity = mix(1.0, 0.21, sin(time) * 0.00021 + 0.21);
	gl_FragColor = vec4(radialGradient.rgb, opacity);
}
