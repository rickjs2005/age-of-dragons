"use client";

import { shaderMaterial } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Fundo procedural WebGL: lava em movimento, rachaduras incandescentes,
 * chamas turbulentas e heat-distortion tudo num único shader (custo de UM
 * fullscreen pass), mais brasas/fumaça via pontos GPU-instanciados e bloom
 * seletivo nas áreas quentes. Intensidade reage ao scroll; o calor
 * acompanha o cursor. Substitui o antigo glow em CSS.
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
    for (int i = 0; i < 4; i++) {
      sum += amp * snoise(p * freq);
      freq *= 2.05;
      amp *= 0.52;
    }
    return sum;
  }
`;

const LavaMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(1, 1),
    uMouse: new THREE.Vector2(0.5, 0.5),
    uIntensity: 0,
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

    ${NOISE_GLSL}

    vec3 palette(float t) {
      vec3 c0 = vec3(0.0196, 0.0196, 0.0196);
      vec3 c1 = vec3(0.1647, 0.0, 0.0);
      vec3 c2 = vec3(0.3569, 0.0392, 0.0);
      vec3 c3 = vec3(0.6392, 0.0824, 0.0);
      vec3 c4 = vec3(1.0, 0.2706, 0.0);
      vec3 c5 = vec3(1.0, 0.4157, 0.0);
      vec3 c6 = vec3(1.0, 0.8196, 0.3608);

      float s1 = smoothstep(0.0, 0.26, t);
      float s2 = smoothstep(0.2, 0.44, t);
      float s3 = smoothstep(0.4, 0.6, t);
      float s4 = smoothstep(0.56, 0.76, t);
      float s5 = smoothstep(0.73, 0.89, t);
      float s6 = smoothstep(0.86, 0.99, t);

      vec3 col = c0;
      col = mix(col, c1, s1);
      col = mix(col, c2, s2);
      col = mix(col, c3, s3);
      col = mix(col, c4, s4);
      col = mix(col, c5, s5);
      col = mix(col, c6, s6);
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
      float mouseDist = distance(puv, mouseUv);
      float mouseHeat = smoothstep(0.5, 0.0, mouseDist);
      warp += mouseHeat * 0.035 * vec2(sin(uTime * 3.0), cos(uTime * 2.6));

      vec2 wuv = puv + warp;

      vec2 lavaUv = wuv * 1.4 + vec2(uTime * 0.012, uTime * 0.008);
      float lava = fbm(lavaUv);

      // terreno vulcânico: majoritariamente escuro, só respira perto do meio-tom
      float base = smoothstep(-0.25, 0.95, lava) * 0.32;

      // rachaduras: veios finos e brilhantes ao longo do contorno do ruído,
      // mais numerosos conforme o scroll avança
      float ridge = 1.0 - abs(lava);
      float crackLo = mix(0.94, 0.86, uIntensity);
      float cracks = pow(smoothstep(crackLo, 0.995, ridge), 1.4);

      // chamas: só perto da base da tela, em manchas esparsas
      vec2 flameUv = wuv * 2.6 + vec2(0.0, -uTime * 0.22);
      float flameNoise = fbm(flameUv + vec2(0.0, lava * 0.5));
      float patchy = smoothstep(0.1, 0.55, fbm(wuv * 0.7 + vec2(3.3, 1.7)));
      float flameMask = smoothstep(0.72, 1.0, 1.0 - vUv.y) * patchy;
      float flame = smoothstep(0.4, 0.85, flameNoise) * flameMask;

      float pulse = 0.92 + 0.08 * sin(uTime * 0.6 + lava * 2.0);

      float heat = mix(base, base + 0.12, uIntensity);
      heat += cracks * 0.85;
      heat += flame * (0.55 + uIntensity * 0.25);
      heat *= pulse;
      heat = clamp(heat, 0.0, 1.0);

      vec3 color = palette(heat);
      color += vec3(1.0, 0.5, 0.12) * cracks * 0.9;
      color += vec3(1.0, 0.6, 0.18) * flame * 0.55;
      color += mouseHeat * vec3(1.0, 0.4, 0.1) * 0.08;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
);

const ParticleMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 0,
    uHeight: 2,
    uPixelRatio: 1,
    uColorA: new THREE.Color("#ff4500"),
    uColorB: new THREE.Color("#ffd15c"),
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
      float speed = 0.05 + aSeed * 0.09;
      float t = fract(uTime * speed + aSeed * 11.0);
      vLife = t;
      vec3 pos = position;
      pos.x = aBase.x + sin(t * 6.2831 + aSeed * 30.0) * (0.12 + aSeed * 0.22);
      pos.y = mix(-uHeight * 0.55, uHeight * 0.55, t);
      pos.z = 0.0;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = aSize * uPixelRatio * (1.0 + uIntensity * 0.5);
    }
  `,
  /* glsl */ `
    precision highp float;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying float vLife;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c);
      if (d > 0.5) discard;
      float alpha = smoothstep(0.5, 0.0, d);
      float fade = sin(vLife * 3.14159265);
      vec3 col = mix(uColorA, uColorB, vLife);
      gl_FragColor = vec4(col, alpha * fade);
    }
  `,
);

