import { readJSON, writeJSON, generateID } from "../utils"

const path = "productos.json"

export const POST = async ({ request }) => {
    const productos = await readJSON(path)
    const formData = await request.formData()

    // Convertir el FormData a un objeto
    const producto = {}
    formData.forEach((value, key) => {
        producto[key] = value
    })

    // Obtener el ID del producto
    const id = generateID(productos)
    console.log(productos)

    // Agregar el producto a la lista
    productos.push({ ...producto, id: id })

    // Guardar el array de productos
    await writeJSON(path, productos)


    return new Response(JSON.stringify({
        message: `Producto dado de alta con la clave -> ${id}`,
    }),
        {
            status: 200,
        })
}
