import { readJSON, writeJSON } from "../utils";

const path = "productos.json";

export const POST = async ({ request }) => {
    const productos = await readJSON(path);
    const formData = await request.formData();

    const clave = formData.get("clave");
    console.log(productos);
    const productoIndex = productos.findIndex(producto => producto.id == clave)

    if (productoIndex === -1) {
        return new Response(JSON.stringify({
            message: `No se encontro el producto con la clave seleccionada`,
        }),
            {
                status: 404,
            });
    }

    productos.splice(productoIndex, 1)
    writeJSON(path, productos)

    return new Response(JSON.stringify({
        message: `Producto dado de baja con la clave -> ${clave}`,
    }),
        {
            status: 200,
        });
}