import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    camera: THREE.Camera | null;
    scene: THREE.Scene | null;
    renderer: THREE.WebGLRenderer | null;
    uniforms: {
      time: { value: number };
      resolution: { value: THREE.Vector2 };
      glow: { value: number };
      tint: { value: THREE.Color };
    } | null;
    animationId: number | null;
    handleResize: (() => void) | null;
  }>({
    camera: null,
    scene: null,
    renderer: null,
    uniforms: null,
    animationId: null,
    handleResize: null,
  });

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    container.innerHTML = "";

    // Use OrthographicCamera for full-screen quad
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
      glow: { value: 0.0008 },
      tint: { value: new THREE.Color("#00ff88") },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform vec2 resolution;
        uniform float time;
        uniform float glow;
        uniform vec3 tint;
        varying vec2 vUv;

        float random(in float x) {
          return fract(sin(x) * 1e4);
        }

        void main(void) {
          // Use resolution for aspect-correct UVs
          vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

          vec2 mosaicScale = vec2(4.0, 2.0);
          vec2 screenSize = vec2(256.0, 256.0);
          uv.x = floor(uv.x * screenSize.x / mosaicScale.x) / (screenSize.x / mosaicScale.x);
          uv.y = floor(uv.y * screenSize.y / mosaicScale.y) / (screenSize.y / mosaicScale.y);

          float t = time * 0.06 + random(uv.x) * 0.4;
          vec3 color = vec3(0.0);

          for (int j = 0; j < 3; j++) {
            for (int i = 0; i < 5; i++) {
              color[j] += glow * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) - length(uv));
            }
          }

          vec3 shaderColor = vec3(color[2], color[1], color[0]);
          float intensity = max(shaderColor.r, max(shaderColor.g, shaderColor.b));
          vec3 finalColor = tint * intensity;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    
    const dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);
    
    // Ensure canvas fills container
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const updateSize = (width: number, height: number) => {
      renderer.setSize(width, height, false);
      uniforms.resolution.value.set(width * dpr, height * dpr);
    };

    // Use ResizeObserver for reliable resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          updateSize(width, height);
        }
      }
    });
    
    resizeObserver.observe(container);

    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: null,
      handleResize: null, // No longer needed with ResizeObserver
    };

    animate();

    return () => {
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      resizeObserver.disconnect();

      geometry.dispose();
      material.dispose();

      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose();
      }

      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" />;
}
