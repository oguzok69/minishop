export async function fetchProducts({ limit = 12, page = 1, q = "" }) {
    const skip = (page - 1) * limit;
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    if (q) url = `https://dummyjson.com/products/search?q=${q}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP" + res.status);
    return res.json();
}

export async function fetchProductsById(id) {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    if (!res.ok) throw new Error("HTTP" + res.status);
    return res.json();
}