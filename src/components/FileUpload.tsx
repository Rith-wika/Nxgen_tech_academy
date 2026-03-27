import React, { useState } from "react";
import { Upload, X, FileText, File, FileIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonFile } from "@/types/moduleTypes";

interface FileUploadProps {
  files: LessonFile[];
  onFilesChange: (files: LessonFile[]) => void;
  isLoading?: boolean;
  isReadOnly?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  isLoading = false,
  isReadOnly = false,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const getFileIcon = (fileType: string, filename: string) => {
    const lowerType = fileType.toLowerCase();
    const lowerName = filename.toLowerCase();

    if (lowerType.includes("pdf") || lowerName.endsWith(".pdf")) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (
      lowerType.includes("word") ||
      lowerType.includes("document") ||
      lowerName.endsWith(".doc") ||
      lowerName.endsWith(".docx")
    ) {
      return <FileText className="w-5 h-5 text-blue-500" />;
    }
    if (
      lowerType.includes("presentation") ||
      lowerType.includes("powerpoint") ||
      lowerName.endsWith(".ppt") ||
      lowerName.endsWith(".pptx")
    ) {
      return <FileIcon className="w-5 h-5 text-orange-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isReadOnly) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) {
      return;
    }
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const lessonFiles = newFiles.map((file) => ({
      id: undefined,
      file,
      filename: file.name,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
    }));
    onFilesChange([...files, ...lessonFiles]);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      {!isReadOnly && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors ${
            isDragActive
              ? "border-[#000080] bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            disabled={isLoading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-center pointer-events-none">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Drag and drop files here or click to select</p>
            <p className="text-xs text-gray-500 mt-1">Supported: PDF, PPT, DOC, DOCX, XLS, XLSX</p>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">
            Uploaded Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((fileObj, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(fileObj.fileType, fileObj.filename)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {fileObj.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileObj.file?.size || 0) > 0
                        ? `${(fileObj.file!.size / 1024 / 1024).toFixed(2)} MB`
                        : fileObj.fileUrl
                        ? "Uploaded"
                        : "Pending"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {fileObj.fileUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      title="Download File"
                    >
                      <a href={fileObj.fileUrl} target="_blank" rel="noopener noreferrer" download>
                        <Download className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {!isReadOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isLoading}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Remove File"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
