
import { useFetch } from "../../../hooks/useFetch";
import { useParams } from "react-router-dom";
import { FlowComponent } from "./FlowComponent";
import { LoaderSVG } from "../../../assets/LoaderSVG";

export const Project = () => {
  const { projectId } = useParams();
  const { data, loading, error } = useFetch<Project>(`/project/${projectId}`);

 if (error) {
     return (
       <div className="text-center">
         Hubo un error intentando traer el proyecto.
       </div>
     );
   }
 
   if (loading) {
     return (
       <>
         <title>Chrono-dev</title>
         <div className="w-full flex justify-center mt-10">
           <LoaderSVG />
         </div>
       </>
     );
   }


  return (
    <>
      <main className="w-full h-[calc(100vh-72px)] bg-stone-100">
        <FlowComponent project={data!}/>
      </main>
    </>
  );
};
