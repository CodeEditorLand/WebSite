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

// @ts-ignore
let Scene, Camera, Renderer, Pyramid, Burn, Camera_Burn;

function Fn() {
	Scene = new _Scene();

	Camera = new PerspectiveCamera(
		2.1,
		window.innerWidth / window.innerHeight,
		0.0021,
		2100,
	);

	// Renderer
	Renderer = new WebGLRenderer({
		antialias: true,
		alpha: true,
		precision: "highp",
		powerPreference: "high-performance",
	});

	Renderer.setPixelRatio(window.devicePixelRatio);

	Renderer.setSize(window.innerWidth, window.innerHeight);

	Renderer.shadowMap.enabled = true;

	Renderer.shadowMap.type = PCFSoftShadowMap;

	Renderer.toneMapping = ACESFilmicToneMapping;

	const Positon = document.getElementById("Position");

	Positon?.appendChild(Renderer.domElement);

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

	Burn = new Mesh(new SphereGeometry(21, 21, 21), Material_Burn);

	Scene.add(Burn);

	const Render_Burn = new WebGLCubeRenderTarget(512, {
		format: RGBAFormat,
		type: FloatType,
	});

	Camera_Burn = new CubeCamera(2.1, 2100, Render_Burn);

	// Pyramid
	Pyramid = new Group();

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

	Pyramid.add(Inner);

	Scene.add(Pyramid);

	// Light
	Scene.add(new AmbientLight(0xffffff, 1.21));

	const See = new DirectionalLight(0xffffff, 1.21);

	See.position.set(0, -Base / How, Base * How);

	See.castShadow = true;

	See.shadow.camera.near = 0.0021;

	See.receiveShadow = true;

	See.shadow.camera.far = 2100;

	Scene.add(See);

	// Movement
	Camera.position.set(-Base / How, -Base / How, Base * How);

	Burn.position.set(-Base / How, -Base / How, Base * How);

	Positon?.classList.add("Visible");

	Move();
}

function Move() {
	requestAnimationFrame(Move);

	Pyramid.rotation.x -= 0.00021;

	Burn.material.uniforms.time.value = performance.now() / 1021000;

	Camera_Burn.position.copy(Burn.position);
	Camera_Burn.update(Renderer, Scene);

	Renderer.render(Scene, Camera);
}

Fn();

window.addEventListener(
	"resize",
	function () {
		Camera.aspect = window.innerWidth / window.innerHeight;

		Camera.updateProjectionMatrix();

		Renderer.setSize(window.innerWidth, window.innerHeight);
	},
	false,
);
