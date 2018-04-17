var BLUEWHALE_CONFIG = {
	isDev: ($.trim(window.location.hash) == '#dev'),
	noIdleTimeout: ($.trim(window.location.hash) == '#noidle'),
	idleSeconds: 30
};
