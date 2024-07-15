// pages/_app.tsx
import * as React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import createEmotionCache from '@/createEmotionCache';
import theme from '@/theme';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp: React.FC<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta charSet='UTF-8' />
        <meta name='description' content='ImageXpert is a platform where you can draw and save your drawings' />
        <meta name='author' content='Md Tanvir Alam or Dev view' />
        <meta name='robots' content="index, follow" />
        <meta property='og:title' content="ImageXpert Drawing" />
        <meta property='og:description' content='ImageXpert is a platform where you can draw and save your drawings' />
        <meta property='og:image' content='/logo.png' />
        <meta property='og:url' content='https://imagexpert.vercel.app/' />
        <meta property='og:site_name' content='ImageXpert' />
        <meta property='og:type' content='website' />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@dev_view' />
        <meta name='twitter:creator' content='@dev_view' />
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/logo.png' />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
