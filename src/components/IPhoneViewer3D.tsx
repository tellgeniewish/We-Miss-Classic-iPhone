import { Suspense, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";

import frontImg from "@/assets/iphone-360/angle-0.png";
import backImg from "@/assets/iphone-360/angle-4.png";
import rightImg from "@/assets/iphone-360/angle-2.png";
import leftImg from "@/assets/iphone-360/angle-6.png";
import topImg from "@/assets/iphone-360/top.png";
import bottomImg from "@/assets/iphone-360/bottom.png";

// iPhone SE1 approximate proportions: 123.8 x 58.6 x 7.6 mm
// Scaled: height=3.1, width=1.46, depth=0.19
const PHONE_HEIGHT = 3.1;
const PHONE_WIDTH = 1.46;
const PHONE_DEPTH = 0.19;

const PhoneModel = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const textures = useLoader(THREE.TextureLoader, [
    rightImg,   // +x (right)
    leftImg,    // -x (left)
    topImg,     // +y (top)
    bottomImg,  // -y (bottom)
    frontImg,   // +z (front)
    backImg,    // -z (back)
  ]);

  const materials = textures.map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.3,
      metalness: 0.8,
    });
  });

  return (
    <mesh ref={meshRef} material={materials}>
      <boxGeometry args={[PHONE_WIDTH, PHONE_HEIGHT, PHONE_DEPTH]} />
    </mesh>
  );
};

const IPhoneViewer3D = () => {
  return (
    <div className="mb-8">
      <div className="w-full h-[280px] cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, -3, -5]} intensity={0.3} />
          <Suspense fallback={null}>
            <PhoneModel />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.6}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
          />
        </Canvas>
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-3">
        <RotateCcw className="w-3 h-3 text-muted-foreground" />
        <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
          드래그하여 360° 회전
        </p>
      </div>
    </div>
  );
};

export default IPhoneViewer3D;
