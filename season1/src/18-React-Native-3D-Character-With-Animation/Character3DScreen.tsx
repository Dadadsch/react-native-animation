import { StyleSheet, View, PixelRatio, Dimensions } from 'react-native';
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber/native';
import useControls from 'r3f-native-orbitcontrols';
import * as THREE from 'three';  // Stelle sicher, dass dies die aktualisierte Version ist
import Character from './src/components/Character';
import Trigger from './src/components/Trigger';
import Loader from './src/components/Loader';
import { SafeAreaView } from 'react-native-safe-area-context';

const Character3DScreen = () => {
  const [OrbitControls, events] = useControls();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Loader />}
      <View style={styles.modelContainer} {...events}>
        <Canvas
          camera={{ position: [0, 1, 3], fov: 45 }}
          gl={{ antialias: true }}
          onCreated={(state) => {
            const { gl }: any = state;  // Temporäre Lösung mit any für Typenkonflikte
            // Setze den Pixel-Ratio für klare Darstellung
            gl.setPixelRatio(PixelRatio.get());

            // Verwende explizite Zuweisungen für Encoding und Tone Mapping
            gl.outputEncoding = 3000;  // 3000 ist der numerische Fallback-Wert für sRGBEncoding
            gl.toneMapping = THREE.ACESFilmicToneMapping || 1023; // 1023 ist der numerische Fallback-Wert für ACESFilmicToneMapping
            gl.toneMappingExposure = 1.5;

            // Zusätzliche WebGL Einstellungen
            const _gl: any = gl.getContext();
            const pixelStorei = _gl.pixelStorei.bind(_gl);
            _gl.pixelStorei = function (...args: any[]) {
              const [parameter] = args;
              switch (parameter) {
                case _gl.UNPACK_FLIP_Y_WEBGL:
                  return pixelStorei(...args);
              }
            };

            // Verbesserung: Hochwertigere Schattenqualität
            // gl.shadowMap.enabled = true;
            // gl.shadowMap.type = THREE.PCFSoftShadowMap; // Bessere Schatten, kann die Performance beeinträchtigen

            // Verbesserung: Höhere Auflösung des Renderings
            //const windowWidth = Dimensions.get('window').width;
            // const windowHeight = Dimensions.get('window').height;
            // gl.setSize(windowWidth * 2, windowHeight * 2); // Erhöht die Renderauflösung

            // Verbesserung: Antialiasing-Optimierung
            gl.antialias = true; // Aktiviert hochwertiges Antialiasing, falls noch nicht aktiv

          }}>
          <OrbitControls enablePan={false} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, 5]} intensity={0.8} />

          {/* Verbesserung: Zusätzliche Lichtquellen für realistischere Beleuchtung */}
          {/* <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow /> */}
          {/* <hemisphereLight skyColor={'blue'} groundColor={'red'} intensity={0.6} /> */}

          <Suspense fallback={<Trigger setLoading={setLoading} />}>
            <Character />
          </Suspense>

          {/* Verbesserung: Verwende Post-Processing für Effekte wie Bloom oder Tiefenschärfe */}
        </Canvas>
      </View>
    </SafeAreaView>
  );
};

export default Character3DScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  modelContainer: {
    flex: 1,
  },
});
