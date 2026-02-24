"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

export type UploadResult = {
  url: string;
  publicId: string;
};

type Props = {
  value?: UploadResult | null;
  onUploaded: (r: UploadResult | null) => void;
  folder?: string;
  label?: string;
};

export function ImageUploader({
  value,
  onUploaded,
  folder,
  label = "Enviar foto",
}: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result as string);
    };

    reader.readAsDataURL(file);

    // permite selecionar o mesmo arquivo novamente
    e.target.value = "";
  }

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  async function createCroppedImage(): Promise<Blob | null> {
    if (!imageSrc || !croppedAreaPixels) return null;

    const image = await createImage(imageSrc);

    const canvas = document.createElement("canvas");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/jpeg",
        0.92
      );
    });
  }

  async function handleUpload(
    e?: React.MouseEvent<HTMLButtonElement>
  ) {
    e?.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const blob = await createCroppedImage();

      if (!blob)
        throw new Error("Falha ao gerar imagem.");

      const preset =
        process.env
          .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      const cloud =
        process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      if (!preset || !cloud)
        throw new Error(
          "Cloudinary não configurado."
        );

      const form = new FormData();

      form.append("file", blob, "image.jpg");
      form.append("upload_preset", preset);

      if (folder)
        form.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );

      if (!res.ok)
        throw new Error("Erro no upload.");

      const data = await res.json();

      onUploaded({
        url: data.secure_url,
        publicId: data.public_id,
      });

      setImageSrc(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);

    } catch (err: any) {

      alert(err.message);

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="space-y-3">

      {value && (
        <img
          src={value.url}
          className="w-full max-w-xs rounded-xl border"
        />
      )}

      {imageSrc ? (
        <>
          <div className="relative h-64 w-full border">

            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />

          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >

            {loading
              ? "Enviando..."
              : "Confirmar corte"}

          </button>
        </>
      ) : (

        <label className="cursor-pointer bg-black text-white px-4 py-2 rounded inline-block">

          {label}

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={onSelectFile}
          />

        </label>

      )}
    </div>
  );
}

function createImage(
  url: string
): Promise<HTMLImageElement> {

  return new Promise((resolve, reject) => {

    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = reject;

    image.src = url;

  });
}