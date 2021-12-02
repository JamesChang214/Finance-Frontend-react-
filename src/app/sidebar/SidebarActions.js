import { createRoutine } from 'redux-saga-routines';

// creating routine
export const openSidebar = createRoutine('sidebar/OPEN');
export const closeSidebar = createRoutine('sidebar/CLOSE');
export const toggleSidebar = createRoutine('sidebar/TOGGLE');
