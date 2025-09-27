import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { fetchProductsById } from "../api/products";

export default function Product({ onAddToCart }) {
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;
    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchProductsById(id)
            .then(data => setItem(data ? data : []))
            .catch(err => {
                console.log(err);
                setError(err);
            })
            .finally(setLoading(false));
    }, [id]);
    return (
        <div id="productPage">
            <div id="productInfo">
                <h3>{item.title}</h3>
                <img src={item.images} alt={item.title} id="productImage" />
                <p>Цена: {item.price}$</p>
                <p>Описание: {item.description}</p>
                <p>Рейтинг: {item.rating}</p>
            </div>
            <div id="productActions">
                <button onClick={() => onAddToCart(item)} id="addToCartBtn">В корзину</button>
                <button onClick={() => navigate(-1)} id="backBtn">Назад</button>
            </div>
        </div>
    )
}