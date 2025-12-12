import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../lib/utils'
import { FaFilePdf, FaTimes, FaCloudUploadAlt } from 'react-icons/fa'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;

        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    })

    const file = acceptedFiles[0] || null;

    return (
        <div className="w-full">
            <div {...getRootProps()} className={`uplader-drag-area ${isDragActive ? 'border-primary bg-accent/30' : ''}`}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer flex flex-col items-center justify-center h-full">
                    {file ? (
                        <div className="uploader-selected-file w-full max-w-md animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
                            <div className="p-3 bg-red-50 rounded-xl">
                                <FaFilePdf className="size-8 text-red-500" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0 text-left px-3">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatSize(file.size)}
                                </p>
                            </div>
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-red-500" onClick={(e) => {
                                e.stopPropagation();
                                onFileSelect?.(null)
                            }}>
                                <FaTimes className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-6 bg-accent/50 rounded-full text-primary mb-2 transition-transform duration-300 group-hover:scale-110">
                                <FaCloudUploadAlt className="size-10" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-xl text-gray-700 font-medium">
                                    <span className="text-primary font-semibold hover:underline">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-sm text-gray-400 font-medium">PDF up to {formatSize(maxFileSize)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
