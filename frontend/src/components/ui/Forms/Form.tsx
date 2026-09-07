interface FormProps {
  children: React.ReactNode;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

}

export const Form = ({ children, handleSubmit}: FormProps) => {
  return (
      <form
        className="p-6 rounded-xl flex flex-col flex-1 max-w-lg bg-slate-800"
        onSubmit={handleSubmit}
      >
        {children}
      </form>
  );
};
