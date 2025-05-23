import Home from './blocks/Home'
import './App.css'
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import FAQ from './blocks/FAQ';
import OurStory from './blocks/OurStory';
import ComingSoon from './blocks/ComingSoon';
import RSVP from './blocks/RSVP';
import { useState } from 'react';
import Registry from './blocks/Registry';
import WeddingInfo from './Components/WeddingInfo/WeddingInfo';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home />} />
          <Route path="our-story" element={<OurStory />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="rsvp" element={<RSVP />} />
          <Route path='registry' element={<Registry/>} />
          <Route path="wedding-info" element={<WeddingInfo />} />
          <Route path="nothing-here" element={<ComingSoon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function Layout() {
  const [showMenu, setShowMenu] = useState(false)
  return (
    <>
      <button className="mobileNavCTA" onClick={() => setShowMenu(!showMenu)}> 
        <span> </span>
        <span> </span>
        <span> </span>
      </button>
      <nav 
        className={`navBackground ${showMenu ? "show" : ""}`}
        onClick={() => setShowMenu(false)}
      >
        <ul className='nav'>
          <li className='navItem'>
            <Link to="/">Home</Link>
          </li>
          <li className='navItem'>
            <Link to="/wedding-info">Your Weekend</Link>
          </li>
          <li className='navItem'>
            <Link to="/our-story">Our Story</Link>
          </li>
          <li className='navItem'>
            <Link to="/registry">Registry</Link>
          </li>
          <li className='navItem'>
            <Link to="/faq">FAQ</Link>
          </li>
        </ul>
      </nav>

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </>
  );
}