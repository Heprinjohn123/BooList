import { useState } from 'react'

import './App.css'
import Greeting from './Component/Greeting'
import BookList from './Component/Booklist'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     
     <BookList />
    </>
  )
}

export default App
