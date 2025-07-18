import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { NewsItem } from '../types/news.types';

interface NewsState {
  items: NewsItem[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  initialLoaded: boolean; // ✅ добавляем
}

const initialState: NewsState = {
  items: [],
  loading: false,
  hasMore: true,
  page: 0,
  initialLoaded: false,
};


export const fetchNews = createAsyncThunk(
  'news/fetch',
  async (page: number) => {
    const limit = 10;
    const skip = page * limit;
    const res = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
    const data = await res.json();
    return data.posts as NewsItem[];
  }
);

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.items.push(...action.payload);
        state.loading = false;
        state.page += 1;
        state.initialLoaded = true;
        if (action.payload.length === 0) {
          state.hasMore = false;
        }
      })
  },
});

export default newsSlice.reducer;
