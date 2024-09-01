export const { RGBELoader } = await import("@Script/Pages/Index/Loader.js");

export const {
	PointLight,
	Scene: _Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Group,
	Mesh,
	ConeGeometry,
	MeshPhysicalMaterial,
	BackSide,
	PCFSoftShadowMap,
	AmbientLight,
	DirectionalLight,
	ACESFilmicToneMapping,
	PMREMGenerator,
} = await import("three");

const Burn = document.getElementById("Burn");
const Vision = document.getElementById("Vision");

Burn.style.background = `
	radial-gradient(circle at center, rgba(255,69,0,0.8) 0%, rgba(139,0,0,0.8) 50%, rgba(0,0,0,0.9) 100%),
	repeating-radial-gradient(circle at center, rgba(255,69,0,0.2) 0%, rgba(255,69,0,0.2) 3%, transparent 3%, transparent 100%)
`;

Burn.style.backgroundSize = "100% 100%, 21px 21px";

Burn.style.animation = "pulse 21s ease-in-out infinite";

const Style = document.createElement("style");

Style.textContent = `
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.21; }
	}
`;

document.head.appendChild(Style);

// @ts-ignore
let Scene, Camera, Renderer, Pyramid;

function Fn() {
	Scene = new _Scene();

	Camera = new PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);

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

	Pyramid = new Group();

	const How = 2.1;
	const Side = 3;
	const Base = (Math.sqrt(Side) / Side) * How;
	const Top = Math.sqrt(How / Side) * How;
	const Extend = 1.021;

	// Inner
	const Inner = new Mesh(
		new ConeGeometry(Base, Top, Side),
		new MeshPhysicalMaterial({
			color: 0xffffff,
			metalness: 0.021,
			roughness: 0.021,
			clearcoat: 0.021,
			clearcoatRoughness: 0.021,
			reflectivity: 1,
		}),
	);

	Inner.position.y = -Base / 2;

	Inner.castShadow = true;

	Inner.receiveShadow = true;

	Pyramid.add(Inner);

	// Outer
	const Outer = new Mesh(
		new ConeGeometry(Base * Extend, Top * Extend, Side),
		new MeshPhysicalMaterial({
			color: 0x000000,
			side: BackSide,
			metalness: 0.021,
			roughness: 0.021,
		}),
	);

	Outer.position.y = -Base / 2;

	Outer.castShadow = true;

	Outer.receiveShadow = true;

	Pyramid.add(Outer);

	Scene.add(Pyramid);

	Scene.add(new AmbientLight(0xffffff, 1.21));

	const See = new DirectionalLight(0xffffff, 0.8);

	See.position.set(5, 5, 5);

	See.castShadow = true;

	See.shadow.mapSize.width = 1024;

	See.shadow.mapSize.height = 1024;

	See.shadow.camera.near = 0.5;

	See.shadow.camera.far = 50;

	Scene.add(See);

	const envMapLoader = new PMREMGenerator(Renderer);

	new RGBELoader().setPath("/HDR/").load("Kiara.hdr", function (Texture) {
		const Environment = envMapLoader.fromEquirectangular(Texture).texture;

		Scene.environment = Environment;

		Inner.material.envMap = Environment;
		Outer.material.envMap = Environment;

		Texture.dispose();

		envMapLoader.dispose();

		Positon?.classList.add("Visible");
		Vision?.classList.add("Visible");
	});

	Camera.position.z = 5;

	Move();
}

function Move() {
	requestAnimationFrame(Move);

	Pyramid.rotation.y -= 0.00021;
	Pyramid.rotation.z -= 0.00021;
	Pyramid.rotation.x -= 0.00021;

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
