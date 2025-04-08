import { defineDb, defineTable, column } from 'astro:db';

const Product = defineTable({
  columns: {
    nombre: column.text(),
    proveedor: column.text(),
    precio: column.number({ optional: true }),
    clave: column.number({ primaryKey: true, unique: true }),
  }
})

const Department = defineTable({
  columns: {
    clave: column.number({ primaryKey: true }),
    nombre: column.text(),
    encargado: column.text(),
  }
})

const ProductDepartment = defineTable({
  columns: {
    claveProducto: column.number({ references: () => Product.columns.clave }),
    claveDepartamento: column.number({ references: () => Department.columns.clave }),
  },
  indexes: [{
    on: ["claveProducto", "claveDepartamento"], unique: true
  }]
})

// https://astro.build/db/config
export default defineDb({
  tables: { Product, Department, ProductDepartment },
});
