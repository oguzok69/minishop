import { useNavigate } from "react-router-dom"

export default function ProductCard({ product, onAddToCart }) {
    const navigate = useNavigate();
    return (
        <div id="productCard">
            <div onClick={() => navigate(`/product/${product.id}`)} style={{cursor: "pointer"}}>
                <img src={product.thumbnail} alt={product.title}></img>
                <p>{product.title}</p>
            </div>
            <p>{product.price}$</p>
            <button id="toCart" type="button" onClick={onAddToCart}>В корзину</button>
        </div>
    )
}