<template>
  <n-card>
    <img :src="media.coverImage.large" :alt="title" style="width: 100%; height: 200px; object-fit: cover;" />
    <h3>{{ title }}</h3>
    <div>
      <n-tag v-if="media.averageScore">{{ media.averageScore }}</n-tag>
      <n-tag v-if="media.format">{{ media.format }}</n-tag>
      <n-tag v-if="media.episodes">{{ media.episodes }} eps</n-tag>
    </div>
    <n-button text tag="a" :href="media.siteUrl" target="_blank">View on AniList</n-button>
  </n-card>
</template>

<script setup>
const props = defineProps({
  media: Object
})
const title = props.media.title.english || props.media.title.romaji || props.media.title.native
</script>
