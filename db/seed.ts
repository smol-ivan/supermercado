import { db, Product, Department, ProductDepartment } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	// TODO
	await db.insert(Product).values([
		{ clave: 1, nombre: "Arroz", proveedor: "Mario Garcia" },
		{ clave: 2, nombre: "Frijoles", proveedor: "Elena Perez" },
		{ clave: 3, nombre: "Cinta de aislar", proveedor: "Jose Martinez" },
		{ clave: 11, nombre: "Cobija", proveedor: "Juan Sanchez" },
		{ clave: 12, nombre: "Foco de 40 Watts", proveedor: "Silvia Lopez" },
	])

	await db.insert(Department).values([
		{ clave: 1, nombre: "Abarrotes", encargado: "Mario Bezares" },
		{ clave: 2, nombre: "Tlapaleria", encargado: "Arnulfo Garcia" },
		{ clave: 3, nombre: "Blancos", encargado: "Elena Alcantara" },
		{ clave: 4, nombre: "Papeleria", encargado: "Martha Sanchez" },
	])

	await db.insert(ProductDepartment).values([
		{ claveProducto: 1, claveDepartamento: 1 },
		{ claveProducto: 2, claveDepartamento: 1 },
		{ claveProducto: 3, claveDepartamento: 2 },
		{ claveProducto: 11, claveDepartamento: 3 },
		{ claveProducto: 12, claveDepartamento: 4 },
	])
}
