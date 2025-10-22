import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // 指定项目根目录为 src 文件夹
    root: path.resolve(__dirname, ''),
    plugins: [react()],
    
    // 开发服务器配置
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || '/api',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
    
    // 构建配置
    build: {
      outDir: './dist',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['react-router-dom'],
          },
        },
      },
    },
    
    // 路径别名配置
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/Components'),
        '@pages': path.resolve(__dirname, 'src/Pages'),
        '@entities': path.resolve(__dirname, 'src/Entities'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@config': path.resolve(__dirname, 'src/config'),
      },
    },
    
    // CSS 配置
    css: {
      postcss: './postcss.config.js',
    },
    
    // 环境变量配置
    define: {
      'process.env': {},
      __APP_ENV__: JSON.stringify(mode),
    },
  };
});