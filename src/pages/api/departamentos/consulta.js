import { readLinesFromFile } from "../utils";

const FILE = "deptos.txt"

export const GET = async () => {
    const departamentos = await readLinesFromFile(FILE)

    if (departamentos.length === 0) {
        return new Response(JSON.stringify({
            message: "No se encontraron departamentos"
        }),
            {
                status: 404
            }
        )
    }

    const departamentosJSON = []

    departamentos.forEach(line => {
        const departamentoArray = line.split("|")
        const departamento = {
        clave: departamentoArray[0],
        nombre: departamentoArray[1],
        responsable: departamentoArray[2],
        }
        departamentosJSON.push(departamento)
    });

    return new Response(JSON.stringify(departamentosJSON), {status: 200})
}