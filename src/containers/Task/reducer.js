import {
  TASK_PRESETS_LOAD_SUCCESS,
  TASK_LOAD_SUCCESS,
  TASK_RUN_SUCCESS,
  TASK_RUN_REQUEST
} from "./actions";

export const task = (
  state = {
    presets: [],
    currentTask: false,
    currentResponse: false,
    isRunning: false
  },
  action
) => {
  switch (action.type) {
    case TASK_PRESETS_LOAD_SUCCESS:
      return { ...state, presets: action.presets };
    case TASK_LOAD_SUCCESS:
      return { ...state, currentTask: action.taskInfo };
    case TASK_RUN_REQUEST:
      return {
        ...state,
        isRunning: true
      };
    case TASK_RUN_SUCCESS:
      return {
        ...state,
        isRunning: false,
        currentResponse: action.response
      };
    default:
      return state;
  }
};
