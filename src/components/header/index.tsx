
import { useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

import { SideBar } from '../sidebar/index';

export function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {

    if(isSidebarOpen){
      document.body.classList.add('sidebar-open');
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    }else{
      document.body.classList.remove('sidebar-open')
      document.body.style.overflow = 'auto'
    }

  }, [isSidebarOpen])

  return (
    <div className="flex w-full h-12 items-center justify-between px-3 bg-brown-700">
        <h1 className="text-white font-fredoka-one">Name.coffee</h1>
        <div className='hidden md:flex gap-4 items-center justify-center'>
            <a href='#'>
                <FaWhatsapp size={25} color='white'/>
            </a>
            <a 
              href='https://www.instagram.com/felipe_castroz/'
              target='_blank'
              rel="noopener noreferrer"  
            >                
                <FaInstagram size={25} color='white'/>
            </a>
            <a href='#'>
                <FaFacebook size={25} color='white'/>
            </a>
        </div>


      <button className='md:hidden'>
        <FiMenu size={25} color='white' onClick={() => setSidebarOpen(!isSidebarOpen)} />
      </button>
      {isSidebarOpen && (
          <SideBar isClose={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
