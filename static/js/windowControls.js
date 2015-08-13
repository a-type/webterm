var remote = require("remote");

$(function () {
	var browserWindow = remote.getCurrentWindow();

	var $windowClose = $(".window-close");
	$windowClose.click(function () {
		browserWindow.close();
	});

	var $windowMaximize = $(".window-maximize");
	$windowMaximize.click(function () {
		if (browserWindow.isMaximized()) {
			browserWindow.unmaximize();
		}
		else {
			browserWindow.maximize();
		}
	});

	var $windowMinimize = $(".window-minimize");
	$windowMinimize.click(function () {
		browserWindow.minimize();
	});
});
