import { useState } from "react";
import { useUserContext } from "../../../hooks/useUserContext";
import { Document } from "../../../assets/recognitions/Document";
import { InspirationSVG } from "../../../assets/recognitions/InspirationSVG";
import { Light } from "../../../assets/recognitions/Light";
import { Tool } from "../../../assets/recognitions/Tool";
import { Mentor } from "../../../assets/recognitions/Mentor";
import { addOrRemoveRecognition } from "../../../api/post";
import { LikeEmptySVG } from "../../../assets/LikeEmptySVG";

const icons = {
  documentation: Document,
  inspiration: InspirationSVG,
  innovation: Light,
  resolution: Tool,
  mentorship: Mentor,
  likes: LikeEmptySVG
};

const recognitionLabels: Record<RecognitionType, string> = {
  mentorship: "Mentoría técnica",
  documentation: "Documentación clara",
  innovation: "Idea innovadora",
  resolution: "Resolución efectiva",
  inspiration: "Inspiración creativa",
  likes: "Me gusta",
};

export type RecognitionType = keyof typeof icons;

interface RecognitionButtonProps {
  post: Post;
  recognitionType: RecognitionType;
}

const solveButtonStyle = (isActive:boolean, isDisabled:boolean) => {
  if(isDisabled){
    return "text-slate-400";
  }
  if(isActive) return "text-purple-400 hover:bg-purple-950 cursor-pointer";
  return "hover:bg-slate-800 text-slate-400 cursor-pointer"
}

export const RecognitionButton = ({
  post,
  recognitionType,
}: RecognitionButtonProps) => {
  const initialState =
    recognitionType === "likes"
      ? post.likes
      : post.recognitions[recognitionType];
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [count, setCount] = useState(initialState.count);
  const [isActive, setIsActive] = useState(initialState.byMe);
  const { user } = useUserContext();

  const handleClickButton = async () => {
    if (!user?._id) return;
    setButtonDisabled(true);
    try {
      const res = await addOrRemoveRecognition({ postId: post._id, recognitionType });
      if (res.success) {
        setCount((currentCount) => currentCount + (isActive ? -1 : 1));
        setIsActive(!isActive);
      }
    } finally {
      setButtonDisabled(false);
    }
  };

  const Icon = icons[recognitionType];
  return (
    <button
      className={`flex gap-2 items-center p-1 rounded-lg  transition-colors
        ${solveButtonStyle(isActive, buttonDisabled || post.isMine)}`}
      onClick={handleClickButton}
      disabled={buttonDisabled || post.isMine}
      aria-pressed={isActive}
      title={recognitionLabels[recognitionType]}
    >
      <Icon />
      {count}
    </button>
  );
};
