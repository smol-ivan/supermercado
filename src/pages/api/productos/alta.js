import { db, eq, Product } from 'astro:db'
import { z } from 'astro:content'

const productAddSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  proveedor: z.string().min(1, 'El proveedor es requerido')
})

export const POST = async ({ request, redirect }) => {
  // Obtenemos los campos del formulario
  const bodyText = await request.text()
  const body = Object.fromEntries(new URLSearchParams(bodyText))

  // Validar los campos del formulario
  const result = productAddSchema.safeParse(body)
  if (!result.success) {
    return redirect('/productos/alta?error=true&message=Campo%20invalido')
  }
  const { nombre, proveedor } = result.data

  // Validar que el producto no exista
  const existingProduct = await db
    .select()
    .from(Product)
    .where(eq(Product.nombre, nombre))

  if (existingProduct.length > 0) {
    return redirect('/productos/alta?error=true&message=El%20producto%20ya%20existe')
  }

  // Obtener el ID del producto
  const productos = await db.select().from(Product).orderBy(Product.clave)
  console.log('productos:', productos)
  const id = productos.length > 0 ? productos[productos.length - 1].clave + 1 : 1

  const producto = {
    clave: id,
    nombre,
    proveedor
  }

  // Guardar el producto en la base de datos
  await db.insert(Product).values(producto)

  return redirect('/productos/alta?success=true&message=Producto%20guardado%20exitosamente')
}
