import { Carousel } from "antd";

const CarouselBanner = () => {
    return (
        <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg relative z-0">
            <Carousel autoplay>
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
                        className="w-full h-64 object-cover"
                        alt="banner1"
                    />
                </div>
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=80"
                        className="w-full h-64 object-cover"
                        alt="banner2"
                    />
                </div>
            </Carousel>
        </div>
    );
};

export default CarouselBanner;
