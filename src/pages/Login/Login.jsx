import { Button } from "antd";
import { IoMdMail } from "react-icons/io";
import { MdLockPerson } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CustomForm from "../../components/Shared/Form/CustomForm";
import CustomInput from "../../components/Shared/Input/CustomInput";
import { useLoginMutation } from "../../redux/services/auth/authApi";
import { setUser } from "../../redux/services/auth/authSlice";
import { openNotification } from "../../utilities/lib/openToaster";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (data) => {
    // const toastId = toast.loading("Logging in...");

    try {
      const res = await login(data).unwrap();

      // const user = jwtDecode(res.user);
      const userData = res?.data?.user;
      const token = res?.data.token;

      console.log(userData);

      dispatch(setUser({ user: userData, token }));
      // toast.success("Logged in successfully!", { id: toastId, duration: 2000 });
      openNotification("success", "Logged in successfully!");
      navigate(`/dashboard`);
    } catch (error) {
      // toast.error("Invalid credentials. Please try again!", {
      //   id: toastId,
      //   duration: 2000,
      // });
      openNotification("success", "Invalid credentials. Please try again!");
    }
  };

  const { primaryColor } = useSelector((state) => state.theme);

  const svgBackground = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="w-full h-auto">
    <path fill="${primaryColor}" fill-opacity="1" d="M0,320L120,293.3C240,267,480,213,720,202.7C960,192,1200,224,1320,240L1440,256L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path>
  </svg>`;

  return (
    <div
      className="h-screen"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          svgBackground
        )}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top -10vh",
      }}
    >
      <div className="flex justify-center items-center h-full">
        <div className="lg:w-[500px] md:w-[400px] p-10 bg-white rounded-md shadow-lg space-y-10">
          <div className="text-center font-bold text-xl border-gray-500">
            POS INVENTORY
          </div>
          <CustomForm
            handleSubmit={handleSubmit}
            className="flex flex-col gap-6"
            submitBtn={false}
          >
            <CustomInput
              label="Email"
              type={"email"}
              required={true}
              name={"email"}
              placeholder={"Email"}
              prefix={<IoMdMail className="text-lg" />}
            />
            <CustomInput
              label="Password"
              type={"password"}
              name={"password"}
              required={true}
              placeholder={"Password"}
              prefix={<MdLockPerson className="text-lg" />}
            />
            <Button
              htmlType="submit"
              loading={isLoading}
              className="w-full"
              type="default"
              size="large"
            >
              Enter
            </Button>
          </CustomForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
