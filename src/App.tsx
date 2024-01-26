import Home from './blocks/Home'
import './App.css'
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function Layout() {
  return (
    <>
      <nav>
        <ul className='nav'>
          <li className='navItem'>
            <Link to="/">Home</Link>
          </li>
          <li className='navItem'>
            <Link to="/about">Our Story</Link>
          </li>
           {/* <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/nothing-here">Nothing Here</Link>
          </li> */}
        </ul>
      </nav>

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </>
  );
}