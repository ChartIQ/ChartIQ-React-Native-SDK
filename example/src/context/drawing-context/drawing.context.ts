import React, { createContext } from 'react';

import { DrawingState } from './drawing-state.types';
import { Action } from './drawing.reducer';

// @ts-ignore
export const DrawingContext = createContext<DrawingState>(null);
// @ts-ignore
export const DrawingDispatchContext = createContext<React.Dispatch<Action>>(null);
