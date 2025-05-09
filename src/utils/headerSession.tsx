/// <reference no-default-lib="true"/>
 
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
export default function HeaderSession({title}) {
  const navigate = useNavigate();

  return (
    <div className="my-8  border-none">
      <h1 className=" text-xl md:text-2xl font-semibold pb-4 border-b-[#E12025] border-b-[2px] ">
        <IconButton
          onClick={() => navigate(-1)}
          style={{ marginRight: 15 }}
          title="Voltar"
        >
          <IoArrowBack />
        </IconButton>
        <span>{title}</span>
      </h1>
    </div>
  );
}
