import { useState } from "react";
import { CreateButton } from "../../ui/CreateButton";
import { AddResourceModal } from "./AddResourceModal";

export const ProjectResources = ({resources}:{resources: Link[]}) => {
    const [showAddResourceModal, setShowAddResourceModal] = useState(false);
    const [projectResources, setProjectResources] = useState(resources);
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">

            <h2 className="text-xl font-bold text-slate-200">Recursos</h2>
            <CreateButton label="Agregar recurso" onClickMethod={() => setShowAddResourceModal(true)}/>
            </div>
            <ul className="flex flex-col gap-2">
                {projectResources.length === 0 && (
                    <li className="text-slate-400">No hay recursos disponibles.</li>
                )}
                {projectResources.map((resource, index) => (
                    <li key={index}>
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-600"
                        >
                            {resource.name}
                        </a>
                    </li>
                ))}
            </ul>
            {showAddResourceModal && (
                <AddResourceModal
                    closeModal={() => setShowAddResourceModal(false)}
                    onAddResource={(resource: Link) =>
                        setProjectResources((currentResources) => [
                            ...currentResources,
                            resource,
                        ])
                    }
                />
            )}
        </div>
    );
}