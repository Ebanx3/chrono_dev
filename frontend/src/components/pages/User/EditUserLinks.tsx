import { useState } from "react";
import { DeleteSVG } from "../../../assets/DeleteSVG";
import { CheckSVG } from "../../../assets/CheckSVG";
import { XSVG } from "../../../assets/XSVG";

export const EditUserLinks = ({ links, setLinks }: { links: Link[], setLinks: React.Dispatch<React.SetStateAction<Link[]>> }) => {
  
  const [newLink, setNewLink] = useState<{ site: string; link: string }>({
    site: "",
    link: "",
  });
  const [showInputs, setShowInputs] = useState<boolean>(false);

  const addLink = () => {
    if (newLink.site && newLink.link) {
      if (
        !newLink.link.startsWith("http://") &&
        !newLink.link.startsWith("https://")
      ) {
        newLink.link = "https://" + newLink.link;
      }
      setLinks([...links, { site: newLink.site, link: newLink.link }]);
      setNewLink({ site: "", link: "" });
      setShowInputs(false);
    }
  };

  const removeLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  return (
    <div>
      <div className="flex justify-between items-center my-2">
        <h4 className="text-stone-500 font-medium text-sm">Links:</h4>
        <button
          type="button"
          className="border text-sm text-emerald-700 px-2 py-1 hover:bg-emerald-600 hover:text-white rounded-md cursor-pointer"
          onClick={() => setShowInputs(true)}
        >
          Agregar enlace
        </button>
      </div>

      {showInputs && (
        <div className="flex gap-2 mb-4 items-center">
          <input
            type="text"
            placeholder="Sitio (e.g., GitHub)"
            value={newLink.site}
            onChange={(e) => setNewLink({ ...newLink, site: e.target.value })}
            className="border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 p-2 transition focus:outline-none text-sm w-1/3"
          />
          <input
            type="text"
            placeholder="Enlace (e.g., github.com/username)"
            value={newLink.link}
            onChange={(e) => setNewLink({ ...newLink, link: e.target.value })}
            className="border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 p-2 transition focus:outline-none text-sm w-2/3"
          />
          <button
            className="text-red-700 cursor-pointer hover:text-red-400"
            type="button"
            onClick={() => setShowInputs(false)}
          >
            <XSVG />
          </button>
          <button
            className="text-emerald-700 cursor-pointer hover:text-emerald-400"
            type="button"
            onClick={addLink}
          >
            <CheckSVG />
          </button>
        </div>
      )}

      <div className="">
        {links.map((link, index) => (
          <div
            key={index}
            className="flex gap-2 mb-2 text-sm"
          >
            <span className="text-stone-600 w-1/7">{link.site}:</span>
            <span className="flex-1">{link.link}</span>
            <button
              onClick={() => removeLink(index)}
              className="text-red-600 flex items-center m-auto hover:text-red-400 cursor-pointer"
            >
              Eliminar
              <DeleteSVG />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
