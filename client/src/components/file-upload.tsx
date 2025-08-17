import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, FileCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  onFileRemove: () => void;
}

export function FileUpload({ onFileUpload, uploadedFile, onFileRemove }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
    setDragActive(false);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  if (uploadedFile) {
    return (
      <div data-testid="uploaded-file-display" className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileCheck className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-900">{uploadedFile.name}</p>
              <p className="text-xs text-green-700">{(uploadedFile.size / 1024).toFixed(1)} KB • Uploaded successfully</p>
            </div>
          </div>
          <Button
            data-testid="button-remove-file"
            variant="ghost"
            size="sm"
            onClick={onFileRemove}
            className="text-green-600 hover:text-green-800 h-auto p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="file-upload-dropzone"
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
        isDragActive || dragActive
          ? "border-primary-400 bg-primary-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <input {...getInputProps()} data-testid="file-input" />
      <div className="flex flex-col items-center">
        <FileText className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? "Drop your transcript here" : "Drop your transcript here"}
        </p>
        <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
          <span className="bg-gray-100 px-2 py-1 rounded">.txt</span>
          <span className="bg-gray-100 px-2 py-1 rounded">.docx</span>
          <span className="bg-gray-100 px-2 py-1 rounded">.pdf</span>
        </div>
      </div>
    </div>
  );
}
