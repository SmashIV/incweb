import ProductDetail from "../components/sales/ProductDetail";
import ProductBanner from "../components/sales/ProductBanner";
import ProductCarrusel from "../components/sales/ProductCarrusel";
function ItemDetail() {
    return ( 
        <div>
            <ProductDetail/>
            <ProductBanner/>
            <ProductCarrusel/>
        </div>
    );
}

export default ItemDetail;