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
        addAddress : (state, action)=>{
            state.value.addresses.push(action.payload)
        },
        deleteAddress : (state, action)=>{
            state.value.addresses=state.value.addresses.filter(e=>e._id !== action.payload)
        },
        changeReducerFirstname : (state, action)=>{
            state.value.firstname = action.payload
        },
        changeReducerName : (state, action)=>{
            state.value.name = action.payload
        },
        changeReducerPhone : (state, action)=>{
            state.value.mobile_phone = action.payload
        },
        changeReducerPassword : (state, action)=>{
            state.value.password = action.payload
        },
    }
})

export const {login, logout, addCartArticle, addArticleNotLinked, actualiseCart, deleteCartArticle, deleteArticleNotLinked, addAddress, deleteAddress, addOrder, changeReducerFirstname, changeReducerName, changeReducerPhone, changeReducerPassword} = userSlice.actions
export default userSlice.reducer