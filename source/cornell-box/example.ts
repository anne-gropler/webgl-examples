

import { Canvas, Color } from 'webgl-operate';

import { CornellRenderer } from './cornellrenderer';


function onload() {
    const canvas = new Canvas('example-canvas');
    const context = canvas.context;
    const renderer = new CornellRenderer();
    canvas.renderer = renderer;
    canvas.framePrecision = `float`;
    canvas.frameScale = [0.5, 0.5];
    canvas.clearColor = new Color([0.0, 0.0, 0.0, 1.0]);
    canvas.controller.multiFrameNumber = 1024;
    canvas.element.addEventListener('click', () => { canvas.controller.update(); });

    // export variables
    (window as any)['canvas'] = canvas;
    (window as any)['context'] = context;
    (window as any)['renderer'] = renderer;
}

if (window.document.readyState === 'complete') {
    onload();
} else {
    window.onload = onload;
}