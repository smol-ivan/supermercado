import { fileExists, existProduct, readLinesFromFile, writeLinesToFile } from "../utils";
export const POST = async ({request}) => {
    // Obtener los datos del formulario
    const formData = await request.formData()
    const form = {}

    formData.forEach((value, key) => {
        form[key] = value
    })

    const departamentoPath = `${form.claveDepartamento}ProductosDepto.txt`

    // Verificar que el departamento existe
    if (!await fileExists(departamentoPath)) {
        return new Response(JSON.stringify({
            message: `No hay departamento con la clave proporcionada -> ${form.claveDepartamento}`
        }),
            {
                status: 400
            }
        )
    }

    const departamentoFile = await readLinesFromFile(departamentoPath)

    // Verificar que el producto existe
    const productoClave = parseInt(form.claveProducto)

    const producto = await existProduct(productoClave)

    if (producto == -1) {
        return new Response(JSON.stringify({
            message: `No hay producto con clave proporcionada -> ${productoClave}`
        }),
        {
            status: 400
        })
    }

    // Verificar que el producto esta asignado

    const productoIndex = departamentoFile.findIndex(line => line.split("|")[0] == productoClave)

    if (productoIndex === -1) {
        return new Response(JSON.stringify({
            message: `El producto con clave ${form.claveProducto} no se encuentra asignado al departamento`
        }),{
            status: 400
        })
    }

    // Eliminar producto del departamento

    const [productoEliminado] = departamentoFile.splice(productoIndex, 1)

    await writeLinesToFile(departamentoPath, departamentoFile)

    return new Response(JSON.stringify({
        message: `El producto fue dado de baja del Departamento`
    }),{
        status: 200
    })
}