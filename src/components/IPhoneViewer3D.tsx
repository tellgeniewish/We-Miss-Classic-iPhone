import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { RotateCcw } from "lucide-react";

const PhoneModel = () => {
  const { scene } = useGLTF("/models/iphone.glb");
  return <primitive object={scene} scale={1} />;
};

const IPhoneViewer3D = () => {
  return (
    <div className="mb-8">
      <div className="w-full h-[300px] cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 30 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -3, -5]} intensity={0.4} />
          <spotLight position={[0, 10, 0]} intensity={0.5} />
          <Suspense fallback={null}>
            <PhoneModel />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.6}
            autoRotate
            autoRotateSpeed={1.5}
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

// Preload the model
useGLTF.preload("/models/iphone.glb");

export default IPhoneViewer3D;
