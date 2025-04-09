import { db, eq, and, Product, Department, ProductDepartment } from 'astro:db'
import { z } from 'astro:content'

const productPriceSchema = z.object({
  claveProducto: z.string().min(1, 'La clave del producto es requerida'),
  claveDepartamento: z.string().min(1, 'La clave del departamento es requerida'),
  precio: z.coerce.number().min(1, 'El precio es requerido')
})

export const POST = async ({ request, redirect }) => {
  // Obtenemos los campos del formulario
  const bodyText = await request.text()
  const body = Object.fromEntries(new URLSearchParams(bodyText))

  // Validar los campos del formulario
  const result = productPriceSchema.safeParse(body)
  if (!result.success) {
    return redirect('/precios/asignacion?error=true&message=Campo%20invalido')
  }

  const { claveProducto, claveDepartamento, precio } = result.data
  // Verificar que el departamento existe
  const existingDepartment = await db.select().from(Department).where(eq(Department.clave, claveDepartamento))

  if (existingDepartment.length === 0) {
    return redirect('/precios/asignacion?error=true&message=El%20departamento%20no%20existe')
  }

  // Verificar que el producto exista
  const existingProduct = await db.select().from(Product).where(eq(Product.clave, claveProducto))
  if (existingProduct.length === 0) {
    return redirect('/precios/asignacion?error=true&message=El%20producto%20no%20existe')
  }

  // Verificar que el producto esta asignado
  const asignedProduct = await db
    .select()
    .from(ProductDepartment).where(and(eq(ProductDepartment.claveProducto, claveProducto), eq(ProductDepartment.claveDepartamento, claveDepartamento)))
  if (asignedProduct.length === 0) {
    return redirect('/precios/asignacion?error=true&message=El%20producto%20no%20esta%20asignado')
  }
  // Las condiciones se cumplen, y se cambia el precio del producto
  await db.update(Product).set({ precio }).where(eq(Product.clave, claveProducto))

  return redirect('/precios/asignacion?success=true&message=Precio%20cambiado%20correctamente')
}
