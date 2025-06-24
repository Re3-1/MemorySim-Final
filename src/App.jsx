import { useState } from 'react'


import './App.css'
import { Routes,Route } from 'react-router-dom'
import {ContMem} from "./pages/ContMem.jsx"
import { SelectMem } from './pages/SelectMem.jsx'

import { ContNonMem } from './pages/ContNonMem.jsx'
import { LToP } from './pages/LToP.jsx'
import PageReplacementSimulator from './pages/PageReplace.jsx'
import { FixedPartitionMemorySim } from './pages/FixedPartitionMem.jsx'
import { DynamicPartitionMemorySim } from './pages/DynamicPartitionMem.jsx'
function App() {
  

  return (
    <Routes>
      <Route path='/contMem' element={<ContMem></ContMem>} ></Route>
      <Route path='/' element={<SelectMem></SelectMem>}></Route>
      <Route path='/contNonMem' element={<ContNonMem></ContNonMem>}></Route>


      
      <Route path='/lToP' element={<LToP></LToP>}></Route>
        <Route path='/pageReplace' element={<PageReplacementSimulator></PageReplacementSimulator>}></Route> 


        <Route path='/fixedPar' element={<FixedPartitionMemorySim></FixedPartitionMemorySim>}></Route>
        <Route path='/dynPar' element={<DynamicPartitionMemorySim></DynamicPartitionMemorySim>}></Route>
    </Routes>
  )
}

export default App
