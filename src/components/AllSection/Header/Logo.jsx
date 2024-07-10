import { useNavigate } from "react-router-dom";
import logo from "../../../assets/data/defaultLogo";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <div
      className="font-bold hover:cursor-pointer primary-text flex justify-center items-center "
      onClick={() => navigate("/dashboard")}
    >
      <img src={logo} alt="" className="w-32 h-16 object-cover" />
    </div>
  );
};

export default Logo;
