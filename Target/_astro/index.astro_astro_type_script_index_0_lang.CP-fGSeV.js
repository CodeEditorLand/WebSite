import { _ as P } from "./preload-helper.BiBI96sQ.js";
const F = `uniform float time;
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
		Scene: T,
		PerspectiveCamera: R,
		WebGLRenderer: A,
		Group: E,
		Mesh: p,
		ConeGeometry: L,
		MeshPhysicalMaterial: U,
		PCFSoftShadowMap: z,
		AmbientLight: I,
		DirectionalLight: B,
		ACESFilmicToneMapping: W,
		SphereGeometry: D,
		ShaderMaterial: H,
		DoubleSide: N,
		RGBAFormat: V,
		FloatType: q,
		CubeCamera: j,
		WebGLCubeRenderTarget: O,
	} = await P(async () => {
		const {
			Scene: s,
			PerspectiveCamera: v,
			WebGLRenderer: l,
			Group: e,
			Mesh: r,
			ConeGeometry: t,
			MeshPhysicalMaterial: f,
			PCFSoftShadowMap: a,
			AmbientLight: o,
			DirectionalLight: C,
			ACESFilmicToneMapping: u,
			SphereGeometry: g,
			ShaderMaterial: S,
			DoubleSide: y,
			RGBAFormat: M,
			FloatType: G,
			CubeCamera: x,
			WebGLCubeRenderTarget: b,
		} = await import("./three.module.wf464D1I.js");
		return {
			Scene: s,
			PerspectiveCamera: v,
			WebGLRenderer: l,
			Group: e,
			Mesh: r,
			ConeGeometry: t,
			MeshPhysicalMaterial: f,
			PCFSoftShadowMap: a,
			AmbientLight: o,
			DirectionalLight: C,
			ACESFilmicToneMapping: u,
			SphereGeometry: g,
			ShaderMaterial: S,
			DoubleSide: y,
			RGBAFormat: M,
			FloatType: G,
			CubeCamera: x,
			WebGLCubeRenderTarget: b,
		};
	}, []);
let i, d, n, m, c, h;
function Y() {
	(i = new T()),
		(d = new R(2.1, window.innerWidth / window.innerHeight, 0.0021, 2100)),
		(n = new A({
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
	const s = document.getElementById("Position");
	s?.appendChild(n.domElement);
	const v = new H({
		uniforms: { time: { value: 0 } },
		vertexShader: _,
		fragmentShader: F,
		side: N,
		transparent: !0,
	});
	(c = new p(new D(21, 21, 21), v)), i.add(c);
	const l = new O(512, { format: V, type: q });
	(h = new j(2.1, 2100, l)), (m = new E());
	const e = 2.1,
		r = 3,
		t = (Math.sqrt(r) / r) * e,
		f = Math.sqrt(e / r) * e,
		a = new p(
			new L(t, f, r),
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
	(a.castShadow = !0),
		(a.receiveShadow = !0),
		m.add(a),
		i.add(m),
		i.add(new I(16777215, 1.21));
	const o = new B(16777215, 1.21);
	o.position.set(0, -t / e, t * e),
		(o.castShadow = !0),
		(o.shadow.camera.near = 0.0021),
		(o.receiveShadow = !0),
		(o.shadow.camera.far = 2100),
		i.add(o),
		d.position.set(-t / e, -t / e, t * e),
		c.position.set(-t / e, -t / e, t * e),
		s?.classList.add("Visible"),
		w();
}
function w() {
	requestAnimationFrame(w),
		(m.rotation.x -= 21e-5),
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
//# sourceMappingURL=index.astro_astro_type_script_index_0_lang.CP-fGSeV.js.map
