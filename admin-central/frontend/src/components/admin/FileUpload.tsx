import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { uploadService } from '../../services/upload.service';
import { cn } from '../../utils/cn';

interface FileUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  type?: 'image' | 'video';
  accept?: string;
  className?: string;
  helpText?: string;
}

/**
 * Composant d'upload de fichier vers Cloudinary
 */
export default function FileUpload({
  label,
  value,
  onChange,
  type = 'image',
  accept,
  className,
  helpText,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const result =
        type === 'image'
          ? await uploadService.uploadImage(file)
          : await uploadService.uploadVideo(file);
      onChange(result.url);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Erreur lors de l\'upload',
      );
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setUploadError(null);
  };

  const defaultAccept =
    type === 'image'
      ? 'image/jpeg,image/jpg,image/png,image/webp,image/gif'
      : 'video/mp4,video/webm,video/ogg';

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {value ? (
        <div className="relative">
          {type === 'image' ? (
            <div className="relative group">
              <img
                src={value}
                alt="Preview"
                className="w-full h-32 sm:h-48 object-cover rounded-md border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative group">
              <video
                src={value}
                controls
                className="w-full h-32 sm:h-48 object-cover rounded-md border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="mt-1 text-xs text-gray-500 truncate">{value}</p>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors',
            isUploading
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-300 hover:border-black hover:bg-gray-50',
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept || defaultAccept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {type === 'image' ? (
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              ) : (
                <Video className="w-8 h-8 text-gray-400 mb-2" />
              )}
              <p className="text-sm text-gray-600">
                Cliquez pour {type === 'image' ? 'uploader une image' : 'uploader une vidéo'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ou glissez-déposez le fichier ici
              </p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}

      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}

      {value && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm text-black hover:text-gray-700 underline"
          disabled={isUploading}
        >
          Remplacer
        </button>
      )}
    </div>
  );
}
