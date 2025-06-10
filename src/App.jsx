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
import Reclamaciones from './pages/Reclamaciones'
import DetallePedido from './pages/DetallePedido'
import PoliticaSeguridad from './pages/PoliticaSeguridad'
import PoliticaEnvio from './pages/PoliticaEnvio'
import Legal from './pages/Legal'
import TerminoCondiciones from './pages/TerminoCondiciones'
import PoliticaPrivacidad from './pages/PoliticaPrivacidad'
import PageEditAccount from './pages/PageEditAccount'

// Admin Components
import Dashboard from './components/admin/Dashboard'
import Products from './components/admin/Products'
import Orders from './components/admin/Orders'
import Users from './components/admin/Users'
import Coupons from './components/admin/Coupons'
import Complaints from './components/admin/Complaints'
import AdminLayout from './components/admin/AdminLayout'

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const isEditAccountPage = location.pathname === '/edit-account';

  const hideLayout = isLoginPage || isEditAccountPage;

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <Providers>
      <div className='flex flex-col min-h-screen bg-white'>
        {!isLoginPage && !isAdminPage && <Header/>}
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
            <Route path='/Reclamaciones' element={<Reclamaciones/>}/>
            <Route path='/cart/detalle-pedido' element={<DetallePedido/>} />
            <Route path='/PoliticaSeguridad' element={<PoliticaSeguridad/>}/>
            <Route path='/PoliticaEnvio' element={<PoliticaEnvio/>}/>
            <Route path='/Legal' element={<Legal/>}/>
            <Route path='/TerminoCondiciones' element={<TerminoCondiciones/>}/>
            <Route path='/PoliticaPrivacidad' element={<PoliticaPrivacidad/>}/>
            <Route path='/edit-account' element={<PageEditAccount/>}/>
            <Route path='/admin' element={<AdminLayout><Dashboard/></AdminLayout>}/>
            <Route path='/admin/products' element={<AdminLayout><Products/></AdminLayout>}/>
            <Route path='/admin/orders' element={<AdminLayout><Orders/></AdminLayout>}/>
            <Route path='/admin/users' element={<AdminLayout><Users/></AdminLayout>}/>
            <Route path='/admin/coupons' element={<AdminLayout><Coupons/></AdminLayout>}/>
            <Route path='/admin/complaints' element={<AdminLayout><Complaints/></AdminLayout>}/>
          </Routes>
        </div>
        {!hideLayout && <Footer />}
        {!isLoginPage && <Footer/>}
        {!isLoginPage && !isAdminPage && <Footer/>}
      </div>
    </Providers>
  )
}

export default App
