uniform float time;
uniform float gradientAngle;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
	// Flipped UV calculation for efficiency
	vec2 modifiedUv = vec2(vUv.x, 1.0f - vUv.y); 

	// Pre-calculate common values
	vec2 center = vec2(0.5f);
	float distanceToCenter = distance(modifiedUv, center);

	// Define colors with vec3 for conciseness
	// (alpha is separate for clarity) 
	vec3 hotColor1 = vec3(1.0f, 69.0f / 255.0f, 0.0f);
	vec3 hotColor2 = vec3(139.0f / 255.0f, 0.0f, 0.0f);
	vec3 hotColor3 = vec3(0.0f, 0.0f, 0.0f);

	vec3 coldColor1 = vec3(0.0f, 100.0f / 255.0f, 1.0f);
	vec3 coldColor2 = vec3(0.0f, 0.0f, 139.0f / 255.0f);
	vec3 coldColor3 = vec3(0.0f, 0.0f, 0.0f);

	// Remove unused hotColdMix (replaced by gradientFactor)

	// Gradient direction calculation
	vec2 direction = vec2(cos(gradientAngle), sin(gradientAngle));
	float gradientFactor = dot(normalize(modifiedUv - center), direction) * 0.5f + 0.5f;

	// Optimized gradient calculations
	vec3 hotGradient = mix(mix(hotColor1, hotColor2, smoothstep(0.0f, 0.21f, distanceToCenter)), hotColor3, smoothstep(0.21f, 1.0f, distanceToCenter));

	vec3 coldGradient = mix(mix(coldColor1, coldColor2, smoothstep(0.0f, 0.21f, distanceToCenter)), coldColor3, smoothstep(0.21f, 1.0f, distanceToCenter));

	vec3 radialGradient = mix(coldGradient, hotGradient, gradientFactor); 

	// Effect calculations
	float effectSize = 0.021f;
	float effectDistance = mod(modifiedUv.y + time, effectSize) - effectSize;
	float effectIntensity = 0.021f * smoothstep(effectSize, 0.0f, abs(effectDistance));

	vec3 hotEffectColor = vec3(1.0f, 69.0f / 255.0f, 0.0f);
	vec3 coldEffectColor = vec3(0.0f, 191.0f / 255.0f, 1.0f);
	vec3 effectColor = mix(coldEffectColor, hotEffectColor, gradientFactor); // Use gradientFactor 

	radialGradient = mix(radialGradient, effectColor, effectIntensity); 

	// Combine color and opacity at the end
	gl_FragColor = vec4(radialGradient, mix(1.0f, 0.21f, sin(time) * 0.00021f + 0.21f));
}
