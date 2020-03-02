/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';

import thunk from 'redux-thunk';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
    thunk
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const translationsObject = {
    en: {
      application: {
        title: 'Awesome app with i18n!',
        hello: 'Hello, %{name}!'
      },
      date: {
        long: 'MMMM Do, YYYY'
      },
      export: 'Export %{count} items',
      export_0: 'Nothing to export',
      export_1: 'Export %{count} item',
      two_lines: 'Line 1<br />Line 2',
      literal_two_lines: 'Line 1\
  Line 2'
    },
    nl: {
      application: {
        title: 'Toffe app met i18n!',
        hello: 'Hallo, %{name}!'
      },
      date: {
        long: 'D MMMM YYYY'
      },
      export: 'Exporteer %{count} dingen',
      export_0: 'Niks te exporteren',
      export_1: 'Exporteer %{count} ding',
      two_lines: 'Regel 1<br />Regel 2',
      literal_two_lines: 'Regel 1\
  Regel 2'
    }
  };

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
        // Prevent recomputing reducers for `replaceReducer`
        shouldHotReload: false,
      })
      : compose;
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  );

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  return store;
}
