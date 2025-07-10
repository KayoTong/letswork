import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSlideshow from './components/HeroSlideshow';
import Footer from './components/Footer';
import Finder from './components/Finder';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#f7f7f7]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HeroSlideshow />} />
            <Route path="/finder" element={<Finder />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;