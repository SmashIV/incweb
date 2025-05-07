import HomeVideoPanel from "../components/HomeVideoPanel";
import HomeInfoSlide from "../components/HomeInfoSlide";
import HomeCategoriesSlider from "../components/HomeCategoriesSlide";
import HomeSubscription from "../components/HomeSubscription";
import ProductCarrusel from "../components/sales/ProductCarrusel";

function Home() {
    return ( 
        <div>
            <HomeVideoPanel/>
            <HomeInfoSlide/>
            <HomeCategoriesSlider/> 
            <ProductCarrusel/>
            <HomeSubscription/>
        </div>
     );
}

export default Home;