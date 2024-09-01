export const { default: Animation } = await import("three.js");

const Burn = document.getElementById("Burn");

Burn.style.background = `
	radial-gradient(circle at center, rgba(255,69,0,0.8) 0%, rgba(139,0,0,0.8) 50%, rgba(0,0,0,0.9) 100%),
	repeating-radial-gradient(circle at center, rgba(255,69,0,0.2) 0%, rgba(255,69,0,0.2) 3%, transparent 3%, transparent 100%)
`;

Burn.style.backgroundSize = "100% 100%, 50px 50px";

Burn.style.animation = "pulse 4s ease-in-out infinite";

const Style = document.createElement("style");

Style.textContent = `
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.79; }
	}
`;

document.head.appendChild(Style);

let Scene, Camera, Renderer, Pyramid;

function Fn() {
	Scene = new Animation.Scene();

	Camera = new Animation.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);

	Renderer = new Animation.WebGLRenderer({
		antialias: true,
		alpha: true,
	});

	Renderer.setSize(window.innerWidth, window.innerHeight);

	document.getElementById("Position")?.appendChild(Renderer.domElement);

	Pyramid = new Animation.Group();

	// White pyramid
	Pyramid.add(
		new Animation.Mesh(
			new Animation.ConeGeometry(1, 1.5, 4),
			new Animation.MeshBasicMaterial({
				color: 0xffffff,
			}),
		),
	);

	// Outline
	Pyramid.add(
		new Animation.Mesh(
			new Animation.ConeGeometry(1.021, 1.5315, 4.084),
			new Animation.MeshBasicMaterial({
				color: 0x000000,
				side: Animation.BackSide,
			}),
		),
	);

	Scene.add(Pyramid);

	Camera.position.z = 2;

	Move();
}

function Move() {
	requestAnimationFrame(Move);

	Pyramid.rotation.y += 0.00021;

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
