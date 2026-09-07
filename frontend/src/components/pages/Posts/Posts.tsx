import { useState } from "react";
import { CreateButton } from "../../ui/CreateButton";
import { PostsContainer } from "./PostsContainer";
import { CreatePostModal } from "./CreatePostModal";

export const Posts = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  return (
    <>
      <title>Publicaciones</title>
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
    </>
  );
};
