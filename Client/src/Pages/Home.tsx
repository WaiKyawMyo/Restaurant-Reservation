import Bander from "../components/Home/Bander"
import { StickyScrollRevealDemo } from "../components/Home/Menu"
import Photo from "../components/Home/photo"
import Reservation from "../components/Home/Reservation"



function Home() {
  return (
    <div className="z-30">
        <Bander/>
        <Photo/>
        <StickyScrollRevealDemo/>
        <Reservation/>
    </div>
  )
}

export default Home