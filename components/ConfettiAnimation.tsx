import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Animated, Dimensions, Easing } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = [
  '#4CAF50', '#FFD700', '#E3000F', '#0057B8',
  '#FF6B35', '#9C27B0', '#00BCD4', '#FF4081',
  '#8BC34A', '#FF9800', '#3F51B5', '#E91E63',
];

const PIECE_COUNT = 50;

interface PieceConfig {
  // start near horizontal center, at ~40% screen height
  originX: number;
  originY: number;
  // how far it flies horizontally & vertically at peak
  burstX: number;
  peakY: number;
  // final landing position
  endX: number;
  endY: number;
  // visuals
  rotation: number;
  size: number;
  isRect: boolean;
  color: string;
  // timing
  delay: number;
  duration: number;
}

function buildConfigs(): PieceConfig[] {
  const cx = SCREEN_WIDTH / 2;
  const cy = SCREEN_HEIGHT * 0.4;

  return Array.from({ length: PIECE_COUNT }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const force = 0.3 + Math.random() * 0.7; // 0.3–1.0
    const spreadX = Math.cos(angle) * SCREEN_WIDTH * 0.55 * force;
    const spreadY = Math.sin(angle) * SCREEN_HEIGHT * 0.35 * force;

    return {
      originX: cx + (Math.random() - 0.5) * 30,
      originY: cy + (Math.random() - 0.5) * 30,
      burstX: cx + spreadX * 0.6,
      peakY: cy + spreadY - SCREEN_HEIGHT * 0.15 * force, // upward bias
      endX: cx + spreadX,
      endY: SCREEN_HEIGHT + 30, // fall off screen
      rotation: (Math.random() - 0.5) * 1080,
      size: 5 + Math.random() * 7,
      isRect: Math.random() > 0.4,
      color: COLORS[i % COLORS.length],
      delay: Math.floor(Math.random() * 600), // 0–600ms stagger
      duration: 1800 + Math.random() * 1200, // 1.8–3.0s each
    };
  });
}

interface ConfettiAnimationProps {
  active: boolean;
}

export default function ConfettiAnimation({ active }: ConfettiAnimationProps) {
  const anims = useRef<Animated.Value[]>([]);
  const configs = useMemo(() => buildConfigs(), []);

  // lazily create Animated.Values
  if (anims.current.length === 0) {
    anims.current = configs.map(() => new Animated.Value(0));
  }

  const fire = useCallback(() => {
    // reset all
    anims.current.forEach(a => a.setValue(0));

    // stagger individual launches
    const animations = anims.current.map((anim, i) =>
      Animated.sequence([
        Animated.delay(configs[i].delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: configs[i].duration,
          easing: Easing.out(Easing.cubic),
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

        // Parabolic Y: origin → peak (up) → fall off screen
        const translateY = anim.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [cfg.originY, cfg.peakY, cfg.endY],
        });

        // X: origin → burst spread → drift further
        const translateX = anim.interpolate({
          inputRange: [0, 0.3, 1],
          outputRange: [cfg.originX, cfg.burstX, cfg.endX],
        });

        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${cfg.rotation}deg`],
        });

        const opacity = anim.interpolate({
          inputRange: [0, 0.05, 0.7, 1],
          outputRange: [0, 1, 1, 0],
        });

        const scale = anim.interpolate({
          inputRange: [0, 0.15, 0.6, 1],
          outputRange: [0, 1.2, 1, 0.4],
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
