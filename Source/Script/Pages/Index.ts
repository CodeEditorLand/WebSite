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
	SphereGeometry,
	ShaderMaterial,
	DoubleSide,
	WebGLRenderTarget,
	RGBAFormat,
	FloatType,
	CubeCamera,
	WebGLCubeRenderTarget,
} = await import("three");

export const { RGBELoader } = await import("@Script/Pages/Index/Loader.js");

// @ts-ignore
let Scene, Camera, Renderer, Pyramid, Burn, Camera_Burn;

function Fn() {
	Scene = new _Scene();

	Camera = new PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
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
		vertexShader: `
		  varying vec2 vUv;
		  varying vec3 vNormal;
	  
		  void main() {
			vUv = uv;
			vNormal = normalize(normalMatrix * normal);
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		  }
		`,
		fragmentShader: `
		  uniform float time;
		  varying vec2 vUv;
		  varying vec3 vNormal;
	  
		  void main() {
			vec2 center = vec2(0.5);
			float distanceToCenter = distance(vUv, center);
	  
			// Hot side colors
			vec4 hotColor1 = vec4(255.0 / 255.0, 69.0 / 255.0, 0.0 / 255.0, 0.8);
			vec4 hotColor2 = vec4(139.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.8);
			vec4 hotColor3 = vec4(0.0, 0.0, 0.0, 0.9);
	  
			// Cold side colors
			vec4 coldColor1 = vec4(0.0, 100.0 / 255.0, 255.0 / 255.0, 0.8);
			vec4 coldColor2 = vec4(0.0, 0.0, 139.0 / 255.0, 0.8);
			vec4 coldColor3 = vec4(0.0, 0.0, 0.0, 0.9);
	  
			// Use normal to determine hot or cold side
			float hotColdMix = (vNormal.x + 1.0) / 2.0;
	  
			// Blend colors based on distance and hot/cold mix
			vec4 hotGradient = mix(hotColor1, hotColor2, smoothstep(0.0, 0.21, distanceToCenter));
			hotGradient = mix(hotGradient, hotColor3, smoothstep(0.21, 1.0, distanceToCenter));
	  
			vec4 coldGradient = mix(coldColor1, coldColor2, smoothstep(0.0, 0.21, distanceToCenter));
			coldGradient = mix(coldGradient, coldColor3, smoothstep(0.21, 1.0, distanceToCenter));
	  
			vec4 radialGradient = mix(coldGradient, hotGradient, hotColdMix);
	  
			// Repeating radial gradient (flames/ice)
			float effectSize = 0.021;
			float effectIntensity = 0.021;
			float effectDistance = mod(distanceToCenter * 21.0 + time * 2.1, effectSize * 2.1) - effectSize;
			effectIntensity *= smoothstep(effectSize, 0.0, abs(effectDistance));
	  
			vec4 hotEffectColor = vec4(255.0 / 255.0, 69.0 / 255.0, 0.0, effectIntensity);
			vec4 coldEffectColor = vec4(0.0, 191.0 / 255.0, 255.0 / 255.0, effectIntensity);
			vec4 effectColor = mix(coldEffectColor, hotEffectColor, hotColdMix);
	  
			radialGradient = mix(radialGradient, effectColor, effectIntensity);
	  
			// Apply opacity animation
			float opacity = mix(1.0, 0.21, sin(time * 2.1) * 0.21 + 0.21);
			gl_FragColor = vec4(radialGradient.rgb, opacity);
		  }
		`,
		side: DoubleSide,
		transparent: true,
	});

	Burn = new Mesh(new SphereGeometry(21, 21, 21), Material_Burn);

	Scene.add(Burn);

	const Render_Burn = new WebGLCubeRenderTarget(512, {
		format: RGBAFormat,
		type: FloatType,
	});

	Camera_Burn = new CubeCamera(0.1, 1000, Render_Burn);

	// Pyramid
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
			reflectivity: 0.21,
			envMap: Render_Burn.texture,
			envMapIntensity: 0.21,
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

	// Light
	Scene.add(new AmbientLight(0xffffff, 1.21));

	const See = new DirectionalLight(0xffffff, 1.21);

	See.position.set(0, -Base / How, Base * How);

	See.castShadow = true;

	See.shadow.camera.near = 0.1;

	See.shadow.camera.far = 1000;

	Scene.add(See);

	// Loader
	const Loader = new PMREMGenerator(Renderer);

	new RGBELoader().setPath("/HDR/").load("Kiara.hdr", function (Texture) {
		const Environment = Loader.fromEquirectangular(Texture).texture;

		Scene.environment = Environment;

		Texture.dispose();

		Loader.dispose();

		Positon?.classList.add("Visible");
	});

	// Movement
	Camera.position.set(0, -Base / How, Base * How);
	Burn.position.set(0, -Base / How, Base * How);

	Move();
}

function Move() {
	requestAnimationFrame(Move);

	Pyramid.rotation.x -= 0.00021;
	Pyramid.rotation.y -= 0.00021;
	Pyramid.rotation.z -= 0.00021;

	Burn.material.uniforms.time.value = performance.now() / 21000;

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
