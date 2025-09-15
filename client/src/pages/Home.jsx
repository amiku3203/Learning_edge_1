import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { RiAiGenerate2 } from "react-icons/ri";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import toast from "react-hot-toast";
import { BsCollection } from "react-icons/bs";
const Home = () => {
  const navigate = useNavigate();
  const navItem = [
    {
      Name: "Analytics",
      icons: <TbBrandGoogleAnalytics />,
      path: "analytics",
    },
    {
      Name: "Clients",
      icons: <FaUserPlus />,
      path: "clients",
    },
     {
      Name: "Biller",
      icons: <FaUserPlus />,
      path: "biller",
    },
     {
      Name: "All Invoice",
      icons: <BsCollection />,
      path: "allinvoice",
    },
    {
      Name: "Generate Invoice",
      icons: <RiAiGenerate2 />,
      path: "invoice",
    },
    {
      Name: "Subscription",
      icons: <MdOutlineSubscriptions />,
      path: "subscription",
    },
  ];

  const onLogout = () => {
    localStorage.clear();
    toast.success("Logout Succefully");
    navigate("/login");
  };
  return (
    <div className="bg-gray-200 h-screen shadow-xl flex">
      <aside className="w-40 h-screen bg-black shadow-2xl flex  flex-col justify-between fixed top-0 left-0">
        <ul>
          {navItem?.map((nav) => (
            <li key={nav.Name}>
              <NavLink
                to={nav.path}
                className={({ isActive }) =>
                  `flex p-4 items-center gap-x-4 cursor-pointer border-b-1 border-b-gray-500 text-white ${
                    isActive ? "bg-gray-800" : ""
                  }`
                }
              >
                <span>{nav.icons}</span>
                <span>{nav.Name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="p-4 ">
          <button
            className="text-red-500 flex items-center gap-x-2 cursor-pointer  "
            onClick={onLogout}
          >
            <span>
              <IoMdLogOut />
            </span>
            LogOut
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-40 p-6 overflow-y-auto bg-gray-200">
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
