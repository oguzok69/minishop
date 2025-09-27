import { Link, useNavigate } from "react-router-dom"

export default function Header({cartCount}) {
    const navigate = useNavigate();
    return (
        <div id="header">
            <nav id="nav">
                <Link to="/" id="navLink">mini-shop</Link>{" "}
                <button onClick={() => navigate("/cart")} id="navButton">Корзина({cartCount})</button>
            </nav>
        </div>
    )
}