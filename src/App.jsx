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

function App() {
  const [count, setCount] = useState(0)

  return (
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
          </Routes>
        </div>
    </div>
  )
}

export default App
