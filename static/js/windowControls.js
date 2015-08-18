var remote = require("remote");

document.addEventListener("DOMContentLoaded", function () {
	var browserWindow = remote.getCurrentWindow();

	var $windowClose = document.getElementsByClassName("window-close")[0];
	$windowClose.click(function () {
		browserWindow.close();
	});

	var $windowMaximize = document.getElementsByClassName("window-maximize")[0];
	$windowMaximize.click(function () {
		if (browserWindow.isMaximized()) {
			browserWindow.unmaximize();
		}
		else {
			browserWindow.maximize();
		}
	});

	var $windowMinimize = document.getElementsByClassName("window-minimize")[0];
	$windowMinimize.click(function () {
		browserWindow.minimize();
	});
});
