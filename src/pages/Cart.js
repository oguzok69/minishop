import { Link } from "react-router-dom";

export default function Cart({ cart, cartTotal, onInc, onDec, onRemove }) {
    const isEmpty = !cart || cart.length === 0;
    return (
        <div id="cartContainer">
            <h1 id="cartHeader">Корзина</h1>
            <Link to="/" id="cartLink">На главную</Link>
            {isEmpty ? (<p>В корзине пусто</p>) : (
                <>
                    <ul id="cartList">
                        {cart.map((item) => {
                            return (
                                <li key={item.id} id="cartItem">
                                    <img src={item.thumbnail} alt={item.title}></img>
                                    <div>{item.title}</div>
                                    <div>Цена: {Number(item.price).toFixed(2)}$</div>

                                    <div id="cartItemButtons">
                                        <button onClick={() => onInc(item.id)}>+</button>
                                        <span>{" "} {item.qty || 0} шт.</span>
                                        <button onClick={() => onDec(item.id)}>-</button>
                                        <button onClick={() => onRemove(item.id)}>Удалить</button>
                                    </div>

                                    <div>
                                        Итого: {Number(item.qty * item.price).toFixed(2)}$
                                    </div>


                                </li>
                            )
                        })}
                    </ul>
                    <div id="buyAll">
                        <button>Перейти к оформлению({Number(cartTotal).toFixed(2)}$)</button>
                    </div>
                </>
            )}

        </div>
    )
}