'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cubes: THREE.Mesh[] = [];

    // Create four cubes stacked vertically
    for (let i = 0; i < 4; i++) {
      const cube = new THREE.Mesh(geometry, material.clone());
      cube.position.set(0, -i * 2.5, 0);
      scene.add(cube);
      cubes.push(cube);
    }

    camera.position.set(0, -2.5, 10);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate each cube
      cubes.forEach((cube) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      });
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeScene;
