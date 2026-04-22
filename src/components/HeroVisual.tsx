import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useAspect, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three/webgpu";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { Mesh } from "three";

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  pass,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
} from "three/tsl";

const TEXTUREMAP = { src: "https://i.postimg.cc/XYwvXN8D/img-4.png" };
const DEPTHMAP = { src: "https://i.postimg.cc/2SHKQh2q/raw-4.webp" };
const WIDTH = 300;
const HEIGHT = 300;
const SCALE_FACTOR = 0.4;

extend(THREE as never);

function PostProcessing({
  strength = 1,
  threshold = 1,
}: {
  strength?: number;
  threshold?: number;
}) {
  const { gl, scene, camera } = useThree();
  const render = useMemo(() => {
    const renderPipeline = new THREE.RenderPipeline(gl as never);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    renderPipeline.outputNode = scenePassColor.add(bloomPass);
    return renderPipeline;
  }, [camera, gl, scene, strength, threshold]);

  const timer = useMemo(() => new THREE.Timer(), []);

  useFrame(() => {
    timer.update();
    render.render();
  }, 1);

  return null;
}

function Scene() {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);
  const meshRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (rawMap && depthMap) {
      setVisible(true);
    }
  }, [depthMap, rawMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);
    const strength = 0.01;
    const tDepthMap = texture(depthMap);
    const tMap = texture(rawMap, uv().add(tDepthMap.r.mul(uPointer).mul(strength)));
    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);
    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);
    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));
    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);
    const depth = tDepthMap.r;
    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));
    const mask = dot.mul(flow).mul(vec3(0.22, 10, 0.08));
    const final = blendScreen(tMap, mask);

    return {
      material: new THREE.MeshBasicNodeMaterial({
        colorNode: final,
        transparent: true,
        opacity: 0,
      }),
      uniforms: {
        uPointer,
        uProgress,
      },
    };
  }, [depthMap, rawMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);
  const timer = useMemo(() => new THREE.Timer(), []);

  useFrame(({ pointer }) => {
    timer.update();
    const elapsedTime = timer.getElapsed();
    uniforms.uProgress.value = Math.sin(elapsedTime * 0.5) * 0.5 + 0.5;
    uniforms.uPointer.value = pointer;

    if (meshRef.current?.material && "opacity" in meshRef.current.material) {
      const currentMaterial = meshRef.current.material as { opacity: number };
      currentMaterial.opacity = THREE.MathUtils.lerp(
        currentMaterial.opacity,
        visible ? 1 : 0,
        0.07,
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={[w * SCALE_FACTOR, h * SCALE_FACTOR, 1]}
      material={material}
    >
      <planeGeometry />
    </mesh>
  );
}

interface HeroVisualProps {
  active?: boolean;
}

export default function HeroVisual({ active = true }: HeroVisualProps) {
  if (!active) {
    return null;
  }

  return (
    <Canvas
      flat
      dpr={[1, 1.2]}
      performance={{ min: 0.7 }}
      style={{ width: "100%", height: "100%" }}
      gl={async (props) => {
        const rendererProps = props as Record<string, unknown>;
        const renderer = new THREE.WebGPURenderer({
          ...rendererProps,
          antialias: true,
          forceWebGL: true,
        });
        await renderer.init();
        return renderer;
      }}
      onCreated={({ gl, size }) => {
        gl.setSize(size.width, size.height);
      }}
    >
      <PostProcessing />
      <Scene />
    </Canvas>
  );
}
