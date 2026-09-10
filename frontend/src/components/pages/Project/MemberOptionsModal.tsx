import { useState } from "react";
import { toast } from "sonner";
import { editMember, removeMember } from "../../../api/project";
import { Form } from "../../ui/Forms/Form";
import { LoaderSVG } from "../../../assets/LoaderSVG";

const permissionLabels: Record<ProjectPermission, string> = {
  "project.pending_members.view": "Ver solicitudes pendientes",
  "project.members.invite": "Invitar miembros",
  "project.members.accept": "Aceptar miembros",
  "project.members.remove": "Expulsar miembros",
  "project.members.edit_role": "Editar roles y permisos",
  "project.members.ban": "Bloquear miembros",
  "project.details.edit": "Editar detalles del proyecto",
  "project.resources.add": "Agregar recursos",
  "project.resources.remove": "Eliminar recursos",
  "project.resources.edit": "Editar recursos",
  "project.tickets.create": "Crear tickets",
  "project.tickets.edit": "Editar tickets",
  "project.tickets.delete": "Eliminar tickets",
  "project.tickets.request": "Solicitar tickets",
  "project.tickets.assign": "Asignar tickets",
  "project.activity.add": "Agregar actividad",
  "project.activity.edit": "Editar actividad",
  "project.activity.delete": "Eliminar actividad",
};

interface MemberOptionsModalProps {
  projectId: string;
  member: ProjectMember;
  canEditOptions: boolean;
  canRemoveMember: boolean;
  closeModal: VoidFunction;
  refetchProject: () => void;
}

export const MemberOptionsModal = ({
  projectId,
  member,
  canEditOptions,
  canRemoveMember,
  closeModal,
  refetchProject,
}: MemberOptionsModalProps) => {
  const [role, setRole] = useState(member.role || "");
  const [permissions, setPermissions] = useState<ProjectPermission[]>(member.permissions || []);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const togglePermission = (permission: ProjectPermission) => {
    setPermissions((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission],
    );
  };

  const saveChanges = async () => {
    if (!canEditOptions) return;
    if (!role.trim()) {
      toast.error("El rol no puede estar vacío");
      return;
    }

    setIsLoading(true);
    const result = await editMember({
      projectId,
      userId: member.user._id,
      role: role.trim(),
      permissions,
    });
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Opciones del miembro actualizadas");
    refetchProject();
    closeModal();
  };

  const handleRemove = async () => {
    setIsLoading(true);
    const result = await removeMember(projectId, member.user._id);
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Miembro expulsado del proyecto");
    refetchProject();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <Form handleSubmit={(event) => { event.preventDefault(); void saveChanges(); }}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Opciones de miembro</h2>
            <p className="mt-1 text-sm text-slate-400">{member.user.username}</p>
          </div>
          <button type="button" onClick={closeModal} className="text-2xl leading-none text-slate-400 hover:text-slate-100" aria-label="Cerrar">
            ×
          </button>
        </div>

        {canEditOptions && <>
        <label htmlFor="member-role" className="mb-1 text-sm font-medium text-slate-400">Rol</label>
        <input
          id="member-role"
          list="project-roles"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="mb-5 rounded-md border border-slate-700 bg-slate-900 p-2 text-slate-200 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400"
          placeholder="Ej. Diseñador"
        />
  

        <fieldset className="mb-5 max-h-64 overflow-y-auto rounded-md border border-slate-700 p-3">
          <legend className="px-1 text-sm font-medium text-slate-400">Permisos</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(permissionLabels) as ProjectPermission[]).map((permission) => (
              <div key={permission} className="flex items-center justify-between gap-3 text-sm text-slate-300">
                <span>{permissionLabels[permission]}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={permissions.includes(permission)}
                  aria-label={`Cambiar permiso: ${permissionLabels[permission]}`}
                  onClick={() => togglePermission(permission)}
                  className={`relative h-4 w-7 shrink-0 overflow-hidden rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                    permissions.includes(permission) ? "bg-purple-600" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-[left] ${
                      permissions.includes(permission) ? "left-[14px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </fieldset>
        </>}

        {canRemoveMember && (confirmRemove ? (
          <div className="mb-4 rounded-md border border-red-900/70 bg-red-950/40 p-3 text-sm text-red-200">
            <p>¿Expulsar a <strong>{member.user.username}</strong> del proyecto?</p>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmRemove(false)} className="rounded-md bg-slate-700 px-3 py-2 text-slate-300 hover:bg-slate-600">Cancelar</button>
              <button type="button" onClick={() => void handleRemove()} disabled={isLoading} className="rounded-md bg-red-700 px-3 py-2 font-semibold text-white hover:bg-red-600 disabled:opacity-60">Expulsar</button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmRemove(true)} className="mb-4 self-start text-sm font-medium text-red-400 hover:text-red-300">Expulsar miembro</button>
        ))}

        {isLoading ? <div className="flex h-10 justify-center"><LoaderSVG /></div> : canEditOptions ? (
          <div className="flex justify-between gap-3">
            <button type="button" onClick={closeModal} className="rounded-md bg-slate-700 p-2 text-slate-300 hover:bg-slate-600">Cancelar</button>
            <button type="submit" className="rounded-md bg-purple-600 p-2 font-semibold text-white hover:brightness-110">Guardar cambios</button>
          </div>
        ) : null}
      </Form>
    </div>
  );
};