import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Carousel.css';

function Carousel({ images }: { images: any[] } ) {
    var settings = {
        adaptiveHeight: true,
        autoplay: true,
        class: 'carousel',
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      };
    return (
        <div className="carousel">
            <Slider {...settings}>
                {images.map((img: any) => (
                    <img key={img} alt={img} src={img} />
                ))}
            </Slider>
        </div>
    );
}

export default Carousel;
