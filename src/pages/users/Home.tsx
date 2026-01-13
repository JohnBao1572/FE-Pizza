import Header from "../../components/user/header";
import Footer from "../../components/user/Footer";
import CarouselBanner from "../../components/user/CarouselBanner";
import CategorySection from "../../components/user/CategorySection";
import ComboSection from "../../components/user/ComboSection";
import PizzaSection from "../../components/user/PizzaSection";

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow pt-24 pb-10">
                <div className="container mx-auto px-4 space-y-8">
                    <CarouselBanner />
                    <CategorySection />
                    <ComboSection />
                    <PizzaSection />
                </div>
            </main>
            <Footer />
        </div>
    )
}
export default Home;