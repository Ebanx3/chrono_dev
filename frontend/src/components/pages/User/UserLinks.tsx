export const UserLinks = ({links}:{links: Link[]}) => {
  return (<div>
    <h3 className="font-semibold">Enlaces del usuario:</h3>
    <ul>
      {links.map((linkObj) => (
        <li key={linkObj.link}>
          <a href={linkObj.link} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
            {linkObj.site}
          </a>
        </li>
      ))}
    </ul>
  </div>);
};