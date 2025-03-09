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