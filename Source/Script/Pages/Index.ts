import type {
	CubeCamera,
	Group,
	Mesh,
	PerspectiveCamera,
	Scene,
	ShaderMaterial,
	WebGLCubeRenderTarget,
	WebGLRenderer,
} from "three";

let P10: HTMLElement | null = document.getElementById("Position");

let P9: boolean = false,
	P8: WebGLCubeRenderTarget,
	P7: ShaderMaterial,
	P6: Scene,
	P5: PerspectiveCamera,
	P4: WebGLRenderer,
	P3: Group,
	P2: Mesh,
	P1: CubeCamera;

export const { Mesh: _P2 } = await import("three");

export const Move = () => {
	requestAnimationFrame(Move);

	P3.rotation.x -= 0.00021;

	// @ts-expect-error
	P2.material.uniforms.time.value = performance.now() / 1021000;

	P1.position.copy(P2.position);
	P1.update(P4, P6);

	P4.render(P6, P5);

	if (!P9) {
		P9 = true;
		P10?.classList.add("Visible");
	}
};

const R1 = async () => {
	P6 = new (await import("three")).Scene();

	P5 = new (await import("three")).PerspectiveCamera(
		2.1,
		window.innerWidth / window.innerHeight,
		0.0021,
		2100,
	);

	P4 = new (await import("three")).WebGLRenderer({
		antialias: true,
		alpha: true,
		precision: "highp",
		powerPreference: "high-performance",
	});

	P10?.appendChild(P4.domElement);

	P4.setPixelRatio(window.devicePixelRatio);

	P4.setSize(window.innerWidth, window.innerHeight);

	P4.shadowMap.enabled = true;

	P4.shadowMap.type = (await import("three")).PCFSoftShadowMap;

	P4.toneMapping = (await import("three")).ACESFilmicToneMapping;

	P7 = new (await import("three")).ShaderMaterial({
		uniforms: {
			time: { value: 0.0 },
		},
		vertexShader: (await import("@Script/Pages/Index/S2.glsl?raw")).default,
		fragmentShader: (await import("@Script/Pages/Index/S1.frag?raw"))
			.default,
		side: (await import("three")).DoubleSide,
		transparent: true,
	});

	P2 = new _P2(new (await import("three")).SphereGeometry(21, 21, 21), P7);

	P6.add(P2);

	P8 = new (await import("three")).WebGLCubeRenderTarget(512, {
		format: (await import("three")).RGBAFormat,
		type: (await import("three")).FloatType,
	});

	P1 = new (await import("three")).CubeCamera(2.1, 2100, P8);

	P3 = new (await import("three")).Group();

	const How = 2.1;
	const Side = 3;
	const Base = (Math.sqrt(Side) / Side) * How;
	const Top = Math.sqrt(How / Side) * How;

	const Inner = new _P2(
		new (await import("three")).ConeGeometry(Base, Top, Side),
		new (await import("three")).MeshPhysicalMaterial({
			color: 0xffffff,
			metalness: 0.0021,
			roughness: 0.0021,
			clearcoat: 0.0021,
			clearcoatRoughness: 0.0021,
			reflectivity: 0.0021,
			envMap: P8.texture,
			envMapIntensity: 0.0021,
		}),
	).translateY(-Base / How);

	Inner.castShadow = true;

	Inner.receiveShadow = true;

	P3.add(Inner);

	P6.add(P3);

	P6.add(new (await import("three")).AmbientLight(0xffffff, 1.21));

	const See = new (await import("three")).DirectionalLight(0xffffff, 1.21);

	See.position.set(0, -Base / How, Base * How);

	See.castShadow = true;

	See.shadow.camera.near = 0.0021;

	See.receiveShadow = true;

	See.shadow.camera.far = 2100;

	P6.add(See);

	P5.position.set(-Base / How, -Base / How, Base * How);

	P2.position.set(-Base / How, -Base / How, Base * How);

	Move();
};

await R1();

window.addEventListener(
	"resize",
	function () {
		P5.aspect = window.innerWidth / window.innerHeight;

		P5.updateProjectionMatrix();

		P4.setSize(window.innerWidth, window.innerHeight);
	},
	false,
);
