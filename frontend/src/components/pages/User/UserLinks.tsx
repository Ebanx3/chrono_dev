export const UserLinks = ({ links }: { links: Link[] }) => {
  return (
    <div className="border-l border-slate-700 pl-4 flex flex-col gap-2">
      <h3 className="font-semibold text-slate-500">Enlaces del usuario:</h3>
      <ul className="flex flex-col items-center gap-1 mt-2">
        {links.map((linkObj) => (
          <li key={linkObj.link}>
            <a
              href={linkObj.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 underline hover:text-slate-500 font-medium text-sm"
            >
              {linkObj.site}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
