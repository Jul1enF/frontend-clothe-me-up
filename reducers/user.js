import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    value:{
        cart_pants :[],
        cart_tops:[],
        pantsNotLinked:[],
        topsNotLinked:[],
    },
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        login : (state, action)=>{
            state.value=action.payload
        },
        logout: (state)=>{
            state.value = {
                cart_pants :[],
                cart_tops:[],
                pantsNotLinked:[],
                topsNotLinked:[],
            }
        },
        addCartPant : (state,action)=>{
            state.value.cart_pants.push(action.payload)
        },
        addPantNotLinked : (state, action)=>{
            state.value.pantsNotLinked.push(action.payload)
        },
        addCartTop : (state,action)=>{
            state.value.cart_tops.push(action.payload)
        },
        addTopNotLinked : (state, action)=>{
            state.value.topsNotLinked.push(action.payload)
        },
    }
})

export const {login, logout, addCartPant, addCartTop, addPantNotLinked, addTopNotLinked} = userSlice.actions
export default userSlice.reducer