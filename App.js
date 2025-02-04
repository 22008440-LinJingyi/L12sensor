import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { Audio } from 'expo-av';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: 'whitesmoke',
  },
  shakeText: {
    fontSize: 80,
    fontWeight: 'bold',
  },
});

export default function App() {
  const [{x, y, z}, setData] = useState({ x: 0, y: 0, z: 0 });
  const [isShaking, setToShake] = useState(false);
  const [sound, setMySound] = useState();

  useEffect(() => {
    let lastGyro = { x: 0, y: 0, z: 0 };
    Gyroscope.setUpdateInterval(100);
    const subscription = Gyroscope.addListener(gyroData => {
      setData(gyroData);

      const rotation =
          Math.abs(gyroData.x - lastGyro.x) +
          Math.abs(gyroData.y - lastGyro.y) +
          Math.abs(gyroData.z - lastGyro.z);

      if (rotation > 1.2) {
        setToShake(true);
        playSound();
      } else {
        setToShake(false);
      }

      lastGyro = gyroData;
    });

    return () => subscription.remove();
  }, []);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(require('./562174__jarl_fenrir__ring_03.wav'));
    setMySound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
        ? () => {
          sound.unloadAsync();
        }
        : undefined;
  }, [sound]);

  return (
      <View style={styles.container}>
        {isShaking ? <Text style={styles.shakeText}>SHAKE!</Text> : ""}
      </View>
  );
}
