'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeScene = () => {
  const canvasRef = useRef(null); // Reference for the container div
  const [models, setModels] = useState([]); // Store the loaded models

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
    canvasRef.current.appendChild(renderer.domElement); // Attach renderer to the div

    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light
    directionalLight.position.set(5, 5, 5); // Light position
    scene.add(directionalLight);

    // Camera positioning
    camera.position.set(0, 1, 10); // Position the camera to look at the models

    // Create a loading manager to track model loading status
    const manager = new THREE.LoadingManager();

    // Log when the model is loaded
    manager.onLoad = () => {
      console.log('Loading complete!');
    };

    // Load the GLTF model
    const loader = new GLTFLoader(manager);
    const scale = 0.5; // Scale of the models
    const spaceBetweenModels = 1.0; // Adjust this value to control the space

    const loadedModels = [];

    // Loop to load 4 models
    for (let i = 0; i < 4; i++) {
      loader.load(
        '/cube/cube.glb', // Path to your GLB file
        (gltf) => {
          // Scale and rotate the model
          gltf.scene.scale.set(scale, scale, scale);
          gltf.scene.rotation.y = Math.PI / 6; // Rotate 30% to the left

          // Calculate position for each model along the Y-axis (with space between them)
          const positionY = i * (scale * 2 + spaceBetweenModels); // Adding space between models

          gltf.scene.position.set(0, positionY, 0); // Set the position

          // Add the model to the scene and store it in the loadedModels array
          scene.add(gltf.scene);
          loadedModels.push(gltf.scene);

          // Set the models state once they're all loaded
          if (loadedModels.length === 4) {
            setModels(loadedModels); // Store models in the state
          }
        },
        (xhr) => {
          console.log('Loading progress:', (xhr.loaded / xhr.total) * 100 + '%');
        },
        (error) => {
          console.error('Model loading error:', error);
        }
      );
    }

    // Animation loop to render the scene
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate each model to make them spin
      models.forEach((model) => {
        model.rotation.y += 0.8; // Speed of the rotation
      });

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on component unmount
    return () => {
      renderer.dispose();
    };
  }, [models]); // Re-run animation once the models are loaded

  return <div ref={canvasRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeScene;
