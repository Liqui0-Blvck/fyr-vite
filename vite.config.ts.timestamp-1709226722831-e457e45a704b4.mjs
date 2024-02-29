// vite.config.ts
import { defineConfig } from "file:///home/nicolas/proyecto_snabbit/fyr-vite/node_modules/vite/dist/node/index.js";
import react from "file:///home/nicolas/proyecto_snabbit/fyr-vite/node_modules/@vitejs/plugin-react-swc/index.mjs";
import EnvironmentPlugin from "file:///home/nicolas/proyecto_snabbit/fyr-vite/node_modules/vite-plugin-environment/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react(), EnvironmentPlugin({})],
  assetsInclude: ["**/*.md"]
});
export {
  vite_config_default as default
};
