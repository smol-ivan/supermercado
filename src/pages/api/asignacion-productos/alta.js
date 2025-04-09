import { db, eq, and, ProductDepartment, Department, Product } from 'astro:db'
import { z } from 'astro:content'

const productDepartmentSchema = z.object({
  claveProducto: z.string().min(1),
  claveDepartamento: z.string().min(1)
})

export const POST = async ({ request, redirect }) => {
  // Obtenemos los campos del formulario
  const bodyText = await request.text()
  const body = Object.fromEntries(new URLSearchParams(bodyText))

  // Validar los campos del formulario
  const result = productDepartmentSchema.safeParse(body)
  if (!result.success) {
    return redirect('/productos/alta?error=true&message=Campo%20invalido')
  }

  const { claveProducto, claveDepartamento } = result.data

  // Verificar que el departamento exista
  const existingDepartment = await db.select().from(Department).where(eq(Department.clave, claveDepartamento))

  if (existingDepartment.length === 0) {
    return redirect('/productos/alta?error=true&message=El%20departamento%20no%20existe')
  }

  // Verificar que el producto exista
  const existingProduct = await db.select().from(Product).where(eq(Product.clave, claveProducto))
  if (existingProduct.length === 0) {
    return redirect('/productos/alta?error=true&message=El%20producto%20no%20existe')
  }

  // Verificar que el producto no esta asignado
  const asignedProduct = await db
    .select()
    .from(ProductDepartment).where(and(eq(ProductDepartment.claveProducto, claveProducto), eq(ProductDepartment.claveDepartamento, claveDepartamento)))

  if (asignedProduct.length > 0) {
    return redirect('/productos/alta?error=true&message=El%20producto%20ya%20esta%20asignado')
  }

  // Asignar producto al departamento
  const productDepartment = {
    claveProducto,
    claveDepartamento
  }
  await db.insert(ProductDepartment).values(productDepartment)

  return redirect('/productos/alta?success=true&message=Producto%20asignado%20exitosamente')
}
