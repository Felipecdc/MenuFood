
import { FiArrowLeft } from 'react-icons/fi'
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa'

interface SideBarProps {
  isClose: () => void;
}

export function SideBar({ isClose }: SideBarProps) {
  return (
    <div
      className="absolute top-0 right-0 w-screen h-screen md:hidden z-50"
    >
        <div className='flex w-screen h-screen'>
            <button
                onClick={isClose}
                className='w-full bg-black opacity-25'>
            </button>
            <div className='w-full p-2 bg-white'>
                <div className='flex w-full h-10 items-center mb-5'>
                    <button onClick={isClose}>
                        <FiArrowLeft size={25}/>
                    </button>
                </div>
                <a href='#' className='flex gap-2 mb-5'>
                    <FaWhatsapp size={25} color='black'/>
                    <h3>19 989475899</h3>
                </a>
                <a href='#' className='flex gap-2 mb-5'>
                    <FaInstagram size={25} color='black'/>
                    <h3>@name.official</h3>
                </a>
                <a href='#' className='flex gap-2 mb-5'>
                    <FaFacebook size={25} color='black'/>
                    <h3>name.official</h3>
                </a>
                <a 
                    href='https://www.instagram.com/felipe_castroz/'
                    target='_blank'
                    rel="noopener noreferrer"
                    className='fixed bottom-3 text-sm text-blue-900 border-b border-blue-900'
                >
                    Criado por Felipe Castro
                </a>
            </div>
        </div>
    </div>
  );
}
