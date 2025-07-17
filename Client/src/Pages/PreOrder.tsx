import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAllMenuMutation } from "../Slice/API/userApi";
import { useEffect, useState } from "react";
import { faFire } from "@fortawesome/free-solid-svg-icons";

function PreOrder() {
  const [getall] = useGetAllMenuMutation();
  const [menu, setMenu] = useState([]);
  const [set, setSet] = useState([]);
  const [activeSection, setActiveSection] = useState("popular");

  useEffect(() => {
    const get = async () => {
      const res = await getall({});
      console.log(res);
      setMenu(res.data.menu);
      setSet(res.data.sets);
    };
    get();
  }, [getall]);
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };
  return (
    <div className=" w-fullh-[400px] mx-auto lg:w-[800px]">
      <div className="w-full mx-auto ">
        <div className="">
          <nav className="flex justify-evenly items-center border-b  ">
            <button
              onClick={() => handleSectionClick("popular")}
              className={`text-xl p-3 px-5 ${
                activeSection === "popular" ? "border-b-2" : ""
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => handleSectionClick("set")}
              className={`text-xl p-3 px-5 ${
                activeSection === "set" ? "underline" : ""
              }`}
            >
              Set
            </button>
            <button
              onClick={() => handleSectionClick("menu")}
              className={`text-xl p-3 px-5 ${
                activeSection === "menu" ? "border-b " : ""
              }`}
            >
              Menu
            </button>
          </nav>
        </div>
      </div>
      <div className="h-[600px] overflow-y-scroll">
        <h1 className="px-3 sm:px-6  text-2xl font-semibold py-2 sm:py-3 ">
        <FontAwesomeIcon icon={faFire} /> Popular
      </h1>
      <div className="px-3 sm:px-6 ">
        {set.length &&
          set.map((s, index) => (
            <div key={index} className="py-1 flex justify-between sm:py-3 border-b ">
              <div className="flex items-center gap-3">
              <img src={s.image} className="w-30" alt="" />
              <div className="w-[180px] sm:w-[300px]">
                <h1 className="font-semibold text-xl">{s.name}</h1>
                {s.sets.map((m) => {
                  console.log(m.menu);
                  return (
                    <>
                    <span key={m._id}>
                      {" "}
                      (x{m.unit_Quantity}) {m.menu.name}
                    </span>
                    
                    </>
                  );
                })}
                <p>{s.price} MMK</p>
              </div>
              </div>
              <div>
                <button>
                  button
                </button>
              </div>
            </div>
          ))}
      </div>
      <h1 className="px-3 sm:px-6  text-2xl font-semibold py-2 sm:py-3 ">
         Set
      </h1>
      <div className="px-3 sm:px-6 ">
        {set.length &&
          set.map((s, index) => (
            <div key={index} className="py-1 flex justify-between sm:py-3 border-b">
              <div className="flex items-center gap-3">
              <img src={s.image} className="w-30" alt="" />
              <div className="w-[180px] sm:w-[300px]">
                <h1 className="font-semibold text-xl">{s.name}</h1>
                {s.sets.map((m) => {
                  console.log(m.menu);
                  return (
                    <>
                    <span key={m._id}>
                      {" "}
                      (x{m.unit_Quantity}) {m.menu.name}
                    </span>
                    
                    </>
                  );
                })}
                <p>{s.price} MMK</p>
              </div>
              </div>
              <div>
                <button>
                  button
                </button>
              </div>
            </div>
          ))}
      </div>
      <h1 className="px-3 sm:px-6  text-2xl font-semibold py-2 sm:py-3 ">
         Menu
      </h1>
      <div className="px-3 sm:px-6 ">
        {menu.length &&
          menu.map((s, index) => (
            <div key={index} className="py-1 flex justify-between sm:py-3 border-b">
              <div className="flex items-center gap-3">
              <img src={s.image} className="w-30 h-20 bg-center object-cover bg-no-repeat overflow-hidden" alt="" />
              <div className="w-[180px] sm:w-[300px]">
                <h1 className="font-semibold text-xl">{s.name}</h1>
                
                <p>{s.price} MMK</p>
              </div>
              </div>
              <div>
                <button>
                  button
                </button>
              </div>
            </div>
          ))}
      </div>
      </div>
      
    </div>
  );
}

export default PreOrder;
