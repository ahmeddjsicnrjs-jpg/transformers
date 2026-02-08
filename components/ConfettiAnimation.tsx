import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Animated, Dimensions, Easing } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = [
  '#4CAF50', '#FFD700', '#E3000F', '#0057B8',
  '#FF6B35', '#9C27B0', '#00BCD4', '#FF4081',
  '#8BC34A', '#FF9800', '#3F51B5', '#E91E63',
];

const PIECE_COUNT = 55;

interface PieceConfig {
  startX: number;
  startY: number;
  // horizontal sway: left-right-left as it falls
  swayMid1X: number;
  swayMid2X: number;
  endX: number;
  endY: number;
  rotation: number;
  size: number;
  isRect: boolean;
  color: string;
  delay: number;
  duration: number;
}

function buildConfigs(): PieceConfig[] {
  return Array.from({ length: PIECE_COUNT }, (_, i) => {
    const startX = Math.random() * SCREEN_WIDTH;
    const swayAmount = 30 + Math.random() * 60; // 30–90px sway
    const swayDir = Math.random() > 0.5 ? 1 : -1;

    return {
      startX,
      startY: -(20 + Math.random() * 80), // above screen
      swayMid1X: startX + swayAmount * swayDir,
      swayMid2X: startX - swayAmount * swayDir * 0.7,
      endX: startX + (Math.random() - 0.5) * 40,
      endY: SCREEN_HEIGHT + 30,
      rotation: (Math.random() - 0.5) * 1080,
      size: 5 + Math.random() * 7,
      isRect: Math.random() > 0.35,
      color: COLORS[i % COLORS.length],
      delay: Math.floor(Math.random() * 1200), // 0–1.2s stagger for rain effect
      duration: 2000 + Math.random() * 1500,   // 2.0–3.5s fall
    };
  });
}

interface ConfettiAnimationProps {
  active: boolean;
}

export default function ConfettiAnimation({ active }: ConfettiAnimationProps) {
  const anims = useRef<Animated.Value[]>([]);
  const configs = useMemo(() => buildConfigs(), []);

  if (anims.current.length === 0) {
    anims.current = configs.map(() => new Animated.Value(0));
  }

  const fire = useCallback(() => {
    anims.current.forEach(a => a.setValue(0));

    const animations = anims.current.map((anim, i) =>
      Animated.sequence([
        Animated.delay(configs[i].delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: configs[i].duration,
          easing: Easing.in(Easing.quad), // accelerate like gravity
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.parallel(animations).start();
  }, [configs]);

  useEffect(() => {
    if (active) {
      fire();
    }
  }, [active, fire]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {configs.map((cfg, i) => {
        const anim = anims.current[i];

        // fall straight down with gravity
        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [cfg.startY, cfg.endY],
        });

        // sway left-right-left as it falls
        const translateX = anim.interpolate({
          inputRange: [0, 0.25, 0.55, 0.8, 1],
          outputRange: [
            cfg.startX,
            cfg.swayMid1X,
            cfg.swayMid2X,
            cfg.swayMid1X * 0.5 + cfg.endX * 0.5,
            cfg.endX,
          ],
        });

        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${cfg.rotation}deg`],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.03, 0.8, 1],
          outputRange: [0, 1, 1, 0],
        });

        const scale = anim.interpolate({
          inputRange: [0, 0.1, 0.5, 1],
          outputRange: [0.5, 1, 1, 0.6],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.piece,
              {
                width: cfg.size,
                height: cfg.isRect ? cfg.size * 2 : cfg.size,
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
