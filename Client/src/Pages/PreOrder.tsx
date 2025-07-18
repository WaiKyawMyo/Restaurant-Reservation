import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAllMenuMutation } from "../Slice/API/userApi";
import { useEffect, useState, useRef } from "react";
import { faFire } from "@fortawesome/free-solid-svg-icons";

function PreOrder() {
  const [getall] = useGetAllMenuMutation();
  const [menu, setMenu] = useState([]);
  const [set, setSet] = useState([]);
  const [activeSection, setActiveSection] = useState("popular");

  const [loading,setLoading]=useState(false)
  // Create refs for each section
  const popularRef = useRef(null);
  const setRef = useRef(null);
  const menuRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setLoading(true)
    const get = async () => {
      const res = await getall({});
      
      setMenu(res.data.menu);
      setSet(res.data.sets);
      setLoading(false)
    };
    get();
    
  }, [getall]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    
    // Scroll to the corresponding section within the scrollable container
    let targetRef;
    switch (section) {
      case "popular":
        targetRef = popularRef;
        break;
      case "set":
        targetRef = setRef;
        break;
      case "menu":
        targetRef = menuRef;
        break;
      default:
        return;
    }

    if (targetRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const target = targetRef.current;
      
      // Calculate the position to scroll to
      const targetPosition = target.offsetTop - container.offsetTop;
      
      // Smooth scroll to the target position
      container.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="w-full  mx-auto lg:w-[800px]">
      {/* Fixed Navigation Bar */}
      <div className="w-full mx-auto">
        <div className="">
          <nav className="flex justify-evenly items-center border-b bg-white sticky top-0 z-10">
            <button
              onClick={() => handleSectionClick("popular")}
              className={`text-xl p-3 px-5 ${
                activeSection === "popular" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => handleSectionClick("set")}
              className={`text-xl p-3 px-5 ${
                activeSection === "set" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              Set
            </button>
            <button
              onClick={() => handleSectionClick("menu")}
              className={`text-xl p-3 px-5 ${
                activeSection === "menu" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              Menu
            </button>
          </nav>
        </div>
      </div>{/* Scrollable Content Area */} 
{!loading ?
         
        <div 
        ref={scrollContainerRef}
        className="h-[600px] overflow-y-scroll"
      >
        {/* Popular Section */}
        <h1 ref={popularRef} className="px-3 sm:px-6 text-2xl font-semibold py-2 sm:py-3">
          <FontAwesomeIcon icon={faFire} /> Popular
        </h1>
        <div className="px-3 sm:px-6">
          {set.length &&
            set.map((s, index) => (
              <div key={index} className="py-1 flex justify-between sm:py-3 border-b">
                <div className="flex items-center gap-3">
                  <img src={s.image} className="w-30" alt="" />
                  <div className="w-[180px] sm:w-[300px]">
                    <h1 className="font-semibold text-xl">{s.name}</h1>
                    {s.sets.map((m) => {
                      return (
                        <span key={m._id}>
                          {" "}
                          (x{m.unit_Quantity}) {m.menu.name}
                        </span>
                      );
                    })}
                    <p>{s.price} MMK</p>
                  </div>
                </div>
                <div>
                  <button>button</button>
                </div>
              </div>
            ))}
        </div>

        {/* Set Section */}
        <h1 ref={setRef} className="px-3 sm:px-6 text-2xl font-semibold py-2 sm:py-3">
          Set
        </h1>
        <div className="px-3 sm:px-6">
          {set.length &&
            set.map((s, index) => (
              <div key={index} className="py-1 flex justify-between sm:py-3 border-b">
                <div className="flex items-center gap-3">
                  <img src={s.image} className="w-30" alt="" />
                  <div className="w-[180px] sm:w-[300px]">
                    <h1 className="font-semibold text-xl">{s.name}</h1>
                    {s.sets.map((m) => {
                      return (
                        <span key={m._id}>
                          {" "}
                          (x{m.unit_Quantity}) {m.menu.name}
                        </span>
                      );
                    })}
                    <p>{s.price} MMK</p>
                  </div>
                </div>
                <div>
                  <button>button</button>
                </div>
              </div>
            ))}
        </div>

        {/* Menu Section */}
        <h1 ref={menuRef} className="px-3 sm:px-6 text-2xl font-semibold py-2 sm:py-3">
          Menu
        </h1>
        <div className="px-3 sm:px-6">
          {menu.length &&
            menu.map((s, index) => (
              <div key={index} className="py-1 flex justify-between sm:py-3 border-b">
                <div className="flex items-center gap-3">
                  <img 
                    src={s.image} 
                    className="w-30 h-20 bg-center object-cover bg-no-repeat overflow-hidden" 
                    alt="" 
                  />
                  <div className="w-[180px] sm:w-[300px]">
                    <h1 className="font-semibold text-xl">{s.name}</h1>
                    <p>{s.price} MMK</p>
                  </div>
                </div>
                <div>
                  <button>button</button>
                </div>
              </div>
            ))}
        </div>
      </div> :<div role="static " className="p-4 flex items-center justify-center">
    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div> }
    </div>
  );
}

export default PreOrder;