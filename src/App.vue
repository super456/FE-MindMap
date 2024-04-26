<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { XMindEmbedViewer } from 'xmind-embed-viewer'
import SwitchControl from './components/SwitchControl.vue'
import data from '../public/xmind.json'

const viewer = ref<XMindEmbedViewer>()
const PROD = import.meta.env.PROD
const fileName = ref(data[0].name)

const githubIcon = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`

const switchViewer = (name: string) => {
  fileName.value = name
}

onMounted(async () => {
  const res = await fetch(data[0].path)
  const instance = new XMindEmbedViewer({
    el: '#fe-mindmap',
    file: await res.arrayBuffer(),
    styles: {
      width: '100vw',
      height: '100vh'
    }
  })

  instance.addEventListener('map-ready', () => {
    instance.setZoomScale(50)
    // instance.setFitMap()
  })

  viewer.value = instance
})
</script>

<template>
  <h1 class="title">
    前端知识图谱 - {{ fileName }}
  </h1>
  <nav class="nav">
    <img
      v-if="PROD"
      class="visitor"
      src="https://visitor-badge.laobi.icu/badge?page_id=super456.fe-mindmap"
      onerror="this.style.display='none'"
    />
    <a href="https://github.com/super456" target="_blank" rel="noreferrer">
      <div class="link">
        <img
          src="./../public/favicon.ico"
          mode="scaleToFill"
          class="icon"
        />
        纵倾童鞋
      </div>
    </a>
    <a href="https://github.com/super456/FE-MindMap" target="_blank" rel="noreferrer">
      <div class="link">
        <div v-html="githubIcon" class="icon" />
        GitHub
      </div>
    </a>
  </nav>
  <div id="fe-mindmap"></div>
  <SwitchControl v-if="viewer?.load" :viewer="viewer" @change="switchViewer" />
</template>
<style scoped>
.link {
  display: flex;
  align-items: center;
}

.icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
}
</style>
