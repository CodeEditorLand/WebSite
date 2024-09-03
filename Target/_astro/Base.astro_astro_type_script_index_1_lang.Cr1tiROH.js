import { _ as t } from "./preload-helper.BiBI96sQ.js";
let E = document.getElementById("Position"),
	m = !1,
	u,
	l,
	n,
	s,
	r,
	w,
	_,
	p;
const { Mesh: h } = await t(async () => {
		const { Mesh: a } = await import("./three.module.wf464D1I.js");
		return { Mesh: a };
	}, []),
	P = () => {
		requestAnimationFrame(P),
			(w.rotation.x -= 21e-5),
			(_.material.uniforms.time.value = performance.now() / 1021e3),
			p.position.copy(_.position),
			p.update(r, n),
			r.render(n, s),
			m || ((m = !0), E?.classList.add("Visible"));
	},
	y = async () => {
		(n = new (
			await t(async () => {
				const { Scene: e } = await import("./three.module.wf464D1I.js");
				return { Scene: e };
			}, [])
		).Scene()),
			(s = new (
				await t(async () => {
					const { PerspectiveCamera: e } = await import(
						"./three.module.wf464D1I.js"
					);
					return { PerspectiveCamera: e };
				}, [])
			).PerspectiveCamera(
				2.1,
				window.innerWidth / window.innerHeight,
				0.0021,
				2100,
			)),
			(r = new (
				await t(async () => {
					const { WebGLRenderer: e } = await import(
						"./three.module.wf464D1I.js"
					);
					return { WebGLRenderer: e };
				}, [])
			).WebGLRenderer({
				antialias: !0,
				alpha: !0,
				precision: "highp",
				powerPreference: "high-performance",
			})),
			E?.appendChild(r.domElement),
			r.setPixelRatio(window.devicePixelRatio),
			r.setSize(window.innerWidth, window.innerHeight),
			(r.shadowMap.enabled = !0),
			(r.shadowMap.type = (
				await t(async () => {
					const { PCFSoftShadowMap: e } = await import(
						"./three.module.wf464D1I.js"
					);
					return { PCFSoftShadowMap: e };
				}, [])
			).PCFSoftShadowMap),
			(r.toneMapping = (
				await t(async () => {
					const { ACESFilmicToneMapping: e } = await import(
						"./three.module.wf464D1I.js"
					);
					return { ACESFilmicToneMapping: e };
				}, [])
			).ACESFilmicToneMapping),
			(l = new (
				await t(async () => {
					const { ShaderMaterial: e } = await import(
						"./three.module.wf464D1I.js"
					);
					return { ShaderMaterial: e };
				}, [])
			).ShaderMaterial({
				uniforms: { time: { value: 0 } },
				vertexShader: (
					await t(async () => {
						const { default: e } = await import("./S2.DFuxdmXZ.js");
						return { default: e };
					}, [])
				).default,
				fragmentShader: (
					await t(async () => {
						const { default: e } = await import("./S1.CfmLkcaz.js");
						return { default: e };
					}, [])
				).default,
				side: (
					await t(async () => {
						const { DoubleSide: e } = await import(
							"./three.module.wf464D1I.js"
						);
						return { DoubleSide: e };
					}, [])
				).DoubleSide,
				transparent: !0,
			})),
			(_ = new h(
				new (
					await t(async () => {
						const { SphereGeometry: e } = await import(
							"./three.module.wf464D1I.js"
						);
						return { SphereGeometry: e };
					}, [])
				).SphereGeometry(21, 21, 21),
				l,
			)),
			n.add(_),
			(u = new (
				await t(async () => {
					const { WebGLCubeRenderTarget: e } = await import(
						"./three.module.wf464D1I.js"
					);
					return { WebGLCubeRenderTarget: e };
				}, [])
			).WebGLCubeRenderTarget(512, {
				format: (
					await t(async () => {
						const { RGBAFormat: e } = await import(
							"./three.module.wf464D1I.js"
						);
						return { RGBAFormat: e };
					}, [])
				).RGBAFormat,
				type: (
					await t(async () => {
						const { FloatType: e } = await import(
							"./three.module.wf464D1I.js"
						);
						return { FloatType: e };
					}, [])
				).FloatType,
			})),
			(p = new (
				await t(async () => {
					const { CubeCamera: e } = await import(
						"./three.module.wf464D1I.js"
					);
					return { CubeCamera: e };
				}, [])
			).CubeCamera(2.1, 2100, u)),
			(w = new (
				await t(async () => {
					const { Group: e } = await import(
						"./three.module.wf464D1I.js"
					);
					return { Group: e };
				}, [])
			).Group());
		const a = 2.1,
			d = 3,
			i = (Math.sqrt(d) / d) * a,
			v = Math.sqrt(a / d) * a,
			c = new h(
				new (
					await t(async () => {
						const { ConeGeometry: e } = await import(
							"./three.module.wf464D1I.js"
						);
						return { ConeGeometry: e };
					}, [])
				).ConeGeometry(i, v, d),
				new (
					await t(async () => {
						const { MeshPhysicalMaterial: e } = await import(
							"./three.module.wf464D1I.js"
						);
						return { MeshPhysicalMaterial: e };
					}, [])
				).MeshPhysicalMaterial({
					color: 16777215,
					metalness: 0.0021,
					roughness: 0.0021,
					clearcoat: 0.0021,
					clearcoatRoughness: 0.0021,
					reflectivity: 0.0021,
					envMap: u.texture,
					envMapIntensity: 0.0021,
				}),
			).translateY(-i / a);
		(c.castShadow = !0),
			(c.receiveShadow = !0),
			w.add(c),
			n.add(w),
			n.add(
				new (
					await t(async () => {
						const { AmbientLight: e } = await import(
							"./three.module.wf464D1I.js"
						);
						return { AmbientLight: e };
					}, [])
				).AmbientLight(16777215, 1.21),
			);
		const o = new (
			await t(async () => {
				const { DirectionalLight: e } = await import(
					"./three.module.wf464D1I.js"
				);
				return { DirectionalLight: e };
			}, [])
		).DirectionalLight(16777215, 1.21);
		o.position.set(0, -i / a, i * a),
			(o.castShadow = !0),
			(o.shadow.camera.near = 0.0021),
			(o.receiveShadow = !0),
			(o.shadow.camera.far = 2100),
			n.add(o),
			s.position.set(-i / a, -i / a, i * a),
			_.position.set(-i / a, -i / a, i * a),
			P();
	};
await y();
window.addEventListener(
	"resize",
	function () {
		(s.aspect = window.innerWidth / window.innerHeight),
			s.updateProjectionMatrix(),
			r.setSize(window.innerWidth, window.innerHeight);
	},
	!1,
);
//# sourceMappingURL=Base.astro_astro_type_script_index_1_lang.Cr1tiROH.js.map
