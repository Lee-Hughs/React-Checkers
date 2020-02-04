const proxy = require("http-proxy-middleware");

module.exports = function(app) {
	app.use(
		proxy("/bot", {
			target: "http://35.238.80.17",
			changeOrigin: true
		})
	);
};
