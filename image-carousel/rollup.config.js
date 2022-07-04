import { config } from "dotenv";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import replace from "@rollup/plugin-replace";

const production = !process.env.ROLLUP_WATCH;

export default {
  plugins: [
    replace({
      // stringify the object
      __myapp: JSON.stringify({
        env: {
          isProd: production,
          ...config().parsed, // attached the .env config
        },
      }),
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve("index.html"),
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
};
