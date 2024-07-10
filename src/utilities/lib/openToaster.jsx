import toast from "react-hot-toast";
import logo from "../../assets/data/defaultLogo";

const typeToColor = {
  success: "text-green-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
  failed: "text-red-600",
};

export const openNotification = (type, message) => {
  const colorClass = typeToColor[type] || "text-gray-600";
  const typeText = type.charAt(0).toUpperCase() + type.slice(1);

  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      aria-live="assertive"
      role="alert"
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img className="h-10 w-10 rounded-full" src={logo} alt="Logo" />
          </div>
          <div className="ml-3 flex-1">
            <span className={colorClass}>{typeText}</span>
            <p className="mt-1 text-sm text-gray-500">
              {message ?? "No Message is provided. Task Completed Successfully"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  ));
};
