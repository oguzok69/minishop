import { useEffect, useState } from "react"
import { fetchProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
const LIMIT = 12;

export default function Catalog({ onAddToCart }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get("q") ?? "";
    const initialPage = Number.parseInt(searchParams.get("page") || "1", 10) || 1;

    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery.trim());
    const [page, setPage] = useState(initialPage);

    useEffect(() => {
        const t = setTimeout(() => {
            const trimmed = query.trim();
            if (trimmed !== debouncedQuery) {
                setPage(1);
                setDebouncedQuery(trimmed);
            }
        }, 500);
        return () => clearTimeout(t);
    }, [query, debouncedQuery])

    useEffect(() => {
        const ctrl = new AbortController();
        setLoading(true);
        setError(null);

        fetchProducts({ limit: LIMIT, page, q: debouncedQuery, signal: ctrl.signal })
            .then((data) => {
                setItems(data && data.products ? data.products : []);
                setTotal((data && typeof data.total === "number") ? data.total : 0)
            })
            .catch(err => {
                if (err && err.name !== "AbortError") {
                    console.error(err);
                    setError(
                        err && err.message ? err.message : "Не удалось загрузить товары"
                    );
                }
            })
            .finally(() => setLoading(false));

        return () => ctrl.abort();
    }, [debouncedQuery, page]);

    useEffect(() => {
        const next = new URLSearchParams();
        if (debouncedQuery) next.set("q", debouncedQuery);
        next.set("page", String(page));

        if (next.toString() !== searchParams.toString()) {
            setSearchParams(next, { replace: true });
        }
    }, [debouncedQuery, page, searchParams, setSearchParams]);

    useEffect(() => {
        const urlQ = searchParams.get("q") ?? "";
        const urlPage = Number.parseInt(searchParams.get("page") || "1", 10);

        if (urlQ !== debouncedQuery) {
            setQuery(urlQ);
            setDebouncedQuery(urlQ.trim());
        }

        if (urlPage !== page) setPage(urlPage);
    }, [searchParams]);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / LIMIT)), [total]);
    return (
        <div>
            <input id="catalogInput" type="text" placeholder="catalog" value={query} onChange={(e) => setQuery(e.target.value)}></input>
            {loading && <p>загрузка...</p>}
            {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
            <section id="itemsList">
                {(items.length === 0 && !loading && !error) ? (<p>нет товаров</p>) :
                    (items.map((item) => (<ProductCard
                        key={item.id}
                        product={item}
                        onAddToCart={() => onAddToCart(item)}
                    />)))}
            </section>
            <div id="footer">
                <button id="prev" onClick={() => setPage(page - 1)} disabled={page === 1}>-</button>
                <span id="footelSpan">Страница {page} из {totalPages}</span>
                <button id="next" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>+</button>
            </div>

        </div>
    )
}