import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    value:[],
}

export const topsSlice = createSlice({
    name:'tops',
    initialState,
    reducers: {
        addTops : (state, action)=>{
            state.value = action.payload
        },
    }
})

export const {addTops} = topsSlice.actions
export default topsSlice.reducer