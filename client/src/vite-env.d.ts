/// <reference types="vite/client" />

import { JSX } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

