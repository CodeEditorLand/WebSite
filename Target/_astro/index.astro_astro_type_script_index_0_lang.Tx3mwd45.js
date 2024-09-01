import { _ as b } from "./preload-helper.BiBI96sQ.js";
const P = `uniform float time;
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
`,
	_ = `varying vec2 vUv;
varying vec3 vNormal;

void main() {
	vUv = uv;
	vNormal = normalize(normalMatrix * normal);
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
	{
		Scene: R,
		PerspectiveCamera: T,
		WebGLRenderer: E,
		Group: A,
		Mesh: p,
		ConeGeometry: L,
		MeshPhysicalMaterial: U,
		PCFSoftShadowMap: z,
		AmbientLight: B,
		DirectionalLight: D,
		ACESFilmicToneMapping: W,
		SphereGeometry: I,
		ShaderMaterial: H,
		DoubleSide: V,
		RGBAFormat: q,
		FloatType: N,
		CubeCamera: j,
		WebGLCubeRenderTarget: O,
	} = await b(async () => {
		const {
			Scene: f,
			PerspectiveCamera: m,
			WebGLRenderer: l,
			Group: e,
			Mesh: a,
			ConeGeometry: t,
			MeshPhysicalMaterial: v,
			PCFSoftShadowMap: r,
			AmbientLight: o,
			DirectionalLight: u,
			ACESFilmicToneMapping: C,
			SphereGeometry: g,
			ShaderMaterial: S,
			DoubleSide: y,
			RGBAFormat: M,
			FloatType: G,
			CubeCamera: x,
			WebGLCubeRenderTarget: F,
		} = await import("./three.module.wf464D1I.js");
		return {
			Scene: f,
			PerspectiveCamera: m,
			WebGLRenderer: l,
			Group: e,
			Mesh: a,
			ConeGeometry: t,
			MeshPhysicalMaterial: v,
			PCFSoftShadowMap: r,
			AmbientLight: o,
			DirectionalLight: u,
			ACESFilmicToneMapping: C,
			SphereGeometry: g,
			ShaderMaterial: S,
			DoubleSide: y,
			RGBAFormat: M,
			FloatType: G,
			CubeCamera: x,
			WebGLCubeRenderTarget: F,
		};
	}, []);
let i, d, n, s, c, h;
function Y() {
	(i = new R()),
		(d = new T(2.1, window.innerWidth / window.innerHeight, 0.0021, 2100)),
		(n = new E({
			antialias: !0,
			alpha: !0,
			precision: "highp",
			powerPreference: "high-performance",
		})),
		n.setPixelRatio(window.devicePixelRatio),
		n.setSize(window.innerWidth, window.innerHeight),
		(n.shadowMap.enabled = !0),
		(n.shadowMap.type = z),
		(n.toneMapping = W);
	const f = document.getElementById("Position");
	f?.appendChild(n.domElement);
	const m = new H({
		uniforms: { time: { value: 0 } },
		vertexShader: _,
		fragmentShader: P,
		side: V,
		transparent: !0,
	});
	(c = new p(new I(21, 21, 21), m)), i.add(c);
	const l = new O(512, { format: q, type: N });
	(h = new j(2.1, 2100, l)), (s = new A());
	const e = 2.1,
		a = 3,
		t = (Math.sqrt(a) / a) * e,
		v = Math.sqrt(e / a) * e,
		r = new p(
			new L(t, v, a),
			new U({
				color: 16777215,
				metalness: 0.0021,
				roughness: 0.0021,
				clearcoat: 0.0021,
				clearcoatRoughness: 0.0021,
				reflectivity: 0.0021,
				envMap: l.texture,
				envMapIntensity: 0.0021,
			}),
		).translateY(-t / e);
	(r.castShadow = !0),
		(r.receiveShadow = !0),
		s.add(r),
		i.add(s),
		i.add(new B(16777215, 1.21));
	const o = new D(16777215, 1.21);
	o.position.set(0, -t / e, t * e),
		(o.castShadow = !0),
		(o.shadow.camera.near = 0.0021),
		(o.receiveShadow = !0),
		(o.shadow.camera.far = 2100),
		i.add(o),
		d.position.set(-t / e, -t / e, t * e),
		c.position.set(-t / e, -t / e, t * e),
		f?.classList.add("Visible"),
		w();
}
function w() {
	requestAnimationFrame(w),
		(s.rotation.x -= 21e-5),
		(c.material.uniforms.time.value = performance.now() / 1021e3),
		h.position.copy(c.position),
		h.update(n, i),
		n.render(i, d);
}
Y();
window.addEventListener(
	"resize",
	function () {
		(d.aspect = window.innerWidth / window.innerHeight),
			d.updateProjectionMatrix(),
			n.setSize(window.innerWidth, window.innerHeight);
	},
	!1,
);
//# sourceMappingURL=index.astro_astro_type_script_index_0_lang.Tx3mwd45.js.map
