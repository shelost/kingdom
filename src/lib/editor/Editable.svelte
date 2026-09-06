<script lang="ts">
	// A minimal contenteditable wrapper. The DOM owns the text while typing —
	// we only write `value` into it on mount, so the caret never jumps.
	let {
		value = '',
		placeholder = '',
		plain = false, // plaintext-only, newlines allowed (dialogue / verse)
		single = false, // Enter is intercepted instead of inserting a newline
		class: cls = '',
		oninput,
		onenter,
		ondeleteempty
	}: {
		value?: string;
		placeholder?: string;
		plain?: boolean;
		single?: boolean;
		class?: string;
		oninput: (v: string) => void;
		onenter?: () => void;
		ondeleteempty?: () => void;
	} = $props();

	let el: HTMLElement;

	function init(node: HTMLElement) {
		if (plain) node.innerText = value;
		else node.innerHTML = value;
	}

	function handleInput() {
		oninput(plain ? el.innerText.replace(/\n$/, '') : el.innerHTML);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && single && !e.shiftKey) {
			e.preventDefault();
			onenter?.();
		} else if (e.key === 'Backspace' && ondeleteempty) {
			if (el.innerText.replace(/\n/g, '').trim() === '') {
				e.preventDefault();
				ondeleteempty();
			}
		}
	}
</script>

<div
	bind:this={el}
	use:init
	class="editable {cls}"
	contenteditable={plain ? 'plaintext-only' : 'true'}
	data-placeholder={placeholder}
	oninput={handleInput}
	onkeydown={handleKeydown}
	role="textbox"
	tabindex="0"
	aria-multiline={!single}
></div>

<style>
	.editable {
		outline: none;
		white-space: pre-wrap;
		word-break: break-word;
		min-height: 1.4em;
		border-radius: var(--radius);
		transition: background 120ms ease;
	}

	.editable:hover {
		background: rgba(0, 0, 0, 0.025);
	}

	.editable:focus {
		background: rgba(47, 111, 219, 0.05);
	}

	.editable:empty::before {
		content: attr(data-placeholder);
		color: #b9b9b7;
		pointer-events: none;
	}
</style>
