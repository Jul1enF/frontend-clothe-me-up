import '../styles/globals.css';
import Head from 'next/head';
import { StyleProvider } from '@ant-design/cssinjs'

import {Provider} from 'react-redux'
import { configureStore } from '@reduxjs/toolkit';
import user from '../reducers/user';

const store = configureStore({
  reducer :{user},
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ serializableCheck: false })
})

function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
      <StyleProvider layer>
      <Head>
        <title>Clothe Me Up</title>
      </Head>
      <Component {...pageProps} />
      </StyleProvider>
      </Provider>
    </>
  );
}

export default App;
