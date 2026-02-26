import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { clamp } from '../lib/easing';

const BASE_STEP_MS = 620;

export interface PlaybackControls {
  index: number;
  isPlaying: boolean;
  speed: number;
  canStepBack: boolean;
  canStepForward: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  stepForward: () => void;
  stepBack: () => void;
  setSpeed: (value: number) => void;
  reset: () => void;
  seek: (nextIndex: number) => void;
}

export const usePlayback = (totalSteps: number): PlaybackControls => {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(1);

  const frameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const accumulatorRef = useRef(0);

  useEffect(() => {
    setIndex(0);
    setIsPlaying(false);
    accumulatorRef.current = 0;
    lastTimestampRef.current = null;
  }, [totalSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (totalSteps > 1) {
      setIsPlaying(true);
    }
  }, [totalSteps]);

  const toggle = useCallback(() => {
    setIsPlaying((current) => {
      if (!current && totalSteps <= 1) {
        return false;
      }
      return !current;
    });
  }, [totalSteps]);

  const stepForward = useCallback(() => {
    flushSync(() => {
      setIsPlaying(false);
      setIndex((current) => Math.min(totalSteps - 1, current + 1));
    });
  }, [totalSteps]);

  const stepBack = useCallback(() => {
    flushSync(() => {
      setIsPlaying(false);
      setIndex((current) => Math.max(0, current - 1));
    });
  }, []);

  const reset = useCallback(() => {
    flushSync(() => {
      setIsPlaying(false);
      setIndex(0);
    });
  }, []);

  const seek = useCallback(
    (nextIndex: number) => {
      flushSync(() => {
        setIsPlaying(false);
        setIndex(clamp(nextIndex, 0, Math.max(totalSteps - 1, 0)));
      });
    },
    [totalSteps],
  );

  useEffect(() => {
    if (!isPlaying || totalSteps <= 1) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    const stepMs = BASE_STEP_MS / speed;

    const tick = (timestamp: number) => {
      if (lastTimestampRef.current == null) {
        lastTimestampRef.current = timestamp;
      }

      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;
      accumulatorRef.current += delta;

      if (accumulatorRef.current >= stepMs) {
        const advance = Math.floor(accumulatorRef.current / stepMs);
        accumulatorRef.current %= stepMs;

        setIndex((current) => {
          const nextIndex = Math.min(totalSteps - 1, current + advance);
          if (nextIndex >= totalSteps - 1) {
            setIsPlaying(false);
          }
          return nextIndex;
        });
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      lastTimestampRef.current = null;
      accumulatorRef.current = 0;
    };
  }, [isPlaying, speed, totalSteps]);

  const setSpeed = useCallback((value: number) => {
    setSpeedState(clamp(value, 0.25, 4));
  }, []);

  const canStepBack = index > 0;
  const canStepForward = index < totalSteps - 1;

  return useMemo(
    () => ({
      index,
      isPlaying,
      speed,
      canStepBack,
      canStepForward,
      play,
      pause,
      toggle,
      stepForward,
      stepBack,
      setSpeed,
      reset,
      seek,
    }),
    [
      index,
      isPlaying,
      speed,
      canStepBack,
      canStepForward,
      play,
      pause,
      toggle,
      stepForward,
      stepBack,
      setSpeed,
      reset,
      seek,
    ],
  );
};
