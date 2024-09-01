export const {
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
} = await import("three");

const Burn = document.getElementById("Burn");

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

	document.getElementById("Position")?.appendChild(Renderer.domElement);

	Pyramid = new Group();

	const How = 2.1;
	const Side = 3;
	const Base = (Math.sqrt(Side) / Side) * How;
	const Top = Math.sqrt(How / Side) * How;
	const Extend = 1.021;

	// White pyramid
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

	// Outline
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

	Scene.add(new AmbientLight(0xffffff, 2.1));

	const See = new DirectionalLight(0xffffff, 1);

	See.position.set(5, 5, 5);

	See.castShadow = true;

	See.shadow.mapSize.width = 2048;

	See.shadow.mapSize.height = 2048;

	See.shadow.camera.near = 0.5;

	See.shadow.camera.far = 50;

	Scene.add(See);

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
