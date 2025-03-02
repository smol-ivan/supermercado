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
    return array.length > 0 ? array.length + 1 : 1
}