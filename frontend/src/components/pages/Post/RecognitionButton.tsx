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
  users: string[];
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
  users,
  recognitionType,
}: RecognitionButtonProps) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [recognitionUsers, setRecognitionUsers] = useState(users);
  const { user } = useUserContext();

  const handleClickButton = async () => {
    if (!user?._id) return;
    setButtonDisabled(true);
    const res = await addOrRemoveRecognition({ postId:post._id, recognitionType });
    setButtonDisabled(false);

    if (res.success) {
      setRecognitionUsers((prev) => {
        const copy = [...prev];
        const index = copy.findIndex((id) => id === user._id);
        if (index < 0) copy.push(user._id);
        else copy.splice(index, 1);
        return copy;
      });
    }
  };

  const Icon = icons[recognitionType];
  const isActive = user !== null && recognitionUsers.includes(user._id) ;
  return (
    <button
      className={`flex gap-2 items-center p-1 rounded-lg  transition-colors
        ${solveButtonStyle(isActive, buttonDisabled || user?._id === post.authorId)}`}
      onClick={handleClickButton}
      disabled={buttonDisabled || user?._id === post.authorId}
      title={recognitionLabels[recognitionType]}
    >
      <Icon />
      {recognitionUsers.length}
    </button>
  );
};
