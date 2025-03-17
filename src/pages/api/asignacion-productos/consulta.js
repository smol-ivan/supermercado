import { readJSON, readLinesFromFile, fileExists } from "../utils";

export const POST = async ({ request }) => {
    const formData = await request.formData()
    const form = {}

    formData.forEach((value, key) => {
        form[key] = value
    })

    const departamentoPath = `${form.claveDepartamento}ProductosDepto.txt`

    // Verificar que el departamento existe
    if (!await fileExists(departamentoPath)) {
        return new Response(JSON.stringify({
            message: `No hay departamento con clave proporcionada: ${form.claveDepartamento}`
        }),
            { status: 400 }
        )
    }

    const departamentoFile = await readLinesFromFile(departamentoPath)

    const productos = []
    const productosJSON = await readJSON("productos.json")
    console.log(productosJSON)

    for (const linea of departamentoFile) {
        const [clave] = linea.split("|")

        const productIndex = productosJSON.findIndex(producto => producto.id == clave)

        const [item] = productosJSON.splice(productIndex, 1)
        productos.push({
            clave: parseInt(clave, 10),
            nombre: item.nombre
        })
    }

    return new Response(JSON.stringify(productos), { status: 200 })

}
