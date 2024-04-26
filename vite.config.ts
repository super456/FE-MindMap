import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/FE-MindMap/', // 配置打包根路径，仓库名
  build: {
    outDir: 'docs'
  }
})
