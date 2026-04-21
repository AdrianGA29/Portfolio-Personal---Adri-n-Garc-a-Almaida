import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import { Mesh } from 'three';
import { MatrixText } from './MatrixText';

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add
} from 'three/tsl';

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

extend(THREE as any);

// Post Processing component
const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    const renderPipeline = new THREE.RenderPipeline(gl as any);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode('output');
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    // Add bloom effect to the scene
    const final = scenePassColor.add(bloomPass);

    renderPipeline.outputNode = final;

    return renderPipeline;
  }, [camera, gl, scene, strength, threshold]);

  const timer = useMemo(() => new THREE.Timer(), []);

  useFrame(() => {
    timer.update();
    render.render();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);

  const meshRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (rawMap && depthMap) {
      setVisible(true);
    }
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.01;

    const tDepthMap = texture(depthMap);

    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength))
    );

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);

    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));

    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);

    const depth = tDepthMap.r;

    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));

    // Primary color mask (Neon Green)
    const mask = dot.mul(flow).mul(vec3(0.22, 10, 0.08));

    const final = blendScreen(tMap, mask);

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return {
      material,
      uniforms: {
        uPointer,
        uProgress,
      },
    };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  const timer = useMemo(() => new THREE.Timer(), []);

  useFrame(() => {
    timer.update();
    const elapsedTime = timer.getElapsed();
    uniforms.uProgress.value = (Math.sin(elapsedTime * 0.5) * 0.5 + 0.5);
    if (meshRef.current && 'material' in meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material as any;
      if ('opacity' in mat) {
        mat.opacity = THREE.MathUtils.lerp(
          mat.opacity,
          visible ? 1 : 0,
          0.07
        );
      }
    }
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  const scaleFactor = 0.40;
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};

export default function Hero() {
  const titleWords = 'ADRIÁN GARCÍA ALMAIDA'.split(' ');
  const [visibleWords, setVisibleWords] = useState(0);
  const [delays, setDelays] = useState<number[]>([]);

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07));
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 200);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  return (
    <section id="home" className="relative h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="group relative inline-flex items-center gap-3 px-4 py-2 mb-10 rounded-full bg-neutral-950/40 border border-white/10 backdrop-blur-md shadow-2xl transition-all hover:bg-neutral-900/60 hover:border-primary/30"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_10px_#39FF14]"></span>
          </div>
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
            Disponible para proyectos
          </span>
          
          {/* Subtle hover glow */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl bg-primary/10 -z-10" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-5xl md:text-8xl lg:text-9xl font-black font-headline tracking-tighter leading-[0.85] mb-8 uppercase text-center flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-8">
            {titleWords.slice(0, 2).map((word, index) => (
              <div
                key={index}
                className={`${index < visibleWords ? 'fade-in' : ''} text-white`}
                style={{ 
                  animationDelay: `${index * 0.1 + (delays[index] || 0)}s`, 
                  opacity: index < visibleWords ? 1 : 0 
                }}
              >
                {word}
              </div>
            ))}
          </div>
          {titleWords[2] && (
            <div
              className={`${2 < visibleWords ? 'fade-in' : ''} text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary-dim`}
              style={{ 
                animationDelay: `${2 * 0.1 + (delays[2] || 0)}s`, 
                opacity: 2 < visibleWords ? 1 : 0 
              }}
            >
              {titleWords[2]}
            </div>
          )}
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-6 min-h-[2rem] flex items-center justify-center"
        >
          <MatrixText 
            text="Técnico Informático & Trainee Developer"
            initialDelay={500}
            letterInterval={80}
            letterAnimationDuration={400}
          />
        </motion.div>
      </div>

      <div className="scroll-indicator pointer-events-none z-20">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas
          flat
          dpr={[1, 1.5]}
          style={{ width: "100%", height: "100%" }}
          gl={async (props) => {
            const renderer = new THREE.WebGPURenderer({
              ...(props as any),
              antialias: true,
              forceWebGL: true,
            });
            await renderer.init();
            return renderer;
          }}
          onCreated={({ gl, size }) => {
            gl.setSize(size.width, size.height);
            window.requestAnimationFrame(() => {
              gl.setSize(size.width, size.height);
              window.dispatchEvent(new Event("resize"));
            });
          }}
        >
          <PostProcessing fullScreenEffect={true} />
          <Scene />
        </Canvas>
      </div>
    </section>
  );
}
