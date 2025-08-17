const ANILIST_ENDPOINT = "https://graphql.anilist.co";

export async function fetchAniList({ page, search, format, status, signal }) {
  const query = `
    query($page:Int,$perPage:Int,$search:String,$format:[MediaFormat],$status:[MediaStatus]){
      Page(page:$page, perPage:$perPage){
        pageInfo{ total perPage currentPage lastPage hasNextPage }
        media(
          search:$search
          type: ANIME
          sort: POPULARITY_DESC
          format_in:$format
          status_in:$status
        ){
          id
          title{ romaji english native }
          episodes
          format
          status
          averageScore
          genres
          siteUrl
          coverImage{ large color }
        }
      }
    }
  `;
  const variables = { page, perPage: 12, search, format, status };
  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    signal,
  });
  return res.json();
}
