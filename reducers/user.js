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
        deleteCartPant : (state, action)=>{
            state.value.cart_pants=state.value.cart_pants.filter(e=>e._id!==action.payload)
        },
        addPantNotLinked : (state, action)=>{
            state.value.pantsNotLinked.push(action.payload)
        },
        deletePantNotLinked : (state, action)=>{
            state.value.pantsNotLinked=state.value.pantsNotLinked.filter(e=>e!==action.payload)
        },
        addCartTop : (state,action)=>{
            state.value.cart_tops.push(action.payload)
        },
        deleteCartTop : (state, action)=>{
            state.value.cart_tops=state.value.cart_tops.filter(e=>e._id!==action.payload)
        },
        addTopNotLinked : (state, action)=>{
            state.value.topsNotLinked.push(action.payload)
        },
        deleteTopNotLinked : (state, action)=>{
            state.value.topsNotLinked=state.value.topsNotLinked.filter(e=>e!==action.payload)
        },
        actualiseCart : (state, action)=>{
            state.value.cart_pants = action.payload.cart_pants
            state.value.cart_tops = action.payload.cart_tops
        },
        addAddresse : (state, action)=>{
            state.value.addresses.push(action.payload)
        },
    }
})

export const {login, logout, addCartPant, addCartTop, addPantNotLinked, addTopNotLinked, actualiseCart, deleteCartPant, deleteCartTop, deletePantNotLinked, deleteTopNotLinked, addAddresse} = userSlice.actions
export default userSlice.reducer