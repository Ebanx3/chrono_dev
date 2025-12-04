export const UserLinks = ({links}:{links: Link[]}) => {
  return (<div>
    <h3 className="font-semibold text-stone-600">Enlaces del usuario:</h3>
    <ul className="flex flex-col items-center gap-1 mt-2">
      {links.map((linkObj) => (
        <li key={linkObj.link}>
          <a href={linkObj.link} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-medium text-sm">
            {linkObj.site}
          </a>
        </li>
      ))}
    </ul>
  </div>);
};