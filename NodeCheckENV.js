import { execSync } from "child_process";
import fs from "fs";

// ✅ 1. Check dependencies from package.json
const requiredDeps = ["vue", "naive-ui", "vite"];
const pkg = JSON.parse(fs.readFileSync("anitracker/package.json", "utf-8"));

console.log("🔍 Checking dependencies...");
let missing = [];
requiredDeps.forEach(dep => {
  if (!pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]) {
    missing.push(dep);
  }
}); 

if (missing.length > 0) {
  console.error("❌ Missing dependencies:", missing.join(", "));
  process.exit(1);
} else {
  console.log("✅ All required dependencies are present.");
}

// ✅ 2. Test AniList API with default search
console.log("\n🔍 Testing AniList API...");

const query = `
query ($search: String) {
  Page(perPage: 1) {
    media(search: $search, type: ANIME) {
      id
      title {
        romaji
        english
      }
    }
  }
}
`;

try {
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { search: "Oregairu" } }),
  });

  const data = await response.json();

  if (data?.data?.Page?.media?.length > 0) {
    console.log("✅ AniList API OK. Found:", data.data.Page.media[0].title);
  } else {
    console.error("❌ AniList API query returned no results.");
    process.exit(1);
  }
} catch (err) {
  console.error("❌ AniList API request failed:", err.message);
  process.exit(1);
}
