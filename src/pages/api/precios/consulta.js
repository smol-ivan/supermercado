import { fileExists, readLinesFromFile } from "../utils"

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

    for (const linea of departamentoFile) {
        const [clave, precio] = linea.split("|")

        productos.push({
            clave: parseInt(clave, 10),
            precio: parseFloat(precio)
        })
    }

    return new Response(JSON.stringify(productos), { status: 200 })

}
