import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { ElementPlusResolve, createStyleImportPlugin } from 'vite-plugin-style-import'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          '@vueuse/head',
          '@vueuse/core',
        ],
        resolvers: [ElementPlusResolver()],
        dts: 'src/auto-imports.d.ts',
        vueTemplate: true,
        dirs: [
          'src/utils',
          'src/store',
        ],
        eslintrc: {
          enabled: true,
        }
      }),
      Components({
        dirs: ['src/packages'],
        resolvers: [ElementPlusResolver()],
      }),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [
          {
            libraryName: 'element-plus',
            esModule: true,
            resolveStyle: (name: string) => {
              return `element-plus/theme-chalk/${name}.css`
            },
          },
          {
            libraryName: 'vxe-table',
            esModule: true,
          }
        ]
      }),
      dts({
        // entryRoot: 'src/packages/index.ts',
        outDir: 'dist'
      })
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src')
        },
      ]
    },
    build: env.VITE_ENV === 'lib' ? {
      target: 'modules',
      rollupOptions: {
        external: ['vue'],
      },
      lib: {
        entry: resolve(__dirname, 'src/packages/index.ts'),
        name: 'img-viewer',
        fileName: 'img-viewer',
        formats: ['es', 'cjs']
      }
    } : undefined
  }
})
