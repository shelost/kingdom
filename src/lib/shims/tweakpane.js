/** ESM stand-in so @threlte/extras can load without tweakpane's UMD `Pane` export. */
export class Pane {
	addFolder() {
		return this;
	}
	addBinding() {
		return this;
	}
	addInput() {
		return this;
	}
	addMonitor() {
		return this;
	}
	addButton() {
		return this;
	}
	addBlade() {
		return this;
	}
	dispose() {}
}

export default { Pane };
