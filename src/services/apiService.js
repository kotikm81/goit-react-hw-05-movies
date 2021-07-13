import axios from 'axios';

import defaultImage from 'images/default.jpg';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '3bb7c750e6d9b2ae7509ab17b85a7611';

axios.defaults.baseURL = BASE_URL;

export const fetchTrendingMovies = async page => {
  const response = await axios.get(
    // `/trending/all/day?api_key=${API_KEY}&page=${page}`,
    `/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`,
  );
  const trendinMoviesData = await response.data;
  // const trendinMovies = await trendinMoviesData.results;
  // const normalizedMovies = await fetchNormalizer(trendinMovies);
  // this.totalPages = popularMoviesData.total_pages;
  // return normalizedMovies;
  return trendinMoviesData;
};

export const fetchMoviesSearchQuery = async (searchQuery, page) => {
  const response = await axios.get(
    // `/search/movie?api_key=${API_KEY}&language=en&query='${searchQuery}'`,
    `/search/movie?api_key=${API_KEY}&page=${page}&language=en&query='${searchQuery}'`,
  );
  const popularMoviesData = await response.data;
  // const popularMovies = await popularMoviesData.results;
  // const normalizedMovies = await fetchNormalizer(popularMovies);
  // this.totalPages = popularMoviesData.total_pages;
  return popularMoviesData;
};

export const fetchMovieDetails = async id => {
  const response = await axios.get(
    `movie/${id}?api_key=${API_KEY}&language=en-US`,
  );
  const movieDetails = await response.data;
  const poster_path = movieDetails.poster_path
    ? 'https://image.tmdb.org/t/p/w500' + movieDetails.poster_path
    : defaultImage;
  movieDetails.poster_path = poster_path;
  return movieDetails;
};

export const fetchMovieCredits = async id => {
  const response = await axios.get(
    `movie/${id}/credits?api_key=${API_KEY}&language=en-US`,
  );
  const modalMovie = await response.data;
  return modalMovie;
};

export const fetchMovieReviews = async id => {
  const response = await axios.get(
    `movie/${id}/reviews?api_key=${API_KEY}&language=en-US`,
  );
  const modalMovie = await response.data;
  return modalMovie;
};

export const fetchNormalizer = async fetchedData => {
  const moviesArr = await fetchedData;
  const genresArr = await fetchGenres();

  const updateMovie = movie => {
    const MAX_GENRE_LENGTH = 20;
    let genresLength = 0;
    const genres = movie.genre_ids
      .map(genreId => {
        return genresArr[genreId] || '';
      })
      .filter(
        genreName => (genresLength += genreName.length) <= MAX_GENRE_LENGTH,
      );

    if (genresLength > MAX_GENRE_LENGTH) genres.push('others...');

    // title
    let title = movie.title || movie.name;
    if (title.length > 40) {
      title = movie.title.slice(0, 37) + '...';
    }

    const release_date = movie.release_date
      ? movie.release_date.split('-')[0]
      : 'NA';

    const poster_path = movie.poster_path
      ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
      : defaultImage;
    const movieUpdate = { ...movie, title, genres, release_date, poster_path };
    return movieUpdate;
  };

  const updatedMoviesarr = moviesArr.map(updateMovie);
  return updatedMoviesarr;
};

const fetchGenres = async () => {
  try {
    const response = await axios.get(
      `/genre/movie/list?api_key=${API_KEY}&language=en-US`,
    );
    const genres = {};
    response.data.genres.forEach(({ id, name }) => {
      // преобразовать в объект вида {ganreId:genreName}
      genres[id] = name;
    });
    return genres;
  } catch (error) {
    console.error(error);
  }
};