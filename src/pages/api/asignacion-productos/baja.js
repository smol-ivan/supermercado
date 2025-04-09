import { db, eq, and, Product, ProductDepartment, Department } from 'astro:db'
import { productDepartmentDeleteSchema } from '../productos/baja'

export const POST = async ({ request, redirect }) => {
  const bodyText = await request.text()
  const body = Object.fromEntries(new URLSearchParams(bodyText))

  const result = await productDepartmentDeleteSchema.safeParseAsync(body)

  if (!result.success) {
    const errorMessage = result.error.errors[0]?.message || 'Error de validación'
    return redirect(`/productos/baja?error=true&message=${encodeURIComponent(errorMessage)}`)
  }

  const { claveDepartamento, claveProducto } = result.data

  // Verificar que el departamento existe
  const existingDepartment = await db.select().from(Department).where(eq(Department.clave, claveDepartamento))

  if (existingDepartment.length === 0) {
    return redirect('/productos/alta?error=true&message=El%20departamento%20no%20existe')
  }
  // Verificar que el producto existe
  const existingProduct = await db.select().from(Product).where(eq(Product.clave, claveProducto))
  if (existingProduct.length === 0) {
    return redirect('/productos/alta?error=true&message=El%20producto%20no%20existe')
  }

  // Verificar que el producto esta asignado
  const asignedProduct = await db
    .select()
    .from(ProductDepartment).where(and(eq(ProductDepartment.claveProducto, claveProducto), eq(ProductDepartment.claveDepartamento, claveDepartamento)))

  if (asignedProduct.length === 0) {
    return redirect('/productos/alta?error=true&message=El%20producto%20no%20esta%20asignado')
  }

  // Eliminar producto del departamento

  await db.delete(ProductDepartment).where(and(eq(ProductDepartment.claveProducto, claveProducto), eq(ProductDepartment.claveDepartamento, claveDepartamento)))
}
