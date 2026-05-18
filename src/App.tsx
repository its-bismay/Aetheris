import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Playground from './pages/Playground';
import DiffView from './pages/DiffView';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
        <Navbar />
        
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/diff-view" element={<DiffView />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;