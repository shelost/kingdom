// Paste into the /stage page (CDP Runtime.evaluate): presses "Save still", catches the
// download, and resolves to a 1100 px JPEG data URL.
new Promise((resolve) => {
	const click = HTMLAnchorElement.prototype.click;
	HTMLAnchorElement.prototype.click = function () {
		HTMLAnchorElement.prototype.click = click;
		const img = new Image();
		img.onload = () => {
			const c = document.createElement('canvas');
			c.width = 1100;
			c.height = Math.round((1100 * img.height) / img.width);
			c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
			resolve(c.toDataURL('image/jpeg', 0.82));
		};
		img.src = this.href;
	};
	[...document.querySelectorAll('button')].find((b) => b.textContent.includes('Save still')).click();
});
