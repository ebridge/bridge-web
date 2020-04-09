import React, { Component } from 'react';
import { createStore } from 'redux';
// create a simple reducer
const reducer = (state = { foo: '' }, action) => {
  switch (action.type) {
  case 'FOO':
    return { ...state, foo: action.payload };
  default:
    return state;
  }
};
// create a store creator
const makeStore = (initialState) => createStore(reducer, initialState);
export default makeStore;
