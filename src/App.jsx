import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import {Routes, Route} from 'react-router-dom'
import  Home  from './pages/Home'
import  AccesoriosSales  from './pages/AccesoriosSales'
import  HombreSales  from './pages/HombreSales'
import  MujerSales  from './pages/MujerSales'
import  BusinessInfo  from './pages/BusinessInfo'
import  HogarSales  from './pages/HogarSales'
import Footer from './components/Footer'
import ItemDetail from './pages/ItemDetail'
import { ModalProvider } from './components/context/ModalContext'
import Login from './components/user/Login'

function App() {

  return (
    <ModalProvider>
        <div className='flex flex-col min-h-screen bg-white'>
            <Header/>
            <div id='main-content'>
              <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/hombre-sales' element={<HombreSales/>}/>
              <Route path='/mujer-sales' element={<MujerSales/>}/>
              <Route path='/accesorios-sales' element={<AccesoriosSales/>}/>
              <Route path='/hogar-sales' element={<HogarSales/>}/>
              <Route path='/info-incalpaca' element={<BusinessInfo/>}/>
              <Route path='/item-detail/:id' element={<ItemDetail/>}/>
              <Route path='/login' element={<Login/>}/>
            </Routes>
          </div>
          <Footer/>
      </div>
    </ModalProvider>
  )
}

export default App
