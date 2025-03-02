import { readJSON } from "../utils"

const FILE = "productos.json"

export const GET = async ({ params, request }) => {
    const productos = await readJSON(FILE)
    console.log(productos)

    if (productos.lenght != 0) {
        return new Response(JSON.stringify(productos), { status: 200 })
    }

    return new Response(JSON.stringify({
        message: "No se encontraron productos",
    }),
        {
            status: 404,
        })

}