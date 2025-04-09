import { db, eq, Product, ProductDepartment } from 'astro:db'
import { z } from 'astro:content'

const departamentoDeleteSchema = z.object({
  clave: z.coerce.number().min(1, 'La clave es requerida')
})

export const POST = async ({ request, redirect }) => {
  const bodyText = await request.text()
  const body = Object.fromEntries(new URLSearchParams(bodyText))

  const result = await departamentoDeleteSchema.safeParseAsync(body)

  if (!result.success) {
    const errorMessage = result.error.errors[0]?.message || 'Error de validación'
    return redirect(`/productos/baja?error=true&message=${encodeURIComponent(errorMessage)}`)
  }
  const { clave } = result.data

  // Validar que el departamento exista
  const existingDepartment = await db.select().from(Product).where(eq(Product.clave, clave))
  if (existingDepartment.length === 0) {
    return redirect('/productos/baja?error=true&message=El%20departamento%20no%20existe')
  }

  // Eliminar el departamento de la base de datos
  // NOTE: Simular la cascada
  await db.delete(ProductDepartment).where(eq(ProductDepartment.claveDepartamento, clave))
  await db.delete(Product).where(eq(Product.clave, clave))

  console.log('Departamento eliminado:', clave)

  return redirect('/departamentos/baja?success=true&message=Departamento%20eliminado%20exitosamente')
}
