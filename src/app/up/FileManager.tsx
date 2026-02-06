"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { R2File } from '@/lib/r2'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Upload,
  FolderPlus,
  LayoutGrid,
  List,
  Search,
  MoreVertical,
  Download,
  Trash2,
  Folder,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  LogOut,
  Home,
  ChevronRight,
  HardDrive,
  RefreshCw,
  Copy,
  Link,
  Eye,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SortKey = 'name' | 'size' | 'date' | 'type'
type SortOrder = 'asc' | 'desc'
type ViewMode = 'list' | 'grid'

export function FileManager() {
  const [files, setFiles] = useState<R2File[]>([])
  const [folders, setFolders] = useState<string[]>([])
  const [currentPath, setCurrentPath] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [dragOver, setDragOver] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [previewFile, setPreviewFile] = useState<R2File | null>(null)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: R2File } | null>(null)
  const [folderContextMenu, setFolderContextMenu] = useState<{ x: number; y: number; folder: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const isMobile = useIsMobile()

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/r2?prefix=${encodeURIComponent(currentPath)}`)
      if (res.status === 401) {
        router.refresh()
        return
      }
      const data = await res.json()
      setFiles(data.files || [])
      setFolders(data.folders || [])
    } catch (err) {
      toast.error('Failed to load files')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [currentPath, router])

  useEffect(() => {
    fetchFiles()
    setSelected(new Set())
  }, [fetchFiles])

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null)
      setFolderContextMenu(null)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const navigateToFolder = (folder: string) => {
    const newPath = currentPath ? `${currentPath}/${folder}` : folder
    setCurrentPath(newPath)
  }

  const navigateToPath = (index: number) => {
    const parts = currentPath.split('/').filter(Boolean)
    setCurrentPath(parts.slice(0, index + 1).join('/'))
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    const folderPath = currentPath ? `${currentPath}/${newFolderName}` : newFolderName

    try {
      const res = await fetch('/api/r2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createFolder', path: folderPath }),
      })

      if (res.ok) {
        toast.success(`Folder "${newFolderName}" created`)
        setNewFolderName('')
        setShowNewFolder(false)
        fetchFiles()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create folder')
      }
    } catch {
      toast.error('Failed to create folder')
    }
  }

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    setUploading(true)
    const newProgress: Record<string, number> = {}
    let successCount = 0

    for (const file of Array.from(fileList)) {
      newProgress[file.name] = 0
      setUploadProgress({ ...newProgress })

      const formData = new FormData()
      formData.append('file', file)
      if (currentPath) {
        formData.append('path', currentPath)
      }

      try {
        const res = await fetch('/api/r2', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          newProgress[file.name] = 100
          setUploadProgress({ ...newProgress })
          successCount++
        } else {
          const data = await res.json()
          toast.error(`Upload failed: ${file.name}`, { description: data.error })
        }
      } catch (err) {
        toast.error(`Upload error: ${file.name}`)
        console.error('Upload error:', err)
      }
    }

    setUploading(false)
    setUploadProgress({})

    if (successCount > 0) {
      toast.success(`${successCount} file(s) uploaded successfully`)
      fetchFiles()
    }
  }

  const handleDelete = async (keys: string[]) => {
    const count = keys.length

    for (const key of keys) {
      try {
        await fetch('/api/r2', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key }),
        })
      } catch (err) {
        console.error('Delete error:', err)
      }
    }

    setSelected(new Set())
    toast.success(`${count} item(s) deleted`)
    fetchFiles()
  }

  const confirmDelete = (keys: string[]) => {
    toast(`Delete ${keys.length} item(s)?`, {
      action: {
        label: 'Delete',
        onClick: () => handleDelete(keys),
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    })
  }

  const handleDeleteFolder = async (folderName: string) => {
    const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName

    try {
      const res = await fetch('/api/r2', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: folderPath }),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`Folder deleted (${data.deleted} files removed)`)
        fetchFiles()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to delete folder')
      }
    } catch {
      toast.error('Failed to delete folder')
    }
  }

  const confirmDeleteFolder = (folderName: string) => {
    toast(`Delete folder "${folderName}" and all its contents?`, {
      action: {
        label: 'Delete',
        onClick: () => handleDeleteFolder(folderName),
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    })
  }

  const handleFolderContextMenu = (e: React.MouseEvent, folder: string) => {
    e.preventDefault()
    setFolderContextMenu({ x: e.clientX, y: e.clientY, folder })
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    toast.success('Logged out')
    router.refresh()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }

  const toggleSelect = (key: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const newSelected = new Set(selected)
    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }
    setSelected(newSelected)
  }

  const selectAll = () => {
    if (selected.size === filteredFiles.length && filteredFiles.length > 0) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filteredFiles.map(f => f.key)))
    }
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard')
  }

  const handleContextMenu = (e: React.MouseEvent, file: R2File) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, file })
  }

  const filteredFiles = files
    .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'name': cmp = a.name.localeCompare(b.name); break
        case 'type': cmp = a.type.localeCompare(b.type); break
        case 'size': cmp = a.sizeBytes - b.sizeBytes; break
        case 'date': cmp = a.date.localeCompare(b.date); break
      }
      return sortOrder === 'asc' ? cmp : -cmp
    })

  const filteredFolders = folders.filter(f =>
    f.toLowerCase().includes(search.toLowerCase())
  )

  const totalSize = files.reduce((acc, f) => acc + f.sizeBytes, 0)

  const formatTotalSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
  }

  const isPreviewable = (file: R2File) => ['IMG', 'VIDEO'].includes(file.type)

  const getFileIcon = (type: string, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'h-12 w-12' : 'h-5 w-5'
    const colorClass = {
      IMG: 'text-green-500',
      VIDEO: 'text-purple-500',
      AUDIO: 'text-pink-500',
      ZIP: 'text-yellow-500',
      PDF: 'text-red-500',
      DOC: 'text-blue-500',
      TXT: 'text-gray-500',
      JS: 'text-yellow-400',
      TS: 'text-blue-400',
      JSON: 'text-orange-400',
      HTML: 'text-orange-500',
      CSS: 'text-blue-500',
    }[type] || 'text-muted-foreground'

    const icons: Record<string, React.ReactNode> = {
      IMG: <FileImage className={cn(sizeClass, colorClass)} />,
      VIDEO: <FileVideo className={cn(sizeClass, colorClass)} />,
      AUDIO: <FileAudio className={cn(sizeClass, colorClass)} />,
      ZIP: <FileArchive className={cn(sizeClass, colorClass)} />,
      PDF: <FileText className={cn(sizeClass, colorClass)} />,
      DOC: <FileText className={cn(sizeClass, colorClass)} />,
      TXT: <FileText className={cn(sizeClass, colorClass)} />,
      JS: <FileCode className={cn(sizeClass, colorClass)} />,
      TS: <FileCode className={cn(sizeClass, colorClass)} />,
      JSON: <FileCode className={cn(sizeClass, colorClass)} />,
      HTML: <FileCode className={cn(sizeClass, colorClass)} />,
      CSS: <FileCode className={cn(sizeClass, colorClass)} />,
    }

    return icons[type] || <File className={cn(sizeClass, colorClass)} />
  }

  const pathParts = currentPath.split('/').filter(Boolean)

  // Sidebar content
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src="/ghosty.svg"
            alt="Ghosty"
            className="h-10 w-10"
          />
          <div>
            <h1 className="font-semibold">Ghosty</h1>
            <p className="text-xs text-muted-foreground">ups</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <Button
          variant="default"
          className="w-full justify-start gap-3 shadow-md"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={() => setShowNewFolder(true)}
        >
          <FolderPlus className="h-4 w-4" />
          New folder
        </Button>

        <div className="pt-4 border-t">
          <button
            onClick={() => setCurrentPath('')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              currentPath === '' ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
            )}
          >
            <HardDrive className="h-4 w-4" />
            My Drive
          </button>
        </div>
      </div>

      <div className="p-4 border-t mt-auto">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Storage used</span>
            <span className="font-medium">{formatTotalSize(totalSize)}</span>
          </div>
          <Progress value={Math.min((totalSize / (10 * 1024 * 1024 * 1024)) * 100, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {files.length} files in current folder
          </p>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 mt-4 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          <div
            className={cn(
              "fixed inset-0 bg-black/50 z-40 transition-opacity",
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className={cn(
              "fixed left-0 top-0 bottom-0 w-72 bg-background border-r z-50 transition-transform",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="absolute right-2 top-2">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-4 gap-4 shrink-0">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search in Drive"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchFiles}
              className="text-muted-foreground"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Breadcrumb & Actions */}
        <div className="px-4 py-3 border-b flex items-center justify-between gap-4 shrink-0">
          <nav className="flex items-center gap-1 text-sm overflow-x-auto">
            <button
              onClick={() => setCurrentPath('')}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-accent transition-colors shrink-0"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">My Drive</span>
            </button>
            {pathParts.map((part, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <button
                  onClick={() => navigateToPath(i)}
                  className="px-2 py-1 rounded hover:bg-accent transition-colors truncate max-w-32"
                >
                  {part}
                </button>
              </React.Fragment>
            ))}
          </nav>

          {selected.size > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-muted-foreground">{selected.size} selected</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => confirmDelete(Array.from(selected))}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* File area */}
        <div
          className={cn(
            "flex-1 overflow-auto p-4 transition-colors",
            dragOver && "bg-primary/5"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />

          {/* Upload progress */}
          {Object.entries(uploadProgress).length > 0 && (
            <div className="mb-4 p-4 bg-muted/50 rounded-lg space-y-3">
              <p className="text-sm font-medium">Uploading...</p>
              {Object.entries(uploadProgress).map(([name, progress]) => (
                <div key={name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate max-w-xs">{name}</span>
                    <span className="text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1" />
                </div>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-3">
                <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Loading files...</p>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="space-y-6">
              {/* Folders */}
              {filteredFolders.length > 0 && (
                <section>
                  <h2 className="text-sm font-medium mb-3 px-1">Folders</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {filteredFolders.map((folder) => (
                      <div
                        key={folder}
                        onContextMenu={(e) => handleFolderContextMenu(e, folder)}
                        className="group relative flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent hover:border-accent transition-all text-left cursor-pointer"
                        onClick={() => navigateToFolder(folder)}
                      >
                        <Folder className="h-10 w-10 text-blue-500 shrink-0" />
                        <span className="text-sm font-medium truncate group-hover:text-accent-foreground">
                          {folder}
                        </span>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="secondary" size="icon" className="h-7 w-7 shadow">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigateToFolder(folder) }}>
                                <Folder className="h-4 w-4 mr-2" />
                                Open
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => { e.stopPropagation(); confirmDeleteFolder(folder) }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Files */}
              {filteredFiles.length > 0 && (
                <section>
                  <h2 className="text-sm font-medium mb-3 px-1">Files</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.key}
                        onContextMenu={(e) => handleContextMenu(e, file)}
                        className={cn(
                          "group relative rounded-lg border bg-card overflow-hidden transition-all hover:shadow-md",
                          selected.has(file.key) && "ring-2 ring-primary border-primary"
                        )}
                      >
                        {/* Checkbox */}
                        <div
                          className={cn(
                            "absolute top-2 left-2 z-10 transition-opacity",
                            selected.has(file.key) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          )}
                        >
                          <Checkbox
                            checked={selected.has(file.key)}
                            onCheckedChange={() => toggleSelect(file.key)}
                            className="bg-background/80 backdrop-blur"
                          />
                        </div>

                        {/* Thumbnail */}
                        <div
                          className="aspect-square bg-muted flex items-center justify-center cursor-pointer overflow-hidden"
                          onClick={() => isPreviewable(file) ? setPreviewFile(file) : window.open(file.url)}
                        >
                          {file.type === 'IMG' ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : file.type === 'VIDEO' ? (
                            <div className="relative w-full h-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                              <FileVideo className="h-12 w-12 text-purple-500" />
                              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-xs text-white">
                                VIDEO
                              </div>
                            </div>
                          ) : (
                            <div className="p-4">
                              {getFileIcon(file.type, 'lg')}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-3">
                          <p className="text-sm font-medium truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {file.size} · {file.date}
                          </p>
                        </div>

                        {/* Menu */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="icon" className="h-8 w-8 shadow">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {isPreviewable(file) && (
                                <DropdownMenuItem onClick={() => setPreviewFile(file)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem asChild>
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                                <Link className="h-4 w-4 mr-2" />
                                Copy link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => confirmDelete([file.key])}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Empty state */}
              {filteredFiles.length === 0 && filteredFolders.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {search ? 'No files match your search' : 'Drop files here'}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {search
                      ? 'Try a different search term'
                      : 'or click Upload to add files to your drive'
                    }
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* List view */
            <div className="rounded-lg border bg-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 w-12">
                      <Checkbox
                        checked={selected.size === filteredFiles.length && filteredFiles.length > 0}
                        onCheckedChange={selectAll}
                      />
                    </th>
                    <th className="text-left p-3">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
                      >
                        Name
                        {sortKey === 'name' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="text-left p-3 hidden md:table-cell">
                      <button
                        onClick={() => handleSort('type')}
                        className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
                      >
                        Type
                        {sortKey === 'type' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="text-left p-3 hidden md:table-cell">
                      <button
                        onClick={() => handleSort('size')}
                        className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
                      >
                        Size
                        {sortKey === 'size' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="text-left p-3 hidden lg:table-cell">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
                      >
                        Modified
                        {sortKey === 'date' && (
                          <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </button>
                    </th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Folders */}
                  {filteredFolders.map((folder) => (
                    <tr
                      key={folder}
                      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigateToFolder(folder)}
                      onContextMenu={(e) => handleFolderContextMenu(e, folder)}
                    >
                      <td className="p-3"></td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Folder className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">{folder}</span>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">Folder</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">—</td>
                      <td className="p-3 hidden lg:table-cell text-muted-foreground">—</td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigateToFolder(folder) }}>
                              <Folder className="h-4 w-4 mr-2" />
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => { e.stopPropagation(); confirmDeleteFolder(folder) }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}

                  {/* Files */}
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.key}
                      onContextMenu={(e) => handleContextMenu(e, file)}
                      className={cn(
                        "border-b hover:bg-muted/50 transition-colors",
                        selected.has(file.key) && "bg-primary/5"
                      )}
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={selected.has(file.key)}
                          onCheckedChange={() => toggleSelect(file.key)}
                        />
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => isPreviewable(file) ? setPreviewFile(file) : window.open(file.url)}
                          className="flex items-center gap-3 hover:text-primary transition-colors"
                        >
                          {getFileIcon(file.type)}
                          <span className="truncate max-w-xs">{file.name}</span>
                        </button>
                      </td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{file.type}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{file.size}</td>
                      <td className="p-3 hidden lg:table-cell text-muted-foreground">{file.date}</td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {isPreviewable(file) && (
                              <DropdownMenuItem onClick={() => setPreviewFile(file)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                              <Link className="h-4 w-4 mr-2" />
                              Copy link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => confirmDelete([file.key])}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}

                  {/* Empty state */}
                  {filteredFiles.length === 0 && filteredFolders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No files yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload files or create folders to get started
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary m-4 rounded-xl flex items-center justify-center pointer-events-none z-20">
            <div className="text-center">
              <Upload className="h-16 w-16 mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium text-primary">Drop files to upload</p>
            </div>
          </div>
        )}
      </main>

      {/* File context menu */}
      {contextMenu && (
        <div
          className="fixed bg-popover border rounded-lg shadow-lg py-1 z-50 min-w-48"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {isPreviewable(contextMenu.file) && (
            <button
              onClick={() => { setPreviewFile(contextMenu.file); setContextMenu(null) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          )}
          <a
            href={contextMenu.file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
          <button
            onClick={() => { copyToClipboard(contextMenu.file.url); setContextMenu(null) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            <Copy className="h-4 w-4" />
            Copy link
          </button>
          <div className="border-t my-1" />
          <button
            onClick={() => { confirmDelete([contextMenu.file.key]); setContextMenu(null) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}

      {/* Folder context menu */}
      {folderContextMenu && (
        <div
          className="fixed bg-popover border rounded-lg shadow-lg py-1 z-50 min-w-48"
          style={{ left: folderContextMenu.x, top: folderContextMenu.y }}
        >
          <button
            onClick={() => { navigateToFolder(folderContextMenu.folder); setFolderContextMenu(null) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
          >
            <Folder className="h-4 w-4" />
            Open
          </button>
          <div className="border-t my-1" />
          <button
            onClick={() => { confirmDeleteFolder(folderContextMenu.folder); setFolderContextMenu(null) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}

      {/* New folder dialog */}
      <Dialog open={showNewFolder} onOpenChange={setShowNewFolder}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
            <DialogDescription>
              Create a new folder in {currentPath || 'My Drive'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name" className="sr-only">Folder name</Label>
            <Input
              id="folder-name"
              placeholder="Untitled folder"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setShowNewFolder(false); setNewFolderName('') }}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview modal */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">{previewFile?.name || 'Preview'}</DialogTitle>
          <div className="relative">
            {previewFile?.type === 'VIDEO' ? (
              <video
                src={previewFile.url}
                controls
                autoPlay
                className="w-full max-h-[80vh]"
              />
            ) : (
              <img
                src={previewFile?.url}
                alt={previewFile?.name}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
            )}
          </div>
          <div className="p-4 border-t flex items-center justify-between">
            <div>
              <p className="font-medium">{previewFile?.name}</p>
              <p className="text-sm text-muted-foreground">
                {previewFile?.size} · {previewFile?.date}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => previewFile && copyToClipboard(previewFile.url)}>
                <Link className="h-4 w-4 mr-2" />
                Copy link
              </Button>
              <Button asChild>
                <a href={previewFile?.url} download target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
