import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    value:[],
}

export const pantsSlice = createSlice({
    name:'pants',
    initialState,
    reducers: {
        addPants : (state, action)=>{
            state.value = action.payload
        },
    }
})

export const {addPants} = pantsSlice.actions
export default pantsSlice.reducer