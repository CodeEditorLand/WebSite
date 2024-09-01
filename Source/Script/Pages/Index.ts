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
		2,
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
			uniform float gradientAngle; // Angle in radians (0 to 2*PI) 
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
		side: DoubleSide,
		transparent: true,
	});

	Burn = new Mesh(new SphereGeometry(21, 21, 21), Material_Burn);

	Scene.add(Burn);

	const Render_Burn = new WebGLCubeRenderTarget(512, {
		format: RGBAFormat,
		type: FloatType,
	});

	Camera_Burn = new CubeCamera(2, 2100, Render_Burn);

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
