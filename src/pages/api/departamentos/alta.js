import { db, eq, Department } from 'astro:db'
import { z } from 'astro:content'

const departmentSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  encargado: z.string().min(1, 'El encargado es requerido')
})

export const POST = async ({ request, redirect }) => {
  // Obtenemos los campos del formulario
  const bodyText = await request.text()
  const body = Object.fromEntries(new URLSearchParams(bodyText))

  const result = await departmentSchema.safeParseAsync(body)

  if (!result.success) {
    const errorMessage = result.error.errors[0]?.message || 'Error de validación'
    return redirect(`/departamentos/alta?error=true&message=${encodeURIComponent(errorMessage)}`)
  }

  const { nombre, encargado } = result.data

  // Validar que el departamento no exista
  const existingDepartment = await db
    .select()
    .from(Department)
    .where(eq(Department.nombre, nombre))

  if (existingDepartment.length > 0) {
    return redirect('/departamentos/alta?error=true&message=El%20departamento%20ya%20existe')
  }

  // Obtener el ID del departamento
  const departments = await db.select().from(Department).orderBy(Department.clave)
  console.log('departments:', departments)
  const id = departments.length > 0 ? departments[departments.length - 1].clave + 1 : 1

  const department = {
    clave: id,
    nombre,
    encargado
  }

  // Guardar el departamento en la base de datos
  await db.insert(Department).values(department)

  return redirect('/departamentos/alta?success=true&message=Departamento%20creado%20exitosamente')
}
