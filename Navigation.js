// RootNavigation.js

import * as React from 'react';
import { StackActions } from '@react-navigation/native';

export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current.navigate(name, params);
}

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}

export function replace(...args) {
  navigationRef.current?.dispatch(StackActions.replace(...args));
}
export function pop(...args) {
  navigationRef.current?.dispatch(StackActions.pop(...args));
}
export function popToTop(...args) {
  navigationRef.current?.dispatch(StackActions.popToTop(...args));
}
export function reset(name, params) {
  navigationRef.current?.dispatch(navigationRef.current?.reset({
    index: 0,
    actions: [
      navigationRef.current?.navigate(name, params)
    ]
  }));
}



// add other navigation functions that you need and export them