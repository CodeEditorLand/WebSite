import { _ as c } from "./preload-helper.BiBI96sQ.js";
const { default: e } = await c(async () => {
		const { default: s } = await import("./three.module.N10KhnfT.js");
		return { default: s };
	}, []),
	r = document.getElementById("Burn");
r.style.background = `
	radial-gradient(circle at center, rgba(255,69,0,0.8) 0%, rgba(139,0,0,0.8) 50%, rgba(0,0,0,0.9) 100%),
	repeating-radial-gradient(circle at center, rgba(255,69,0,0.2) 0%, rgba(255,69,0,0.2) 3%, transparent 3%, transparent 100%)
`;
r.style.backgroundSize = "100% 100%, 50px 50px";
r.style.animation = "pulse 4s ease-in-out infinite";
const o = document.createElement("style");
o.textContent = `
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.79; }
	}
`;
document.head.appendChild(o);
let a, i, t, n;
function w() {
	(a = new e.Scene()),
		(i = new e.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1e3,
		)),
		(t = new e.WebGLRenderer({ antialias: !0, alpha: !0 })),
		t.setSize(window.innerWidth, window.innerHeight),
		document.getElementById("Position")?.appendChild(t.domElement),
		(n = new e.Group()),
		n.add(
			new e.Mesh(
				new e.ConeGeometry(1, 1.5, 4),
				new e.MeshBasicMaterial({ color: 16777215 }),
			),
		),
		n.add(
			new e.Mesh(
				new e.ConeGeometry(1.021, 1.5315, 4.084),
				new e.MeshBasicMaterial({ color: 0, side: e.BackSide }),
			),
		),
		a.add(n),
		(i.position.z = 2),
		d();
}
function d() {
	requestAnimationFrame(d), (n.rotation.y += 21e-5), t.render(a, i);
}
w();
window.addEventListener(
	"resize",
	function () {
		(i.aspect = window.innerWidth / window.innerHeight),
			i.updateProjectionMatrix(),
			t.setSize(window.innerWidth, window.innerHeight);
	},
	!1,
);
//# sourceMappingURL=index.astro_astro_type_script_index_0_lang.CVM01LWl.js.map
