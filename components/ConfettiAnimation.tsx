import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#4CAF50', // green
  '#FFD700', // gold
  '#E3000F', // red
  '#0057B8', // blue
  '#FF6B35', // orange
  '#9C27B0', // purple
  '#00BCD4', // cyan
  '#FF4081', // pink
];

const CONFETTI_COUNT = 40;
const ANIMATION_DURATION = 2500;

interface ConfettiPieceProps {
  index: number;
  trigger: Animated.SharedValue<number>;
}

function ConfettiPiece({ index, trigger }: ConfettiPieceProps) {
  const config = useMemo(() => {
    const startX = Math.random() * SCREEN_WIDTH;
    const drift = (Math.random() - 0.5) * SCREEN_WIDTH * 0.6;
    const rotation = (Math.random() - 0.5) * 720;
    const delay = Math.random() * 400;
    const size = 6 + Math.random() * 6;
    const isRect = Math.random() > 0.5;
    const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
    return { startX, drift, rotation, delay, size, isRect, color };
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    const progress = trigger.value;
    const y = interpolate(progress, [0, 1], [-20, SCREEN_HEIGHT + 40]);
    const x = config.startX + config.drift * progress;
    const rotate = config.rotation * progress;
    const opacity = interpolate(progress, [0, 0.1, 0.75, 1], [0, 1, 1, 0]);
    const scale = interpolate(progress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.5]);

    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${rotate}deg` },
        { scale },
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          width: config.size,
          height: config.isRect ? config.size * 1.6 : config.size,
          borderRadius: config.isRect ? 2 : config.size / 2,
          backgroundColor: config.color,
        },
        animatedStyle,
      ]}
    />
  );
}

interface ConfettiAnimationProps {
  active: boolean;
}

export default function ConfettiAnimation({ active }: ConfettiAnimationProps) {
  const trigger = useSharedValue(0);

  useEffect(() => {
    if (active) {
      trigger.value = 0;
      trigger.value = withDelay(
        50,
        withTiming(1, {
          duration: ANIMATION_DURATION,
          easing: Easing.out(Easing.quad),
        }),
      );
    }
  }, [active, trigger]);

  const pieces = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => (
        <ConfettiPiece key={i} index={i} trigger={trigger} />
      )),
    [trigger],
  );

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces}
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
