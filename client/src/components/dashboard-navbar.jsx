import { User } from "lucide-react";

const DashboardNavbar = () => {

  const redirectToHome = () =>{
    window.location.href = "/"
  }
  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-500 p-4 flex items-center justify-end z-10">
      {/* <div>
        <h1 className="text-white text-xl font-semibold">Admin Dashboard | Sports Card Mvp</h1>
      </div> */}
      <div className="flex items-center space-x-2">
        <User className="text-white w-6 h-6" />
      </div>
      <div className="ml-2">
        <button onClick={redirectToHome} className="py-2 px-6 rounded-md bg-blue-600 text-white cursor-pointer text-sm">Back</button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