function LavaPlane({
  intensityRef,
  mouseRef,
}: {
  intensityRef: React.RefObject<number>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}) {
  const { viewport, size } = useThree();
  const material = useMemo(() => new LavaMaterialImpl(), []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uResolution.value.set(size.width, size.height);
    material.uniforms.uIntensity.value = intensityRef.current;
    material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function ParticleField({
  count,
  colorA,
  colorB,
  sizeRange,
  speedScale,
  additive,
  z,
  intensityRef,
}: {
  count: number;
  colorA: string;
  colorB: string;
  sizeRange: [number, number];
  speedScale: number;
  additive: boolean;
  z: number;
  intensityRef: React.RefObject<number>;
}) {
  const { viewport } = useThree();

  const material = useMemo(() => {
    const m = new ParticleMaterialImpl();
    m.uniforms.uColorA.value = new THREE.Color(colorA);
    m.uniforms.uColorB.value = new THREE.Color(colorB);
    m.transparent = true;
    m.depthWrite = false;
    m.blending = additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorA, colorB, additive]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    const bases = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * viewport.width * 1.15;
      const y = (Math.random() - 0.5) * viewport.height;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      bases[i * 2] = x;
      bases[i * 2 + 1] = y;
      seeds[i] = Math.random();
      sizes[i] = THREE.MathUtils.lerp(sizeRange[0], sizeRange[1], Math.random());
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aBase", new THREE.BufferAttribute(bases, 2));
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime * speedScale;
    material.uniforms.uIntensity.value = intensityRef.current;
    material.uniforms.uHeight.value = viewport.height;
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return <points geometry={geometry} material={material} />;
}

function Scene({ isMobile }: { isMobile: boolean }) {
  const intensityRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      intensityRef.current = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0;
    };
    const onMove = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight };
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <LavaPlane intensityRef={intensityRef} mouseRef={mouseRef} />
      <ParticleField
        count={isMobile ? 320 : 1100}
        colorA="#ff4500"
        colorB="#ffd15c"
        sizeRange={[3, 9]}
        speedScale={1}
        additive
        z={0.08}
        intensityRef={intensityRef}
      />
      {!isMobile && (
        <ParticleField
          count={36}
          colorA="#120000"
          colorB="#2a0000"
          sizeRange={[90, 170]}
          speedScale={0.2}
          additive={false}
          z={0.04}
          intensityRef={intensityRef}
        />
      )}
      {!isMobile && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.62} luminanceSmoothing={0.2} mipmapBlur />
        </EffectComposer>
      )}
    </>
  );
}

export function LavaBackground() {
  const [enabled, setEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsMobile(window.innerWidth < 820 || !window.matchMedia("(pointer: fine)").matches);
    setEnabled(!reduce);
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="lava-canvas">
      <Canvas
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
        camera={{ position: [0, 0, 5], fov: 55 }}
      >
        <Scene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
