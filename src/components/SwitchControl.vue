<script setup lang="ts">
import { XMindEmbedViewer } from 'xmind-embed-viewer'
import DropdownMenu from './DropdownMenu.vue'

const props = defineProps<{ viewer: XMindEmbedViewer }>()
const emit = defineEmits<{
  (e: 'change', fileName: string): void
}>()

const selectFileFromLocal = async (accept: string) => {
  const fileSelector = document.createElement('input')
  fileSelector.style.display = 'none'
  document.body.appendChild(fileSelector)
  await new Promise<void>((resolve) => {
    fileSelector.setAttribute('type', 'file')
    fileSelector.setAttribute('accept', accept)
    fileSelector.addEventListener('change', () => {
      resolve()
    })
    fileSelector.click()
  }).finally(() => {
    document.body.removeChild(fileSelector)
  })
  if (!fileSelector.files || !fileSelector.files.length) {
    return
  }
  return fileSelector.files[0]
}

const handleLoadFile = (filePath: string, fileName: string) => {
  fetch(filePath).then(async (res) => {
    emit('change', fileName)
    props.viewer.load(await res.arrayBuffer())
  })
}

const handleOpenLocalFile = async () => {
  const file = await selectFileFromLocal('.xmind')
  if (!file) return
  props.viewer.load(await file.arrayBuffer())
}
</script>

<template>
  <div class="control">
    <DropdownMenu @click="handleLoadFile" />
    <span style="margin: 0 10px;">|</span>
    <button class="btn" @click="handleOpenLocalFile">
      <svg t="1714123135555" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4528" width="16" height="16" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M796.59008 298.14784v-20.0704c0-61.93152-51.24096-113.62304-112.55808-113.62304H391.168l-2.37568-3.80928-26.09152-38.0928c-18.6368-27.4432-55.37792-47.26784-84.25472-47.26784H104.448c-28.672 0-52.10112 19.82464-52.10112 47.26784v632.91392l95.4368-350.37184c15.9744-58.368 88.22784-106.9056 158.9248-106.9056h489.8816v-0.04096zM339.968 342.71232c-63.0784 0-127.3856 40.96-141.63968 90.23488L77.08672 854.17984c-14.21312 49.23392 26.50112 90.23488 89.53856 90.23488h539.32032c63.0784 0 127.3856-41.00096 141.63968-90.23488l121.2416-421.19168c14.21312-49.27488-26.50112-90.23488-89.53856-90.23488H339.968z m106.33216 411.648v-144.1792h-57.344c-24.69888-13.88544 8.11008-38.37952 8.11008-38.37952s106.57792-89.12896 120.4224-94.69952c21.83168-16.05632 31.45728 0 31.45728 0s123.24864 91.3408 135.04512 106.496c5.7344 24.33024-2.37568 26.58304-2.37568 26.58304h-60.2112v146.14528c0 18.75968-16.22016 32.11264-35.51232 32.11264h-106.78272c-19.2512 0-32.768-15.64672-32.768-34.07872z" fill="#8a8a8a" p-id="4529"></path></svg>
      打开本地文件
    </button>
  </div>
</template>

<style lang="scss">
.control {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 14px;
  left: 14px;
  border-radius: 8px;
  padding: 6px 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  background: #fff;
  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 4px;
    border: 0;
    padding: 4px;
    height: 32px;
    font-size: 14px;
    font-weight: 600;
    color: #000;
    background-color: transparent;
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    &-icon {
      margin-left: 4px;
    }
  }
}
</style>
