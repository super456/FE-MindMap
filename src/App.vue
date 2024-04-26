<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { XMindEmbedViewer } from 'xmind-embed-viewer'
import SwitchControl from './components/SwitchControl.vue'
import data from '../public/xmind.json'

const viewer = ref<XMindEmbedViewer>()
const PROD = import.meta.env.PROD

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
    FE-MindMap
    <img
      v-if="PROD"
      class="visitor"
      src="https://visitor-badge.laobi.icu/badge?page_id=super456.fe-mindmap"
      onerror="this.style.display='none'"
    />
  </h1>
  <nav class="nav">
    <a href="https://github.com/super456" target="_blank" rel="noreferrer">纵倾童鞋</a>
    <a href="https://github.com/super456/FE-MindMap" target="_blank" rel="noreferrer">GitHub</a>
  </nav>
  <div id="fe-mindmap"></div>
  <SwitchControl v-if="viewer?.load" :viewer="viewer" />
</template>
