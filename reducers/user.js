import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    value:{
        cart_articles :[],
        articlesNotLinked:[],
        addresses: [],
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
                cart_articles :[],
                articlesNotLinked:[],
                addresses: [],
            }
        },
        addCartArticle : (state,action)=>{
            state.value.cart_articles.push(action.payload)
        },
        deleteCartArticle : (state, action)=>{
            state.value.cart_articles=state.value.cart_articles.filter(e=>e._id!==action.payload)
        },
        addArticleNotLinked : (state, action)=>{
            state.value.articlesNotLinked.push(action.payload)
        },
        deleteArticleNotLinked : (state, action)=>{
            state.value.articlesNotLinked=state.value.articlesNotLinked.filter(e=>e!==action.payload)
        },
        actualiseCart : (state, action)=>{
            state.value.cart_articles = action.payload.cart_articles
        },
        addOrder : (state, action)=>{
            state.value.orders.push(action.payload)
        },
        addAddresse : (state, action)=>{
            state.value.addresses.push(action.payload)
        },
    }
})

export const {login, logout, addCartArticle, addArticleNotLinked, actualiseCart, deleteCartArticle, deleteArticleNotLinked, addAddresse, addOrder} = userSlice.actions
export default userSlice.reducer