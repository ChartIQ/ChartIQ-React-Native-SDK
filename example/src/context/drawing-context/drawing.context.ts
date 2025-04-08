import React, { createContext } from 'react';

import { DrawingState } from './drawing-state.types';
import { Action, drawingInitialState } from './drawing.reducer';

export const DrawingContext = createContext<DrawingState>(drawingInitialState);
export const DrawingDispatchContext = createContext<React.Dispatch<Action>>(() => {});
