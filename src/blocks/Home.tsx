import "./Home.css";
import Carousel from '../Components/Carousel';
import blackandwhite from '../assets/blackandwhite.png';
import orkney from '../assets/orkney.jpg';
import WeddingWeekend from "../Components/WeddingWeekend";
import saveTheDate from "../assets/saveTheDate.png";


function Intro() {
    return (
        <div className="home">
            <header className="homeHeader">
                <h1 className="homeTitleText">Kyle and Syneva</h1>
            </header>
            <Carousel
                images={[blackandwhite, orkney, saveTheDate]}
            />
            <h4 className="date"><span className="theDate">June 7, 2025</span> <span className="seperator">|</span> 
            <a target="_blank" rel="noopener noreferrer" href="https://www.hawkesdene.com/">Hawkesdene Estate, North Carolina</a></h4>
            <WeddingWeekend />
        </div>
    );
}

export default Intro;
