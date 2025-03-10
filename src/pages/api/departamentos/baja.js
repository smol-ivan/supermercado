import { deleteFile, readLinesFromFile, writeLinesToFile } from "../utils";

export const POST = async ({request}) => {
    const departamentos = await readLinesFromFile("deptos.txt")
    const formData = await request.formData()

    const clave = formData.get("clave")

    const departamentoIndex = departamentos.findIndex(line => line.split("|")[0] === clave)

    if (departamentoIndex === -1) {
        return new Response(JSON.stringify({
            message: `No se encontro el departamento con la clave ${clave}`
        }),
        {
            status: 404
        })
    }

    const [departamentoEliminado] = departamentos.splice(departamentoIndex, 1)

    await writeLinesToFile("deptos.txt", departamentos)

    await deleteFile(`${clave}ProductosDepto.txt`)

    return new Response(JSON.stringify({
        message: `Departamento con clave ${clave} eliminado con exito`
    }),
    {
        status: 200
    })
}