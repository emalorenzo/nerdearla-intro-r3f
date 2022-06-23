import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, Suspense } from 'react';
import { Points, PointMaterial, Sparkles, SpotLight, Text3D, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random';

import { Spaceship as SpaceshipModel } from '../../models/Spaceship/Spaceship';
import { Tree1 } from '../../models/Tree1/Tree1';
import { Tree2 } from '../../models/Tree2/Tree2';

const Stars = (props) => {
  const pointsRef = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 15 }));
  useFrame((state, delta) => {
    pointsRef.current.rotation.x -= delta / 10;
    pointsRef.current.rotation.y -= delta / 15;
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffa0e0"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const Trees = ({ count = 50, ...props }) => {
  const trees = new Array(count).fill('');
  return trees.map((tree, i) => {
    const Tree = i < count / 2 ? Tree1 : Tree2;
    return (
      <group
        key={i}
        rotation-z={2 * Math.PI * Math.random()}
        rotation-x={2 * Math.PI * Math.random()}
        {...props}>
        <Tree castShadow receiveShadow scale={Math.random() * 0.05 + 0.05} position={[0, 3, 0]} />
      </group>
    );
  });
};

const Spaceship = () => {
  const spaceshipRef = useRef();
  const lightRef = useRef();
  const target = new THREE.Vector3();

  const viewport = useThree((state) => state.viewport);

  useFrame((state) => {
    target.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0);
    const time = state.clock.getElapsedTime();

    spaceshipRef.current.position.y = 0 + Math.sin(time) * 0.1;
    spaceshipRef.current.lookAt(target);

    lightRef.current.target.position.lerp(target, 0.1);
    lightRef.current.target.updateMatrixWorld();
  });

  return (
    <group ref={spaceshipRef} position={[-1, 2, 4]}>
      <SpaceshipModel rotation-y={Math.PI * 0.92} scale={0.2} />
      <SpotLight
        ref={lightRef}
        castShadow
        position={[0, -0.16, 0]}
        distance={5}
        angle={0.4}
        attenuation={5}
        anglePower={5}
        radiusTop={0.01}
      />
      <pointLight intensity={0.2} position={[0, 0, -0.3]} color="#f7c767" />
      <Sphere position={[0, 0.05, -0.45]} color="#f7c767" args={[0.01, 32, 32]}>
        <meshStandardMaterial color="#f7c767" />
      </Sphere>
    </group>
  );
};

const SceneContent = () => {
  return (
    <>
      <Sparkles count={500} scale={2} size={1} speed={0.4} position={[0, -1, 0.5]} />
      {/* planet */}
      <mesh position={[0, -3, 0]} receiveShadow>
        <sphereBufferGeometry attach="geometry" args={[3, 32, 64]} />
        <meshStandardMaterial attach="material" color="#679138" />
      </mesh>
      <Stars />
      <Spaceship />
      {/* text */}
      <Text3D
        castShadow
        receiveShadow
        font={process.env.PUBLIC_URL + '/bold.blob'}
        size={0.5}
        position={[-1.05, -0.16, 0.6]}>
        ND101
        <meshStandardMaterial color="#c2c2c2" />
      </Text3D>
      <Trees position={[0, -3, 0]} />
      {/* text ground */}
      <mesh position={[0, -0.6, 0.6]}>
        <boxBufferGeometry attach="geometry" args={[2]} />
        <meshStandardMaterial color="#c2c2c2" />
      </mesh>
    </>
  );
};

export const MainScene = () => {
  return (
    <Canvas shadows style={{ position: 'absolute', inset: 0 }} camera={{ position: [0, 0, 6] }}>
      <ambientLight intensity={0.1} color="#c2c2c2" />
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
};
