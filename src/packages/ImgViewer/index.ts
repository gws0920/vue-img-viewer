import type { App } from 'vue'
import ImgViewer from './index.vue'

ImgViewer.install = (app: App) => {
  app.component('img-viewer', ImgViewer)
}

export {
  ImgViewer
}
