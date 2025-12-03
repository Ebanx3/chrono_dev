import { ClosedEye } from "../../assets/ClosedEye";
import { OpenEye } from "../../assets/OpenEye";

interface Props {
  isPassVisible: boolean;
  setIsPassVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShowPasswordButton = ({
  isPassVisible,
  setIsPassVisible,
}: Props) => {
  return (
    <button
      className="absolute right-2 bottom-2 text-stone-600 hover:text-emerald-500 cursor-pointer"
      onClick={() => setIsPassVisible((value) => !value)}
      type="button"
    >
      {!isPassVisible ? <ClosedEye /> : <OpenEye />}
    </button>
  );
};
