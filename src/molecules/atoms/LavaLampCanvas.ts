import vertexShaderSource from './particles/vert.glsl?raw';
import fragmentShaderSource from './particles/frag.glsl?raw';

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('oopsies, failed to create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('oh no the shader compile failed: ' + log);
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program');

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error('Program link failed: ' + log);
  }
  return program;
}

type RGBA = [number, number, number, number];

export function startLavaLamp(
  canvas: HTMLCanvasElement,
  lavaColor: RGBA = [0.91, 0.53, 0.12, 1], 
  backgroundColor: RGBA = [0, 0, 0, 0]
) {
  const gl = canvas.getContext("webgl");
  if (!gl) throw new Error("WebGL not supported");

  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]),
    gl.STATIC_DRAW
  );

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const timeLocation = gl.getUniformLocation(program, 'u_time');
  const textTextureLocation = gl.getUniformLocation(program, 'u_textTexture');
  const lavaColorLocation = gl.getUniformLocation(program, 'u_lavaColor');
  const backgroundColorLocation = gl.getUniformLocation(program, 'u_backgroundColor');
  const u_blobCountLocation = gl.getUniformLocation(program, 'u_blobCount');
  const u_blobsLocation = gl.getUniformLocation(program, 'u_blobs');

  const textCanvas = document.createElement('canvas');
  textCanvas.width = canvas.width;
  textCanvas.height = canvas.height;
  const ctx = textCanvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D context');

  const dynamicFontSize = Math.min(canvas.width / 10, 104);
  console.log('Dynamic font size:', dynamicFontSize);

  ctx.font = `700 ${dynamicFontSize}px oswald`;
  ctx.fillStyle = 'black';
  ctx.fillText('PRO', textCanvas.width / 4, textCanvas.height / 2, textCanvas.width);
  ctx.textAlign = 'left';

  ctx.font = `700 ${dynamicFontSize}px oswald`;
  ctx.fillStyle = 'black';
  ctx.fillText('GRAMMING', textCanvas.width / 4, textCanvas.height / 2 + dynamicFontSize, textCanvas.width);
  ctx.textAlign = 'left';

  ctx.font = `700 italic ${dynamicFontSize}px oswald`;
  ctx.fillStyle = '#bad4aa';
  ctx.fillText('PARTY', textCanvas.width / 4, textCanvas.height / 2 + 2 * dynamicFontSize, textCanvas.width);
  ctx.textAlign = 'left';

  const textTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.activeTexture(gl.TEXTURE0);
  gl.uniform1i(textTextureLocation, 0);
  
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  function render(time: number) {
    time *= 0.001; 

    gl.useProgram(program); 
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(timeLocation, time);

    const clusterCount = 20;
    const wandererCount = 3;
    const totalBlobs = clusterCount + wandererCount;
    const blobData = new Float32Array(totalBlobs * 3);

    for (let i = 0; i < clusterCount; i++) {
      const t = time * 0.3 + i;

      const baseX = (i + 0.5) / clusterCount;
      const x = baseX + 0.03 * Math.sin(t + i);
      const y = 0.1 + 0.05 * Math.cos(t * 1.3 + i * 2);
      const r = 0.05 + 0.03 * Math.sin(t * 0.7);
      blobData[i * 3 + 0] = x;
      blobData[i * 3 + 1] = y;
      blobData[i * 3 + 2] = r;
    }

    for (let i = 0; i < wandererCount; i++) {
      const j = clusterCount + i;
      const t = time * 0.2 + i * 100;
      const x = 0.5 + 0.45 * Math.sin(t * 0.7 + i);
      const y = 0.5 + 0.45 * Math.cos(t * 0.9 + i * 2);
      const r = 0.12 + 0.05 * Math.sin(t * 0.6 + i);
      blobData[j * 3 + 0] = x;
      blobData[j * 3 + 1] = y;
      blobData[j * 3 + 2] = r;
    }

    gl.uniform1i(u_blobCountLocation, totalBlobs);
    gl.uniform3fv(u_blobsLocation, blobData);

    gl.uniform4f(lavaColorLocation, ...lavaColor); 
    gl.uniform4f(backgroundColorLocation, ...backgroundColor); 
    gl.clearColor(0, 0, 0, 0); 

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
