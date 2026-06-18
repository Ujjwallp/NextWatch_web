const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

const getToken = () => {
  return import.meta.env.VITE_TMDB_TOKEN || "";
};

const fetchTMDB = async (endpoint, params = {}) => {
  const token = getToken();
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value);
    }
  });

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    throw new Error(
      `TMDB API Error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
};


export const getImageUrl = (path, size = "w500") => {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path, size = "w1280") => {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
};




export const getTrending = async (
  mediaType = "all",
  timeWindow = "day",
  page = 1,
) => {
  return fetchTMDB(`/trending/${mediaType}/${timeWindow}`, { page });
};

export const getPopularByGenre = async (
  genreId,
  mediaType = "movie",
  page = 1,
) => {
  return fetchTMDB(`/discover/${mediaType}`, {
    with_genres: genreId,
    sort_by: "popularity.desc",
    page,
    "vote_count.gte": 100,
  });
};

export const getTopRatedByGenre = async (
  genreId,
  mediaType = "movie",
  page = 1,
) => {
  return fetchTMDB(`/discover/${mediaType}`, {
    with_genres: genreId,
    sort_by: "vote_average.desc",
    page,
    "vote_count.gte": 200,
  });
};

export const getPopularMovies = async (page = 1) => {
  return fetchTMDB("/movie/popular", { page });
};



export const getMovieDetails = async (movieId, mediaType = "movie") => {
  return fetchTMDB(`/${mediaType}/${movieId}`, {
    append_to_response:
      "credits,videos,watch/providers,recommendations,similar",
  });
};



export const getWatchProviders = async (movieId, mediaType = "movie") => {
  return fetchTMDB(`/${mediaType}/${movieId}/watch/providers`);
};

export const searchContent = async (query, page = 1) => {
  return fetchTMDB("/search/multi", {
    query,
    page,
    include_adult: false,
  });
};

export const searchMovies = async (query, page = 1) => {
  return fetchTMDB("/search/movie", {
    query,
    page,
    include_adult: false,
  });
};

export const searchTV = async (query, page = 1) => {
  return fetchTMDB("/search/tv", {
    query,
    page,
    include_adult: false,
  });
};




export const getYear = (dateStr) => {
  if (!dateStr) return "N/A";
  return dateStr.split("-")[0];
};


export const formatRating = (rating) => {
  if (!rating) return "N/A";
  return rating.toFixed(1);
};


export const formatRuntime = (minutes) => {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};


