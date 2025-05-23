import { promises as fs } from "fs"
import path from "path"

export const readJSON = async (filePath) => {
    const file = path.join("data", filePath)
    try {
        const data = await fs.readFile(file, "utf-8")
        return JSON.parse(data)
    } catch (error) {
        if (error.code === "ENOENT") {
            await fs.mkdir(path.dirname(file), { recursive: true })
            await fs.writeFile(file, "[]", "utf-8")
            return []
        }
        throw error
    }
}

export const writeJSON = async (path, data) => {
    await fs.writeFile(`./data/${path}`, JSON.stringify(data, null, 2), "utf-8")
}

export const generateID = (array) => {
    if (array.length === 0) return 1
    const lastElement = array[array.length - 1]
    return lastElement.id + 1
}

export const appendLineToFile = async (filePath, line) => {
    const file = path.join("data", filePath)
    try {
        await fs.appendFile(file, line + "\n", "utf-8")
    } catch (error) {
        if (error.code === "ENOENT") {
            await fs.mkdir(path.dirname(file), { recursive: true })
            await fs.writeFile(file, line + "\n", "utf-8")
        } else {
            throw error
        }
    }
}

export const createFile = async (filePath) => {
    const file = path.join("data", filePath)
    try {
        await fs.mkdir(path.dirname(file), { recursive: true })
        await fs.writeFile(file, "", "utf-8")
    } catch (error) {
        throw error
    }
}

export const readLinesFromFile = async (filePath) => {
    const file = path.join("data", filePath)
    try {
        const data = await fs.readFile(file, "utf-8")
        return data.split("\n").filter(line => line.length > 0)
    } catch (error) {
        if (error.code === "ENOENT") {
            return -1
        }
        throw error
    }
}

export const fileExists = async (filePath) => {
    const file = path.join("data", filePath)
    try {
        console.log("El departamento existe")
        await fs.access(file)
    }
    catch (error) {
        return false
    }
    return true
}

export const existProduct = async (claveProducto) => {
    const productos = await readJSON("productos.json")
    const foundProducts = productos.filter(producto => producto.id === claveProducto)
    return foundProducts.length > 0 ? foundProducts : -1
}

export const deleteFile = async (filePath) => {
    const file = path.join("data", filePath)
    try {
        await fs.unlink(file)
    } catch (error) {
        if (error.code !== "ENOENT") {
            return -1
        }
    }
}

export const writeLinesToFile = async (filePath, lines) => {
    const file = path.join("data", filePath)
    try {
        await fs.writeFile(file, lines.join("\n") + "\n", "utf-8")
    } catch (error) {
        throw error
    }
}
