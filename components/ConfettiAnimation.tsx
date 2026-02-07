import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Animated, Dimensions, Easing } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#4CAF50',
  '#FFD700',
  '#E3000F',
  '#0057B8',
  '#FF6B35',
  '#9C27B0',
  '#00BCD4',
  '#FF4081',
];

const CONFETTI_COUNT = 40;
const DURATION = 2500;

interface PieceConfig {
  startX: number;
  drift: number;
  rotation: number;
  delay: number;
  size: number;
  isRect: boolean;
  color: string;
}

function buildConfigs(): PieceConfig[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    startX: Math.random() * SCREEN_WIDTH,
    drift: (Math.random() - 0.5) * SCREEN_WIDTH * 0.6,
    rotation: (Math.random() - 0.5) * 720,
    delay: Math.random() * 400,
    size: 6 + Math.random() * 6,
    isRect: Math.random() > 0.5,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));
}

interface ConfettiAnimationProps {
  active: boolean;
}

export default function ConfettiAnimation({ active }: ConfettiAnimationProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const configs = useMemo(() => buildConfigs(), []);

  useEffect(() => {
    if (active) {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: DURATION,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [active, progress]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {configs.map((cfg, i) => {
        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, SCREEN_HEIGHT + 40],
        });

        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [cfg.startX, cfg.startX + cfg.drift],
        });

        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${cfg.rotation}deg`],
        });

        const opacity = progress.interpolate({
          inputRange: [0, 0.1, 0.75, 1],
          outputRange: [0, 1, 1, 0],
        });

        const scale = progress.interpolate({
          inputRange: [0, 0.2, 0.8, 1],
          outputRange: [0.3, 1, 1, 0.5],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.piece,
              {
                width: cfg.size,
                height: cfg.isRect ? cfg.size * 1.6 : cfg.size,
                borderRadius: cfg.isRect ? 2 : cfg.size / 2,
                backgroundColor: cfg.color,
                opacity,
                transform: [{ translateX }, { translateY }, { rotate }, { scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  piece: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
