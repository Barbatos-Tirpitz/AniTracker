<script setup>
import { ref, onMounted } from "vue";
import {
  NCard,
  NGrid,
  NGridItem,
  NImage,
  NSpin,
  NInput,
  NButton,
  NTag
} from "naive-ui";

const loading = ref(false);
const animeList = ref([]);
const searchQuery = ref("Naruto"); // default search value

async function searchAnime(queryText = searchQuery.value) {
  loading.value = true;
  animeList.value = [];

  const query = `
    query ($search: String) {
      Page(perPage: 6) {
        media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
          }
          description(asHtml: false)
          episodes
          averageScore
          format
          status
          coverImage {
            large
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { search: queryText } }),
    });

    const data = await res.json();
    console.log("AniList API response:", data);

    animeList.value = data?.data?.Page?.media || [];
  } catch (err) {
    console.error("API Error:", err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  searchAnime(); // default search on page load
});
</script>

<template>
  <div style="padding: 20px;">
    <h2>AniTracker</h2>

    <!-- 🔍 Search Bar -->
    <div style="margin-bottom: 20px; display: flex; gap: 10px;">
      <n-input
        v-model:value="searchQuery"
        placeholder="Search for an anime..."
        clearable
        @keyup.enter="searchAnime(searchQuery)"
      />
      <n-button type="primary" @click="searchAnime(searchQuery)">
        Search
      </n-button>
    </div>

    <!-- Loader -->
    <div v-if="loading">
      <n-spin size="large" />
    </div>

    <!-- Anime Grid -->
    <n-grid v-else :cols="3" :x-gap="20" :y-gap="20">
      <n-grid-item v-for="anime in animeList" :key="anime.id">
        <n-card :title="anime.title.english || anime.title.romaji">
          <n-image
            :src="anime.coverImage.large"
            width="100%"
            height="300"
            object-fit="cover"
          />

          <!-- Metadata -->
          <div style="margin-top: 10px;">
            <n-tag type="info" style="margin-right: 5px;">{{ anime.format }}</n-tag>
            <n-tag type="success" style="margin-right: 5px;">{{ anime.status }}</n-tag>
            <n-tag type="warning">⭐ {{ anime.averageScore ?? "N/A" }}</n-tag>
          </div>

          <p><strong>Episodes:</strong> {{ anime.episodes ?? "?" }}</p>

          <!-- Summary -->
          <p style="font-size: 0.9em; color: gray; max-height: 100px; overflow: hidden;">
            {{ anime.description?.replace(/<[^>]*>/g, '') || "No description available." }}
          </p>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- No Results -->
    <div v-if="!loading && animeList.length === 0">
      <p>No results found.</p>
    </div>
  </div>
</template>
