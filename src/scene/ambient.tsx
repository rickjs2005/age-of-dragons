"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree, type ThreeElement } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { ACT_ONE, scrollStore, windowed } from "./scroll-store";

/**
 * O fundo incandescente do Ato II em diante: lava em movimento, rachaduras,
 * chamas e heat-distortion num único passe de tela cheia, mais brasas em
 * pontos instanciados na GPU.
 *
 * Era um componente com `<Canvas>` próprio (`lava-background.tsx`), fixo em
 * `z-index: -1`. Agora divide o Canvas único do palco com o Ato I — dois
 * contextos WebGL na mesma página é desperdício, e o navegador limita quantos
 * ficam ativos.
 *
 * O detalhe que amarra os dois atos: `uAmbient` fica em ZERO durante o Ato I
 * inteiro e só sobe durante o sopro de fogo. Quando o pin solta, a chama do
 * clipe já virou a brasa deste shader — sem corte. O fogo que ele soltou é a
 * luz com que se lê a história dele.
 */

const NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 3; i++) {
      sum += amp * snoise(p * freq);
      freq *= 2.05;
      amp *= 0.52;
    }
    return sum;
  }
`;

const LavaMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
    uMouse: new THREE.Vector2(0.5, 0.5),
    uIntensity: 0,
    uAmbient: 0,
    uVeil: 0.47,
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uIntensity;
    uniform float uAmbient;
    uniform float uVeil;

    ${NOISE_GLSL}

    vec3 palette(float t) {
      vec3 c0 = vec3(0.0196, 0.0196, 0.0196);
      vec3 c1 = vec3(0.1647, 0.0, 0.0);
      vec3 c2 = vec3(0.3569, 0.0392, 0.0);
      vec3 c3 = vec3(0.6392, 0.0824, 0.0);
      vec3 c4 = vec3(1.0, 0.2706, 0.0);
      vec3 c5 = vec3(1.0, 0.4157, 0.0);
      vec3 c6 = vec3(1.0, 0.8196, 0.3608);

      vec3 col = c0;
      col = mix(col, c1, smoothstep(0.0, 0.26, t));
      col = mix(col, c2, smoothstep(0.2, 0.44, t));
      col = mix(col, c3, smoothstep(0.4, 0.6, t));
      col = mix(col, c4, smoothstep(0.56, 0.76, t));
      col = mix(col, c5, smoothstep(0.73, 0.89, t));
      col = mix(col, c6, smoothstep(0.86, 0.99, t));
      return col;
    }

    void main() {
      float aspect = uResolution.x / uResolution.y;
      vec2 puv = vec2(vUv.x * aspect, vUv.y);

      vec2 warp = vec2(
        fbm(puv * 1.5 + vec2(0.0, uTime * 0.05)),
        fbm(puv * 1.5 + vec2(5.2, uTime * 0.04))
      ) * (0.025 + uIntensity * 0.015);

      vec2 mouseUv = vec2(uMouse.x * aspect, uMouse.y);
      float mouseHeat = smoothstep(0.5, 0.0, distance(puv, mouseUv));
      warp += mouseHeat * 0.035 * vec2(sin(uTime * 3.0), cos(uTime * 2.6));

      vec2 wuv = puv + warp;
      float lava = fbm(wuv * 1.4 + vec2(uTime * 0.012, uTime * 0.008));

      // terreno vulcânico: majoritariamente escuro, só respira perto do meio-tom
      float base = 0.05 + smoothstep(-0.25, 0.95, lava) * 0.29;

      // rachaduras: veios finos ao longo do contorno do ruído, mais numerosos
      // conforme o scroll avança
      float ridge = 1.0 - abs(lava);
      float cracks = pow(smoothstep(mix(0.94, 0.86, uIntensity), 0.995, ridge), 1.4);

      // chamas: só perto da base da tela, em manchas esparsas
      vec2 flameUv = wuv * 2.6 + vec2(0.0, -uTime * 0.22);
      float patchy = smoothstep(0.1, 0.55, fbm(wuv * 0.7 + vec2(3.3, 1.7)));
      float flameMask = smoothstep(0.72, 1.0, 1.0 - vUv.y) * patchy;
      float flame = smoothstep(0.4, 0.85, fbm(flameUv + vec2(0.0, lava * 0.5))) * flameMask;

      float heat = mix(base, base + 0.12, uIntensity);
      heat += cracks * 0.85;
      heat += flame * (0.55 + uIntensity * 0.25);
      heat *= 0.92 + 0.08 * sin(uTime * 0.6 + lava * 2.0);
      heat = clamp(heat, 0.0, 1.0);

      vec3 color = palette(heat);
      color += vec3(1.0, 0.5, 0.12) * cracks * 0.9;
      color += vec3(1.0, 0.6, 0.18) * flame * 0.55;
      color += mouseHeat * vec3(1.0, 0.4, 0.1) * 0.08;

      // O véu que garante contraste do texto era CSS estático por cima do
      // canvas. Virou uniform porque durante o Ato I ele precisa estar em zero
      // — cobrir o dragão com uma cortina de 47% seria jogar fora o trabalho.
      color *= (1.0 - uVeil);

      gl_FragColor = vec4(color * uAmbient, 1.0);
    }
  `,
);

const EmberMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 0,
    uAmbient: 0,
    uHeight: 2,
    uPixelRatio: 1,
  },
  /* glsl */ `
    attribute float aSeed;
    attribute float aSize;
    attribute vec2 aBase;
    uniform float uTime;
    uniform float uIntensity;
    uniform float uHeight;
    uniform float uPixelRatio;
    varying float vLife;
    void main() {
      float t = fract(uTime * (0.05 + aSeed * 0.09) + aSeed * 11.0);
      vLife = t;
      vec3 pos = position;
      pos.x = aBase.x + sin(t * 6.2831 + aSeed * 30.0) * (0.12 + aSeed * 0.22);
      pos.y = mix(-uHeight * 0.55, uHeight * 0.55, t);
      pos.z = 0.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * uPixelRatio * (1.0 + uIntensity * 0.5);
    }
  `,
  /* glsl */ `
    precision highp float;
    uniform float uAmbient;
    varying float vLife;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c);
      if (d > 0.5) discard;
      vec3 col = mix(vec3(1.0, 0.27, 0.0), vec3(1.0, 0.82, 0.36), vLife);
      float alpha = smoothstep(0.5, 0.0, d) * sin(vLife * 3.14159265) * uAmbient;
      gl_FragColor = vec4(col, alpha);
    }
  `,
);

extend({ LavaMaterial, EmberMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    lavaMaterial: ThreeElement<typeof LavaMaterial>;
    emberMaterial: ThreeElement<typeof EmberMaterial>;
  }
}

/**
 * Quanto o fundo já acendeu. Zero durante todo o Ato I; sobe junto com o sopro
 * de fogo, de modo que a chama do clipe entrega direto na brasa procedural.
 */
function nivelAmbiente(): number {
  return windowed(scrollStore.actOne, ACT_ONE.chargeEnd, 1);
}

function Lava() {
  const { viewport, size } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    const amb = nivelAmbiente();
    u.uTime.value = state.clock.elapsedTime;
    u.uResolution.value.set(size.width, size.height);
    u.uIntensity.value = scrollStore.global;
    u.uMouse.value.set(scrollStore.pointer.x, scrollStore.pointer.y);
    u.uAmbient.value = amb;
    // O véu de contraste só entra depois que o ato acaba: durante o fogo ele
    // apagaria justamente o que precisa estourar.
    u.uVeil.value = 0.47 * amb;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} renderOrder={0}>
      <planeGeometry args={[1, 1]} />
      <lavaMaterial ref={mat} attach="material" />
    </mesh>
  );
}

/**
 * Ruído determinístico por índice. Substitui `Math.random()`, que o React
 * Compiler barra em render por ser impuro — e com razão: além do lint, a
 * versão determinística faz o campo de brasas nascer idêntico a cada
 * carregamento, então qualquer defeito nele é reproduzível.
 */
function aleatorio(i: number, sal: number): number {
  const x = Math.sin(i * 127.1 + sal * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function Embers({ count }: { count: number }) {
  const { viewport } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    const bases = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const x = (aleatorio(i, 1) - 0.5) * viewport.width * 1.15;
      const y = (aleatorio(i, 2) - 0.5) * viewport.height;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      bases[i * 2] = x;
      bases[i * 2 + 1] = y;
      seeds[i] = aleatorio(i, 3);
      sizes[i] = THREE.MathUtils.lerp(3, 9, aleatorio(i, 4));
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aBase", new THREE.BufferAttribute(bases, 2));
    return geo;
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    u.uIntensity.value = scrollStore.global;
    u.uAmbient.value = nivelAmbiente();
    u.uHeight.value = viewport.height;
    u.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return (
    <points geometry={geometry} renderOrder={1}>
      <emberMaterial
        ref={mat}
        attach="material"
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function Ambient({ leve }: { leve: boolean }) {
  return (
    <>
      <Lava />
      <Embers count={leve ? 220 : 750} />
    </>
  );
}
