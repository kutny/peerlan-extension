var backgroundProcessHandler = container.getBackgroundProcessHandler();

function initBackground() {
	backgroundProcessHandler.start();
}

document.addEventListener('DOMContentLoaded', initBackground);