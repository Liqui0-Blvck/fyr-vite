import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import EnvironmentPlugin from 'vite-plugin-environment';



// https://vitejs.dev/config/
export default defineConfig(({command, mode, isSsrBuild, isPreview}) => {
	if (command === 'serve') {
		return {
			plugins: [react(), EnvironmentPlugin(['DISABLE_ESLINT_PLUGIN', 'PORT', 'REACT_EDITOR', 'VITE_BASE_URL_DEV', 'VITE_BASE_IOT_DEV', 'VITE_BASE_IOT_PORT_DEV'])],
			assetsInclude: ['**/*.md'],
		}
	} else {
		return {
			plugins: [react(), EnvironmentPlugin(['DISABLE_ESLINT_PLUGIN', 'PORT', 'REACT_EDITOR', 'VITE_BASE_URL_PROD', 'VITE_BASE_IOT_PROD', 'VITE_BASE_IOT_PORT_PROD'])],
			assetsInclude: ['**/*.md'],
		}
	}


})


