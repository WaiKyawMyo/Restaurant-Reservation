import { useState } from "react";
import { Link, NavLink } from "react-router";
import Logo from '../../assets/Logo.svg'
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useLogoutMutation } from "../../Slice/API/userApi";
import { clearUserInfo } from "../../Slice/auth";
import { toast } from "react-toastify";
import Profile from "./Profile";
import Changepassword from "./Changepassword";



function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userinfo,setUserInfo]= useState(false)
  const [profilebtn,setProfilebtn]= useState(false)
  const [changePW,SetChangePW]=useState(false)
  const userInfo = useSelector((state:RootState)=>state.auth.userInfo)
  function displayName(fullName) {
  if (!fullName || typeof fullName !== 'string') return '';
  const names = fullName.trim().split(' ');
  if (names.length > 1) {
    return `${names[0]} ${names[names.length - 1][0]}.`;
  }
  return names[0];
}
  const dispath= useDispatch()
  const [logout,{isLoading} ] = useLogoutMutation()
  const logoutsubmit = async()=>{
    await logout({}).unwrap()
    dispath(clearUserInfo())
    toast.success('Successfully logged out.')
  }
 

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm ">
      <nav className="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between">
        {/* Brand */}
        <Link className="sm:order-1 flex-none text-xl font-semibold w-24" to="/">
         <img src={Logo} alt="" />
        </Link>
        <div className="sm:order-3 flex items-center gap-x-2">
          {/* Hamburger for mobile */}
          <button 
            type="button"
            className="sm:hidden size-9 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:bg-gray-50"
            aria-expanded={mobileMenuOpen ? "true" : "false"}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {/* Hamburger Icon */}
            <svg
              className={!mobileMenuOpen ? "block size-4" : `hidden `}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
            {/* Close Icon */}
            <svg
              className={mobileMenuOpen ? `block size-4` : `hidden `}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span className="sr-only">Toggle</span>
          </button>
           { userInfo ? 
          <div className=" ">
              <button onClick={()=>setUserInfo(prev=>!prev)} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded cursor-pointer">
                {displayName(userInfo.username)}
            </button>
            
              <div className={`absolute  right-4 mt-2 bg-gray-500 divide-y divide-gray-100 rounded-lg shadow-sm w-44 ${userinfo ?'' : 'hidden'} z-10`}>
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div>{userInfo.username}</div>
                    <div className="font-medium truncate">{userInfo.email}</div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
                    <li>
                      <a onClick={()=>setProfilebtn((prev)=>!prev)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Profile</a>
                    </li>
                    <li>
                      <a onClick={()=>SetChangePW(true)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Change Password</a>
                    </li>
                    
                  </ul>
                  <div className="py-2">
                    <button disabled={isLoading} onClick={logoutsubmit} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-red-400 dark:text-gray-200 dark:hover:text-white w-full cursor-pointer">Sign out</button>
                  </div>
              </div>
            </div>
             :<Link to={'/login'} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded ">
                Log in
            </Link>}
        </div>
        <div
          id="mobile-menu"
          className={`
            transition-all duration-300 basis-full grow sm:grow-0 sm:basis-auto sm:block sm:order-2
            ${mobileMenuOpen ? "block" : "hidden"}
          `}
        >
          <div className={`flex flex-col gap-5 p-2 mt-5 sm:flex-row sm:items-center sm:mt-0 sm:ps-5  `}>
            <NavLink
              className={({ isActive }) =>
                "font-medium " +
                (isActive ? "text-[#D32F2F] font-bold text-xl" : "text-gray-600 font-bold text-xl hover:text-gray-400")
              }
              to="/"
              end
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                "font-medium " +
                (isActive ? "text-[#D32F2F] font-bold text-xl " : "font-bold text-xl text-gray-600 hover:text-gray-400")
              }
              to="/our-menu"
            >
              Menu
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                "font-medium " +
                (isActive ? "text-[#D32F2F] font-bold text-xl" : "font-bold text-xl text-gray-600 hover:text-gray-400")
              }
              to="/work"
            >
              Work
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                "font-medium " +
                (isActive ? "text-[#D32F2F] font-bold text-xl" : "font-bold text-xl text-gray-600 hover:text-gray-400")
              }
              to="/my-reservaton"
            >
              My Reservation
            </NavLink>
          </div>
        </div>
      </nav>
      {profilebtn? <Profile setProfilebtn={setProfilebtn}/> : <></>}
      {changePW? <Changepassword SetChangePW={SetChangePW}/> :<></>}
    </header>
  );
}

export default Header;