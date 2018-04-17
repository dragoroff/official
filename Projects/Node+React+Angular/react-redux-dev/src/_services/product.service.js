

export const productService = {
    addProduct
};

async function addProduct(product,token) {
    let response= fetch("/api/book", {
        method: 'POST',
        body:(JSON.stringify(product)),
        headers: {
            'content-type': 'application/json',
            'xx-auth': token
        }
    });
    return response;
}
