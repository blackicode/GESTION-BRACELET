import { Outlet } from 'react-router-dom';
import Sidebar from '../components/slidebar/Sidebar';
import BarreMenu from "../components/SlideBar/BarreMenu";
import Footer from '../features/auth/footer';

export default function Dashboard() {
  return (
    <div className="App flex flex-col min-h-screen">
      {/* Barre de menu fixe en haut */}
      <div className="fixed top-0 left-0 w-full z-50">
        <BarreMenu />
      </div>

      <div className="flex">
        {/* Sidebar fixe à gauche */}
        <div className="fixed top-16 left-0 h-screen w-64 z-40">
          <Sidebar />
        </div>

        {/* Contenu décalé pour laisser la place au Sidebar */}
        <div className="ml-64 mt-16 w-full px-10 py-4">
          <Outlet />

        </div>

      </div>
      <div className=' flexed bottom-0  w-full px-4 py-4 '>
        <Footer />
      </div>
    </div>
  );
}