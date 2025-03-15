import { appendLineToFile, createFile, fileExists, readLinesFromFile, existProduct } from "../utils";

export const POST = async ({ request }) => {
    // Obtener los datos del formulario
    const formData = await request.formData();
    const form = {};

    formData.forEach((value, key) => {
        form[key] = value;
    })

    const departamentoPath = `${form.claveDepartamento}ProductosDepto.txt`;

    //Verificar que el departamento exista 
    if (!await fileExists(departamentoPath)) {
        return new Response(JSON.stringify({
            message: `No hay departamento con clave proporcionada\n ${form.claveDepartamento}`
        }),
            {
                status: 400
            }
        )
    }
    const departamentoFile = await readLinesFromFile(departamentoPath);

    // Verificar que el producto existe

    const productoClave = parseInt(form.claveProducto);

    const producto = await existProduct(productoClave);

    if (producto == -1) {
        return new Response(JSON.stringify({
            message: `No hay producto con clave proporcionada\n ${productoClave}`
        }),
            {
                status: 400
            }
        )
    }

    // Verificar que el producto no esta asignado
    const productoAsignado = departamentoFile.filter(line => line.split("|")[0] == form.claveProducto);

    if (productoAsignado.length > 0) {
        return new Response(JSON.stringify({
            message: `El producto con clave ${form.claveProducto} ya esta asignado al departamento`
        }),
            {
                status: 400
            }
        )
    }

    // Asignar producto al departamento
    const renglon = `${form.claveProducto}|-1|${form.claveDepartamento}`;
    appendLineToFile(departamentoPath, renglon);

    return new Response(JSON.stringify({
        message: `Producto con clave ${form.claveProducto} asignado al departamento con clave ${form.claveDepartamento}`
    }),
        {
            status: 200
        }
    )
}