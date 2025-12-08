import { useState } from "react";
import { CreateButton } from "../../Layout/CreateButton";
import { PostsContainer } from "./PostsContainer";
import { CreatePostModal } from "./CreatePostModal";

export const Posts = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  return (
    <>
      <title>Publicaciones</title>
      <main className="max-w-[1160px] m-auto flex flex-col">
        <CreateButton
          label="Nueva publicación"
          onClickMethod={() => {
            setShowCreatePostModal(true);
          }}
        />
        <PostsContainer />
        {showCreatePostModal && (
          <CreatePostModal closeModal={() => setShowCreatePostModal(false)} />
        )}
      </main>
    </>
  );
};
