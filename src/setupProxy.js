const proxy = require("http-proxy-middleware");

module.exports = function(app) {
	app.use(
		proxy("/bot", {
			target: "https://35.188.137.81",
			changeOrigin: true
		})
	);
};
