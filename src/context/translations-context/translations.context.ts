import React, { createContext } from 'react';

import { TranslationsState } from './translations-state-types';
import { Action } from './translations.reducer';

// @ts-ignore
export const TranslationsContext = createContext<TranslationsState>(null);
// @ts-ignore
export const TranslationsDispatchContext = createContext<React.Dispatch<Action>>(null);
