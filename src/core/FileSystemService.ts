/**
 * CodyStack File System Service
 * 
 * Uses the File System Access API to read/write real files.
 * Falls back to mock data if API not supported.
 */

import { FileNode } from '../components/FileBrowser'

// ============================================
// TYPES
// ============================================

interface FileSystemService {
    isSupported: boolean
    openDirectory(): Promise<{ handle: FileSystemDirectoryHandle; path: string } | null>
    readDirectory(handle: FileSystemDirectoryHandle, path: string): Promise<FileNode[]>
    readFile(handle: FileSystemFileHandle): Promise<string>
    writeFile(handle: FileSystemFileHandle, content: string): Promise<void>
}

// ============================================
// FILE SYSTEM ACCESS API IMPLEMENTATION
// ============================================

class BrowserFileSystem implements FileSystemService {
    get isSupported(): boolean {
        return 'showDirectoryPicker' in window
    }

    async openDirectory(): Promise<{ handle: FileSystemDirectoryHandle; path: string } | null> {
        try {
            const handle = await window.showDirectoryPicker({
                mode: 'readwrite'
            })
            return { handle, path: handle.name }
        } catch (e) {
            // User cancelled or API not supported
            console.log('Directory picker cancelled or not supported', e)
            return null
        }
    }

    async readDirectory(
        handle: FileSystemDirectoryHandle,
        basePath: string,
        depth: number = 0
    ): Promise<FileNode[]> {
        if (depth > 5) return [] // Limit depth to prevent infinite recursion

        const nodes: FileNode[] = []

        for await (const entry of handle.values()) {
            const path = `${basePath}/${entry.name}`
            const id = path.replace(/[^a-zA-Z0-9]/g, '_')

            if (entry.kind === 'directory') {
                // Skip node_modules and hidden folders
                if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
                    continue
                }

                const dirHandle = await handle.getDirectoryHandle(entry.name)
                const children = await this.readDirectory(dirHandle, path, depth + 1)

                nodes.push({
                    id,
                    name: entry.name,
                    path,
                    type: 'directory',
                    children
                })
            } else {
                const extension = entry.name.split('.').pop()?.toLowerCase()
                nodes.push({
                    id,
                    name: entry.name,
                    path,
                    type: 'file',
                    extension
                })
            }
        }

        // Sort: directories first, then alphabetically
        return nodes.sort((a, b) => {
            if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
            return a.name.localeCompare(b.name)
        })
    }

    async readFile(handle: FileSystemFileHandle): Promise<string> {
        const file = await handle.getFile()
        return await file.text()
    }

    async writeFile(handle: FileSystemFileHandle, content: string): Promise<void> {
        const writable = await handle.createWritable()
        await writable.write(content)
        await writable.close()
    }
}

// ============================================
// FILE HANDLE CACHE
// ============================================

class FileHandleCache {
    private directoryHandle: FileSystemDirectoryHandle | null = null
    private fileHandles: Map<string, FileSystemFileHandle> = new Map()

    setDirectoryHandle(handle: FileSystemDirectoryHandle) {
        this.directoryHandle = handle
        this.fileHandles.clear()
    }

    getDirectoryHandle(): FileSystemDirectoryHandle | null {
        return this.directoryHandle
    }

    async getFileHandle(path: string): Promise<FileSystemFileHandle | null> {
        if (this.fileHandles.has(path)) {
            return this.fileHandles.get(path)!
        }

        if (!this.directoryHandle) return null

        try {
            // Navigate to file through directory structure
            const parts = path.split('/').filter(Boolean)
            let current: FileSystemDirectoryHandle = this.directoryHandle

            // Navigate to parent directory
            for (let i = 1; i < parts.length - 1; i++) {
                current = await current.getDirectoryHandle(parts[i])
            }

            // Get file handle
            const fileName = parts[parts.length - 1]
            const fileHandle = await current.getFileHandle(fileName)
            this.fileHandles.set(path, fileHandle)
            return fileHandle
        } catch (e) {
            console.error('Failed to get file handle:', path, e)
            return null
        }
    }
}

// ============================================
// EXPORTS
// ============================================

export const fileSystem = new BrowserFileSystem()
export const handleCache = new FileHandleCache()

export async function openProject(): Promise<{
    files: FileNode[]
    rootPath: string
    handle: FileSystemDirectoryHandle
} | null> {
    const result = await fileSystem.openDirectory()
    if (!result) return null

    const { handle, path } = result
    handleCache.setDirectoryHandle(handle)

    const files = await fileSystem.readDirectory(handle, path)

    return {
        files,
        rootPath: path,
        handle
    }
}

export async function readFileContent(path: string): Promise<string | null> {
    const handle = await handleCache.getFileHandle(path)
    if (!handle) return null

    return await fileSystem.readFile(handle)
}

export async function saveFileContent(path: string, content: string): Promise<boolean> {
    const handle = await handleCache.getFileHandle(path)
    if (!handle) return false

    await fileSystem.writeFile(handle, content)
    return true
}
