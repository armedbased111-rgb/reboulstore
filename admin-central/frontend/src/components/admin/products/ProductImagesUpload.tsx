import { useState, useRef } from 'react';
import { Upload, X, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { uploadService } from '../../../services/upload.service';
import { cn } from '../../../utils/cn';

/**
 * Interface pour une image de produit
 */
export interface ProductImage {
  id?: string;
  url: string;
  publicId?: string | null;
  alt?: string | null;
  order: number;
}

interface ProductImagesUploadProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
  className?: string;
}

/**
 * Composant pour gérer l'upload de plusieurs images de produit
 * 
 * Fonctionnalités :
 * - Upload jusqu'à maxImages (défaut: 7)
 * - Réorganisation par drag & drop ou flèches
 * - Suppression d'images
 * - Preview avec ordre
 */
export default function ProductImagesUpload({
  images,
  onChange,
  maxImages = 7,
  className,
}: ProductImagesUploadProps) {
  const [uploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const remainingSlots = maxImages - images.length;
    const filesToUpload = filesArray.slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      setUploadError(`Maximum ${maxImages} images autorisées`);
      return;
    }

    if (filesArray.length > remainingSlots) {
      setUploadError(
        `Seulement ${remainingSlots} image(s) peuvent être ajoutée(s) (maximum ${maxImages})`,
      );
    }

    setUploadError(null);

    // Upload toutes les images
    const uploadPromises = filesToUpload.map(async (file, index) => {
    try {
      const result = await uploadService.uploadImage(file);
        return {
        url: result.url,
        publicId: result.publicId || null,
        alt: null,
          order: images.length + index,
        } as ProductImage;
      } catch (err) {
        throw new Error(
          `Erreur upload ${file.name}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`,
        );
      }
    });

    try {
      const newImages = await Promise.all(uploadPromises);
      onChange([...images, ...newImages]);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Erreur lors de l\'upload',
      );
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Réordonner les images restantes
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      order: i,
    }));
    onChange(reorderedImages);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    // Réordonner
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      order: i,
    }));
    onChange(reorderedImages);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    // Réordonner
    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      order: i,
    }));
    onChange(reorderedImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Images du produit
        </label>
        <span className="text-xs text-gray-500">
          {images.length} / {maxImages}
        </span>
      </div>

      {/* Erreur */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {/* Images existantes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className="relative group border border-gray-200 rounded-md overflow-hidden bg-gray-50"
            >
              {/* Image */}
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Overlay avec actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                    {/* Réorganisation */}
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className={cn(
                          'p-1.5 bg-white rounded text-gray-700 hover:bg-gray-100',
                          index === 0 && 'opacity-50 cursor-not-allowed'
                        )}
                        title="Déplacer vers le haut"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === images.length - 1}
                        className={cn(
                          'p-1.5 bg-white rounded text-gray-700 hover:bg-gray-100',
                          index === images.length - 1 && 'opacity-50 cursor-not-allowed'
                        )}
                        title="Déplacer vers le bas"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Suppression */}
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                      title="Supprimer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Badge ordre */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zone d'upload */}
      {canAddMore && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            'relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors',
            uploadingIndex !== null
              ? 'border-gray-300 bg-gray-50 cursor-wait'
              : 'border-gray-300 hover:border-black hover:bg-gray-50',
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            disabled={uploadingIndex !== null}
          />
          {uploadingIndex !== null ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Ajouter des images
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Cliquez ou glissez-déposez une ou plusieurs images
              </p>
            </div>
          )}
        </div>
      )}

      {!canAddMore && (
        <p className="text-sm text-gray-500 text-center">
          Maximum {maxImages} images atteint
        </p>
      )}
    </div>
  );
}
