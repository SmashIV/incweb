import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import {Routes, Route, useLocation} from 'react-router-dom'
import  Home  from './pages/Home'
import  AccesoriosSales  from './pages/AccesoriosSales'
import  HombreSales  from './pages/HombreSales'
import  MujerSales  from './pages/MujerSales'
import  BusinessInfo  from './pages/BusinessInfo'
import  HogarSales  from './pages/HogarSales'
import Footer from './components/Footer'
import ItemDetail from './pages/ItemDetail'
import { Providers } from './components/context/Providers'
import Login from './components/user/Login'
import CartPage from './pages/CartPage'
import SearchResults from './pages/SearchResults'
<<<<<<< HEAD
import Reclamaciones from './pages/Reclamaciones'

=======
import DetallePedido from './pages/DetallePedido'
>>>>>>> b61548c91d7be59241596686a2d27c5371a93b51
function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <Providers>
      <div className='flex flex-col min-h-screen bg-white'>
        {!isLoginPage && <Header/>}
        <div id='main-content' className={isLoginPage ? '' : 'flex-grow'}>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/hombre-sales' element={<HombreSales/>}/>
            <Route path='/mujer-sales' element={<MujerSales/>}/>
            <Route path='/accesorios-sales' element={<AccesoriosSales/>}/>
            <Route path='/hogar-sales' element={<HogarSales/>}/>
            <Route path='/info-incalpaca' element={<BusinessInfo/>}/>
            <Route path='/item-detail/:id' element={<ItemDetail/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/cart' element={<CartPage/>}/>
            <Route path="/search" element={<SearchResults />} />
<<<<<<< HEAD
            <Route path='/Reclamaciones' element ={<Reclamaciones/>}/>
=======
            <Route path='/cart/detalle-pedido' element={<DetallePedido/>} />
>>>>>>> b61548c91d7be59241596686a2d27c5371a93b51
          </Routes>
        </div>
        {!isLoginPage && <Footer/>}
      </div>
    </Providers>
  )
}

export default App
