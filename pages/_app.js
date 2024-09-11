import '../styles/globals.css';
import Head from 'next/head';
import { StyleProvider } from '@ant-design/cssinjs'

import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';

import user from '../reducers/user';
import articles from '../reducers/articles'

const reducers = combineReducers({ user, articles });
const persistConfig = { key: 'clothe-me-up', storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
})

const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <StyleProvider layer>
            <Head>
              <title>Clothe Me Up</title>
            </Head>
            <Component {...pageProps} />
          </StyleProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
