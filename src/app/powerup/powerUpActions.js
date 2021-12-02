import { createRoutine } from 'redux-saga-routines';

export const getPowerUpData = createRoutine('powerUp/GET_POWER_UP_DATA');
export const getPowerUpDisplayData = createRoutine('powerUp/GET_POWER_UP_DISPLAY_DATA');
export const getPowerUpHelperData = createRoutine('powerUp/GET_POWER_UP_OPTIONS_DATA');
export const savePowerUpData = createRoutine('powerUp/SAVE_POWER_UP_DATA');
