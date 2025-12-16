interface FormProps {
  children: React.ReactNode;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

}

export const Form = ({ children, handleSubmit}: FormProps) => {
  return (
    <>
      <form
        className="p-6 shadow-md hover:shadow-lg transition-shadow rounded-xl flex flex-col bg-white flex-1 max-w-lg"
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </>
  );
};
