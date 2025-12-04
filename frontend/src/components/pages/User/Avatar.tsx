import { useState } from "react";
import NoAvatar from "../../../assets/no-avatar.png";
import { UploadImgSVG } from "../../../assets/UploadImgSVG";
import { uploadPicture } from "../../../api/uploadPicture";
import { toast } from "sonner";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { updateAvatar } from "../../../api/user";
import { processImage } from "../../../utils/adjustAvatar";

export const Avatar = ({
  url,
  canEdit,
}: {
  url?: string;
  canEdit: boolean;
}) => {
  const [avatarUrl, setAvatarUrl] = useState(url);
  const [previousUrl, setPreviousUrl] = useState<string|null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [showModalConfirmChange, setShowModalConfirmChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const uploadAvatar = async () => {
    setIsLoading(true);

    const processedFile = await processImage(newAvatarFile!);
    const response = await uploadPicture(processedFile);

    if (response === null) {
      toast.error("Hubo un error subiendo la imagen. Intenta nuevamente.");
    } else {
      const res = await updateAvatar(response);
      if (!res.success) {
        toast.error(
          "Hubo un error actualizando el avatar. Intenta nuevamente."
        );
      } else {
        toast.success("Avatar actualizado correctamente.");
      }
    }
    setIsLoading(false);
    setShowModalConfirmChange(false);
  };

  return (
    <div className="size-64 rounded-full border border-stone-200 overflow-hidden relative group">
      <img
        src={avatarUrl ?? NoAvatar}
        alt="user avatar"
        className="size-full object-cover"
      />
      {canEdit && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-10">
          <label
            className="text-white font-medium cursor-pointer hover:bg-black rounded-full p-2"
            htmlFor="uploadAvatar"
          >
            <input
              type="file"
              className="hidden"
              id="uploadAvatar"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => {
                setPreviousUrl(avatarUrl || null);
                setAvatarUrl(URL.createObjectURL(e.target.files![0]));
                setNewAvatarFile(e.target.files![0]);
                setTimeout(() => {
                  setShowModalConfirmChange(true);
                }, 1000);
              }}
            />
            <UploadImgSVG />
          </label>
        </div>
      )}
      {showModalConfirmChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Confirmar cambio de avatar
            </h2>
            <p className="mb-4">
              ¿Estás seguro de que deseas cambiar tu avatar?
            </p>
            <div className="flex justify-end gap-4">
              {isLoading ? (
                <div className="self-center h-10">
                  <LoaderSVG />
                </div>
              ) : (
                <>
                  <button
                    className="px-4 py-2 bg-stone-200 rounded hover:bg-stone-300 cursor-pointer"
                    onClick={() => {
                      setAvatarUrl(previousUrl || undefined);
                      setShowModalConfirmChange(false);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                    onClick={uploadAvatar}
                  >
                    Confirmar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
