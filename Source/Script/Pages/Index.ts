import Fragment from "@Script/Pages/Index/Fragment.frag?raw";
import Vertex from "@Script/Pages/Index/Vertex.glsl?raw";

export const {
	Scene: _Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Group,
	Mesh,
	ConeGeometry,
	MeshPhysicalMaterial,
	PCFSoftShadowMap,
	AmbientLight,
	DirectionalLight,
	ACESFilmicToneMapping,
	SphereGeometry,
	ShaderMaterial,
	DoubleSide,
	RGBAFormat,
	FloatType,
	CubeCamera,
	WebGLCubeRenderTarget,
} = await import("three");

let P6, P5, P4, P3, P2, P1;

function Fn() {
	P6 = new _Scene();

	P5 = new PerspectiveCamera(
		2.1,
		window.innerWidth / window.innerHeight,
		0.0021,
		2100,
	);

	// Renderer
	P4 = new WebGLRenderer({
		antialias: true,
		alpha: true,
		precision: "highp",
		powerPreference: "high-performance",
	});

	P4.setPixelRatio(window.devicePixelRatio);

	P4.setSize(window.innerWidth, window.innerHeight);

	P4.shadowMap.enabled = true;

	P4.shadowMap.type = PCFSoftShadowMap;

	P4.toneMapping = ACESFilmicToneMapping;

	const Positon = document.getElementById("Position");

	Positon?.appendChild(P4.domElement);

	// Burn
	const Material_Burn = new ShaderMaterial({
		uniforms: {
			time: { value: 0.0 },
		},
		vertexShader: Vertex,
		fragmentShader: Fragment,
		side: DoubleSide,
		transparent: true,
	});

	P2 = new Mesh(new SphereGeometry(21, 21, 21), Material_Burn);

	P6.add(P2);

	const Render_Burn = new WebGLCubeRenderTarget(512, {
		format: RGBAFormat,
		type: FloatType,
	});

	P1 = new CubeCamera(2.1, 2100, Render_Burn);

	// Pyramid
	P3 = new Group();

	const How = 2.1;
	const Side = 3;
	const Base = (Math.sqrt(Side) / Side) * How;
	const Top = Math.sqrt(How / Side) * How;

	// Inner
	const Inner = new Mesh(
		new ConeGeometry(Base, Top, Side),
		new MeshPhysicalMaterial({
			color: 0xffffff,
			metalness: 0.0021,
			roughness: 0.0021,
			clearcoat: 0.0021,
			clearcoatRoughness: 0.0021,
			reflectivity: 0.0021,
			envMap: Render_Burn.texture,
			envMapIntensity: 0.0021,
		}),
	).translateY(-Base / How);

	Inner.castShadow = true;

	Inner.receiveShadow = true;

	P3.add(Inner);

	P6.add(P3);

	// Light
	P6.add(new AmbientLight(0xffffff, 1.21));

	const See = new DirectionalLight(0xffffff, 1.21);

	See.position.set(0, -Base / How, Base * How);

	See.castShadow = true;

	See.shadow.camera.near = 0.0021;

	See.receiveShadow = true;

	See.shadow.camera.far = 2100;

	P6.add(See);

	// Movement
	P5.position.set(-Base / How, -Base / How, Base * How);

	P2.position.set(-Base / How, -Base / How, Base * How);

	Positon?.classList.add("Visible");

	Move();
}

function Move() {
	requestAnimationFrame(Move);

	P3.rotation.x -= 0.00021;

	P2.material.uniforms.time.value = performance.now() / 1021000;

	P1.position.copy(P2.position);
	P1.update(P4, P6);

	P4.render(P6, P5);
}

Fn();

window.addEventListener(
	"resize",
	function () {
		P5.aspect = window.innerWidth / window.innerHeight;

		P5.updateProjectionMatrix();

		P4.setSize(window.innerWidth, window.innerHeight);
	},
	false,
);
