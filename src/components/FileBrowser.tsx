import { useState } from 'react'
import {
    ChevronRight,
    ChevronDown,
    File,
    Folder,
    FolderOpen,
    FileCode,
    FileJson,
    FileType,
    FileCog,
    Image,
    RefreshCw
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

export interface FileNode {
    id: string
    name: string
    path: string
    type: 'file' | 'directory'
    children?: FileNode[]
    extension?: string
}

interface FileBrowserProps {
    rootPath: string
    files: FileNode[]
    onFileSelect: (file: FileNode) => void
    onRefresh?: () => void
    selectedFile?: string
}

// ============================================
// ICON MAPPING
// ============================================

const getFileIcon = (name: string, extension?: string) => {
    if (extension === 'ts' || extension === 'tsx') return <FileCode size={16} color="#3178c6" />
    if (extension === 'js' || extension === 'jsx') return <FileCode size={16} color="#f7df1e" />
    if (extension === 'json') return <FileJson size={16} color="#cbcb41" />
    if (extension === 'css' || extension === 'scss') return <FileType size={16} color="#264de4" />
    if (extension === 'md') return <FileType size={16} color="#083fa1" />
    if (extension === 'html') return <FileCode size={16} color="#e34c26" />
    if (extension === 'png' || extension === 'jpg' || extension === 'svg') return <Image size={16} color="#a855f7" />
    if (name.includes('config') || name.includes('.env')) return <FileCog size={16} color="#6b7280" />
    return <File size={16} color="var(--text-muted)" />
}

// ============================================
// FILE TREE ITEM
// ============================================

interface TreeItemProps {
    node: FileNode
    depth: number
    onFileSelect: (file: FileNode) => void
    selectedFile?: string
}

function TreeItem({ node, depth, onFileSelect, selectedFile }: TreeItemProps) {
    const [expanded, setExpanded] = useState(depth < 2)
    const isSelected = selectedFile === node.path
    const isDirectory = node.type === 'directory'

    const handleClick = () => {
        if (isDirectory) {
            setExpanded(!expanded)
        } else {
            onFileSelect(node)
        }
    }

    return (
        <div>
            <div
                onClick={handleClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    paddingLeft: `${8 + depth * 16}px`,
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(255, 51, 102, 0.15)' : 'transparent',
                    borderLeft: isSelected ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                    if (!isSelected) {
                        e.currentTarget.style.background = 'var(--glass-bg-hover)'
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isSelected) {
                        e.currentTarget.style.background = 'transparent'
                    }
                }}
            >
                {/* Expand/Collapse Icon */}
                {isDirectory ? (
                    expanded ? (
                        <ChevronDown size={14} color="var(--text-muted)" />
                    ) : (
                        <ChevronRight size={14} color="var(--text-muted)" />
                    )
                ) : (
                    <span style={{ width: 14 }} />
                )}

                {/* File/Folder Icon */}
                {isDirectory ? (
                    expanded ? (
                        <FolderOpen size={16} color="var(--accent-secondary)" />
                    ) : (
                        <Folder size={16} color="var(--accent-secondary)" />
                    )
                ) : (
                    getFileIcon(node.name, node.extension)
                )}

                {/* Name */}
                <span style={{
                    fontSize: '0.8rem',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 500 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {node.name}
                </span>
            </div>

            {/* Children */}
            {isDirectory && expanded && node.children && (
                <div>
                    {node.children
                        .sort((a, b) => {
                            // Directories first, then files
                            if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
                            return a.name.localeCompare(b.name)
                        })
                        .map(child => (
                            <TreeItem
                                key={child.id}
                                node={child}
                                depth={depth + 1}
                                onFileSelect={onFileSelect}
                                selectedFile={selectedFile}
                            />
                        ))}
                </div>
            )}
        </div>
    )
}

// ============================================
// FILE BROWSER COMPONENT
// ============================================

export default function FileBrowser({
    rootPath,
    files,
    onFileSelect,
    onRefresh,
    selectedFile
}: FileBrowserProps) {
    const projectName = rootPath.split(/[/\\]/).pop() || 'Project'

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--glass-bg)',
            borderRight: '1px solid var(--glass-border)'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Folder size={16} color="var(--accent-primary)" />
                    <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)'
                    }}>
                        {projectName}
                    </span>
                </div>
                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <RefreshCw size={14} color="var(--text-muted)" />
                    </button>
                )}
            </div>

            {/* File Tree */}
            <div style={{
                flex: 1,
                overflow: 'auto',
                paddingTop: '8px'
            }}>
                {files.map(node => (
                    <TreeItem
                        key={node.id}
                        node={node}
                        depth={0}
                        onFileSelect={onFileSelect}
                        selectedFile={selectedFile}
                    />
                ))}
            </div>
        </div>
    )
}
