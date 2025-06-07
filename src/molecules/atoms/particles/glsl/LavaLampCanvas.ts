import vertexShaderSource from "./vert.glsl?raw";
import fragmentShaderSource from "./frag.glsl?raw";

type RGBA = [number, number, number, number];

/**
 * Creates a WebGL shader from the given source code.
 * @param gl - The WebGL rendering context.
 * @param type - The type of shader (vertex or fragment).
 * @param source - The GLSL source code for the shader.
 * @returns The compiled WebGLShader object.
 * @throws Will throw an error if shader creation or compilation fails.
 */
function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("oopsies, failed to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("oh no the shader compile failed: " + log);
  }
  return shader;
}

/**
 * Creates a WebGL program by linking vertex and fragment shaders.
 * @param gl - The WebGL rendering context.
 * @param vsSource - The GLSL source code for the vertex shader.
 * @param fsSource - The GLSL source code for the fragment shader.
 * @returns The linked WebGLProgram object.
 * @throws Will throw an error if program creation or linking fails.
 */
function createProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
): WebGLProgram {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error("Program link failed: " + log);
  }
  return program;
}

function renderTextToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  font: string,
  color: string,
  featureColor: string,
  textAlign: CanvasTextAlign = "left",
  fontSize: number = 104,
  textPosition: [number, number] = [0.5, 0.5]
) {
  const splitText = text.split("\n");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get 2D context");

  for (let i = 0; i < splitText.length; i++) {
    if (i === splitText.length - 1) {
      ctx.font = `italic ${fontSize}px ${font}`;
      ctx.fillStyle = featureColor;
    } else {
      ctx.font = `${fontSize}px ${font}`;
      ctx.fillStyle = color;
    }
    ctx.textAlign = textAlign;
    const x = canvas.width * textPosition[0];
    const y = canvas.height * textPosition[1] + i * fontSize;
    ctx.fillText(splitText[i], x, y);
  }
}

export interface TextConfig {
  content: string;
  font: string;
  color: string;
  featureColor: string;
  textAlign?: CanvasTextAlign;
  fontSize?: number;
  textPosition?: [number, number];
}

export interface ClusterConfig {
  speed: number;
  xAmplitude: number;
  baseY: number;
  yAmplitude: number;
  sizeBase: number;
  sizeAmplitude: number;
}

export interface WandererConfig {
  speed: number;
  xAmplitude: number;
  yAmplitude: number;
  baseSize: number;
  sizeAmplitude: number;
}

export function startLavaLamp(
  canvas: HTMLCanvasElement,
  lavaColor: RGBA = [0.91, 0.53, 0.12, 1],
  backgroundColor: RGBA = [0, 0, 0, 0],
  clusterCount: number = 20,
  wandererCount: number = 3,
  clusterConfig: ClusterConfig = {
    speed: 0.3,
    xAmplitude: 0.03,
    baseY: 0.1,
    yAmplitude: 0.05,
    sizeBase: 0.05,
    sizeAmplitude: 0.03,
  },
  wandererConfig: WandererConfig = {
    speed: 0.2,
    xAmplitude: 0.45,
    yAmplitude: 0.45,
    baseSize: 0.12,
    sizeAmplitude: 0.05,
  },
  textConfig: TextConfig = {
    content: "HELLO\nWORLD",
    font: "oswald",
    color: "#000000",
    featureColor: "#bad4aa",
    textAlign: "left",
    fontSize: 104,
    textPosition: [0.25, 0.5],
  }
) {
  const gl = canvas.getContext("webgl");
  if (!gl) throw new Error("WebGL not supported");

  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const timeLocation = gl.getUniformLocation(program, "u_time");
  const textTextureLocation = gl.getUniformLocation(program, "u_textTexture");
  const lavaColorLocation = gl.getUniformLocation(program, "u_lavaColor");
  const backgroundColorLocation = gl.getUniformLocation(
    program,
    "u_backgroundColor"
  );
  const u_blobCountLocation = gl.getUniformLocation(program, "u_blobCount");
  const u_blobsLocation = gl.getUniformLocation(program, "u_blobs");

  // Set up the text canvas
  const textCanvas = document.createElement("canvas");
  textCanvas.width = canvas.width;
  textCanvas.height = canvas.height;

  renderTextToCanvas(
    textCanvas,
    textConfig.content,
    textConfig.font,
    textConfig.color,
    textConfig.featureColor,
    textConfig.textAlign,
    textConfig.fontSize,
    textConfig.textPosition
  );

  // Convert text canvas to texture for WebGL
  const textTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // required to not be upside down
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    textCanvas
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.activeTexture(gl.TEXTURE0);
  gl.uniform1i(textTextureLocation, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Render loop
  function render(time: number) {
    time *= 0.001;

    if (!gl) {
      console.error("WebGL context lost");
      return;
    }

    gl.useProgram(program);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(timeLocation, time);

    const totalBlobs = clusterCount + wandererCount;
    const blobData = new Float32Array(totalBlobs * 3);

    for (let i = 0; i < clusterCount; i++) {
      const t = time * clusterConfig.speed + i;
      const baseX = (i + 0.5) / clusterCount;
      const x = baseX + clusterConfig.xAmplitude * Math.sin(t + i);
      const y =
        clusterConfig.baseY +
        clusterConfig.yAmplitude * Math.cos(t * 1.3 + i * 2);
      const r =
        clusterConfig.sizeBase +
        clusterConfig.sizeAmplitude * Math.sin(t * 0.7);
      blobData[i * 3 + 0] = x;
      blobData[i * 3 + 1] = y;
      blobData[i * 3 + 2] = r;
    }

    for (let i = 0; i < wandererCount; i++) {
      const j = clusterCount + i;
      const t = time * wandererConfig.speed + i * 100;
      const x = 0.5 + wandererConfig.xAmplitude * Math.sin(t * 0.7 + i);
      const y = 0.5 + wandererConfig.yAmplitude * Math.cos(t * 0.9 + i * 2);
      const r =
        wandererConfig.baseSize +
        wandererConfig.sizeAmplitude * Math.sin(t * 0.6 + i);
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
