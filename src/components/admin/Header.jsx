import { useNavigate } from "react-router-dom";
import { auth } from "../../services/auth";
import { LuUser } from "react-icons/lu";

export default function Header({ title }) {
  const navigate = useNavigate();
  const merchant = auth.getMerchant();
  const name = merchant?.first_name || "";

  return (
    <header className="flex justify-between items-center p-4 sm:p-5 bg-white border-b border-gray-100 sticky top-0 z-30 w-full">

      <div className="flex items-center pl-14 lg:pl-0 transition-all duration-300">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 tracking-tight capitalize">
          {title}
        </h1>
      </div>

      {/* Right Side: Profile Actions */}
      <div className="relative">
        <button
          onClick={() => navigate("/admin/register")}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group text-left focus:outline-none"
        >
          <span className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
            <LuUser size={18} />
          </span>

          <div className="flex flex-col">
            <h4 className="text-xs sm:text-sm font-light text-gray-500 tracking-wide leading-tight">
              <span className="hidden sm:inline">Admin </span>
              <span className="text-gray-800 font-medium block sm:inline">
                {name || "Merchant"}
              </span>
            </h4>
          </div>
        </button>
      </div>
    </header>
  );
}