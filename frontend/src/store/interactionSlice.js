import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const logInteraction = createAsyncThunk('interactions/log', async (data) => {
    const response = await axios.post(API_URL + '/log-interaction', data);
    return response.data;
});
export const logFromChat = createAsyncThunk('interactions/logFromChat', async (message) => {
    const response = await axios.post(API_URL + '/log-interaction-from-chat', { message });
    return response.data;
});
export const fetchInteractions = createAsyncThunk('interactions/fetchAll', async () => {
    const response = await axios.get(API_URL + '/interactions');
    return response.data;
});
export const suggestFollowups = createAsyncThunk('interactions/suggest', async (id) => {
    const response = await axios.post(API_URL + '/suggest-followups/' + id);
    return response.data;
});
export const analyzeSentiment = createAsyncThunk('interactions/sentiment', async (id) => {
    const response = await axios.post(API_URL + '/analyze-sentiment/' + id);
    return response.data;
});
export const chatWithAgent = createAsyncThunk('interactions/chat', async (message) => {
    const response = await axios.post(API_URL + '/chat', { message });
    return response.data;
});

const interactionSlice = createSlice({
    name: 'interactions',
    initialState: {
        interactions: [],
        loading: false,
        error: null,
        chatResponse: null,
        lastLogged: null,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
        clearChatResponse: (state) => { state.chatResponse = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logInteraction.pending, (state) => { state.loading = true; })
            .addCase(logInteraction.fulfilled, (state, action) => { state.loading = false; state.lastLogged = action.payload; })
            .addCase(logFromChat.pending, (state) => { state.loading = true; })
            .addCase(logFromChat.fulfilled, (state, action) => { state.loading = false; state.lastLogged = action.payload; })
            .addCase(fetchInteractions.fulfilled, (state, action) => { state.interactions = action.payload.interactions || []; })
            .addCase(chatWithAgent.fulfilled, (state, action) => { state.chatResponse = action.payload.response; });
    }
});

export const { clearError, clearChatResponse } = interactionSlice.actions;
export default interactionSlice.reducer;