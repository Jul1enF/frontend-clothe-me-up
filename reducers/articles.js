import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    value:[],
}

export const articlesSlice = createSlice({
    name:'articles',
    initialState,
    reducers: {
        addArticles : (state, action)=>{
            state.value = action.payload
        },
    }
})

export const {addArticles} = articlesSlice.actions
export default articlesSlice.reducer