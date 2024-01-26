import "./Home.css";
import Carousel from '../Components/Carousel';
import blackandwhite from '../assets/blackandwhite.png';
import orkney from '../assets/orkney.jpg';
import engagement from '../assets/engagement.jpg';
import WeddingWeekend from "../Components/WeddingWeekend";


function Intro() {
    return (
        <div className="home">
            <header className="homeHeader">
                <h1 className="homeTitleText">Kyle and Syneva</h1>
            </header>
            <Carousel
                images={[blackandwhite, orkney, engagement]}
            />
            <h4 className="date">June 7, 2025 <span className="seperator">|</span> <a target="_blank" rel="noopener noreferrer" href="https://www.hawkesdene.com/">Hawkesdene Estate, North Carolina</a></h4>
            <WeddingWeekend />
        </div>
    );
}

export default Intro;
