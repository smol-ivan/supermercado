import { appendLineToFile, createFile } from "../utils"

const path = "deptos.txt"

export const POST = async ({ request }) => {
    // const departamentos = readJSON(path)

    // Obtener los datos del formulario
    const formData = await request.formData()
    const departamento = {}

    formData.forEach((value, key) => {
        departamento[key] = value
    });

    // Renglon con los datos proporcionados
    const renglon = `${departamento.clave}|${departamento.nombre}|${departamento.responsable}`

    // departamentos.push()
    appendLineToFile(path, renglon)
    createFile(`${departamento.clave}ProductosDepto.txt`)

    return new Response(JSON.stringify({
        message: `Departamento ${departamento.nombre} creado con exito`
    }),
        {
            status: 200
        }
    )
}