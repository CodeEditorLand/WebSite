const m = "modulepreload",
	f = function (o) {
		return "/" + o;
	},
	c = {},
	h = function (d, s, b) {
		let i = Promise.resolve();
		if (s && s.length > 0) {
			document.getElementsByTagName("link");
			const r = document.querySelector("meta[property=csp-nonce]"),
				n = r?.nonce || r?.getAttribute("nonce");
			i = Promise.all(
				s.map((e) => {
					if (((e = f(e)), e in c)) return;
					c[e] = !0;
					const a = e.endsWith(".css"),
						l = a ? '[rel="stylesheet"]' : "";
					if (document.querySelector(`link[href="${e}"]${l}`)) return;
					const t = document.createElement("link");
					if (
						((t.rel = a ? "stylesheet" : m),
						a || ((t.as = "script"), (t.crossOrigin = "")),
						(t.href = e),
						n && t.setAttribute("nonce", n),
						document.head.appendChild(t),
						a)
					)
						return new Promise((u, p) => {
							t.addEventListener("load", u),
								t.addEventListener("error", () =>
									p(
										new Error(
											`Unable to preload CSS for ${e}`,
										),
									),
								);
						});
				}),
			);
		}
		return i
			.then(() => d())
			.catch((r) => {
				const n = new Event("vite:preloadError", { cancelable: !0 });
				if (
					((n.payload = r),
					window.dispatchEvent(n),
					!n.defaultPrevented)
				)
					throw r;
			});
	};
(
	await h(async () => {
		const { initializeApp: o } = await import("./index.esm.BoasBFnU.js");
		return { initializeApp: o };
	}, [])
).initializeApp({
	apiKey: "AIzaSyCT9aEJsoE6hbA5dOYwg1zYmJLRVrLTdP8",
	appId: "1:693091182396:web:f8af7a0361f0b3d00ba039",
	authDomain: "code-editor-land.firebaseapp.com",
	databaseURL:
		"https://code-editor-land-default-rtdb.europe-west1.firebasedatabase.app/",
	measurementId: "G-M9TTCEF4GL",
	messagingSenderId: "693091182396",
	projectId: "code-editor-land",
	storageBucket: "code-editor-land.appspot.com",
});
//# sourceMappingURL=Base.astro_astro_type_script_index_0_lang.DoEmQ_vS.js.map
