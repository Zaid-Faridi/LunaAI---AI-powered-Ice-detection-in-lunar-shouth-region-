import { useReducer, useEffect, useCallback } from 'react';

const STAGE_PROGRESS = [5, 30, 60, 85, 100];

function pipelineReducer(state, action) {
  switch (action.type) {
    case 'START':
      return {
        status: 'running',
        stageIndex: 0,
        progress: STAGE_PROGRESS[0],
      };
    case 'ADVANCE_STAGE': {
      const nextIndex = Math.min(action.nextIndex, 4);
      return {
        status: nextIndex === 4 ? 'done' : 'running',
        stageIndex: nextIndex,
        progress: STAGE_PROGRESS[nextIndex],
      };
    }
    case 'RESET':
      return {
        status: 'idle',
        stageIndex: 0,
        progress: 0,
      };
    default:
      return state;
  }
}

/**
 * usePipeline Hook
 * Manages the multi-stage ice detection radar polarimetry pipeline.
 * Cleanly handles stage progression, timer cleanup on unmount, and persistent tab-switching state.
 *
 * @param {boolean} initialCompleted - Default true so canonical data displays on initial load
 * @returns {{
 *   status: 'idle' | 'running' | 'done',
 *   stageIndex: number,
 *   progress: number,
 *   isRunning: boolean,
 *   isDone: boolean,
 *   isIdle: boolean,
 *   start: () => void,
 *   reset: () => void
 * }}
 */
export function usePipeline(initialCompleted = true) {
  const [state, dispatch] = useReducer(pipelineReducer, {
    status: initialCompleted ? 'done' : 'idle',
    stageIndex: initialCompleted ? 4 : 0,
    progress: initialCompleted ? 100 : 0,
  });

  const stageDurationMs = 600;

  useEffect(() => {
    if (state.status !== 'running') return;

    const timer = setTimeout(() => {
      dispatch({ type: 'ADVANCE_STAGE', nextIndex: state.stageIndex + 1 });
    }, stageDurationMs);

    return () => clearTimeout(timer);
  }, [state.status, state.stageIndex]);

  const start = useCallback(() => {
    dispatch({ type: 'START' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    status: state.status,
    stageIndex: state.stageIndex,
    progress: state.progress,
    isRunning: state.status === 'running',
    isDone: state.status === 'done',
    isIdle: state.status === 'idle',
    start,
    reset,
  };
}
