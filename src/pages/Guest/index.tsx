import { Outlet } from 'react-router-dom'
import Header from '../../components/Guest/Header'
import Footer from '../../components/Guest/Footer'

function Guest() {
    return (
        <div>
            <Header />
            <div className='flex flex-col justify-between min-h-screen max-w-screen pb-10 md:pb-20 bg-white text-gray-700'>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Guest