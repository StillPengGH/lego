<template>
  <TemplateDetail />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import Home from './views/Home.vue'
// import Editor from './views/Editor.vue'
import TemplateDetail from './views/TemplateDetail.vue'

export default defineComponent({
  name: 'App',
  components: {
    // Home,
    // Editor,
    TemplateDetail
  }
})
</script>