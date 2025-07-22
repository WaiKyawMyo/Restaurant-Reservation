import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCreateOrderMutation, useGetAllMenuMutation } from "../Slice/API/userApi";
import { useEffect, useState, useRef, useCallback } from "react";
import { faCartPlus, faFire, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from "react-router";
// Run this once in your application or as a separate script


// Connect to your database first, then run:


// --- TypeScript Interfaces ---
interface MenuItem {
  _id: string;
  name: string;
  type: string;
  price: number;
  is_available: boolean;
  image?: string;
  cloudinary_id?: string;
}

interface SetMenuItem {
  _id: string;
  menu?: MenuItem;
  quantity: number;
}

interface Set {
  _id: string;
  name: string;
  price: number;
  image?: string;
  menu_items?: SetMenuItem[];
  is_available: boolean;
}

interface OrderItemState {
  itemId: string;
  itemType: 'menu' | 'set';
  quantity: number;
  price: number;
}

interface ApiResponse {
  data?: {
    menu?: MenuItem[];
    sets?: Set[];
  };
}

function PreOrder() {
  const [getall] = useGetAllMenuMutation();
  const [createOrderMutation] = useCreateOrderMutation();
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [sets, setSets] = useState<Set[]>([]);
  const [activeSection, setActiveSection] = useState("popular");
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItemState[]>([]);
  const [orderLoading,setOrderLoading]=useState(false)
  const { id } = useParams<{ tableId: string }>();
  const [payment,setPayment]= useState(true)

  // Refs for scrolling
  const popularRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res: ApiResponse = await getall({});
        console.log(sets)
        if (res?.data) {
          setMenuItems(res.data.menu || []);
          setSets(res.data.sets || []);
        } else {
          console.error("API response did not contain expected data.");
          toast.error("Failed to load menu items.");
        }
        console.log(sets)
      } catch (error) {
        console.error("Error fetching menu:", error);
        toast.error("Error fetching menu items. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getall]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      const popular = popularRef.current;
      const setSection = setRef.current;
      const menuSection = menuRef.current;
     
      if (!container || !popular || !setSection || !menuSection) return;

      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      
      const popularPos = popular.offsetTop - container.offsetTop;
      const setPos = setSection.offsetTop - container.offsetTop;
      const menuPos = menuSection.offsetTop - container.offsetTop;

      const threshold = containerHeight * 0.3;

      if (scrollTop + threshold >= menuPos) {
        setActiveSection("menu");
      } else if (scrollTop + threshold >= setPos) {
        setActiveSection("set");
      } else {
        setActiveSection("popular");
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [loading]);

  // Handle section navigation
  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    let targetRef: React.RefObject<HTMLDivElement> | null = null;
    
    switch (section) {
      case "popular": targetRef = popularRef; break;
      case "set": targetRef = setRef; break;
      case "menu": targetRef = menuRef; break;
      default: return;
    }

    if (targetRef?.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const target = targetRef.current;
      const targetPosition = target.offsetTop - container.offsetTop;
      container.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  };

  // FIXED: Update order item quantity (prevents double increment)
  const updateOrderItem = useCallback((itemId: string, itemType: 'menu' | 'set', change: number) => {
    setOrderItems(currentOrderItems => {
      const existingItemIndex = currentOrderItems.findIndex(
        (item) => item.itemId === itemId && item.itemType === itemType
      );

      const updatedOrderItems = [...currentOrderItems];

      if (existingItemIndex > -1) {
        const newQuantity = updatedOrderItems[existingItemIndex].quantity + change;
        if (newQuantity > 0) {
          updatedOrderItems[existingItemIndex] = {
            ...updatedOrderItems[existingItemIndex],
            quantity: newQuantity
          };
        } else {
          updatedOrderItems.splice(existingItemIndex, 1);
        }
      } else if (change > 0) {
        let price = 0;
        if (itemType === 'menu') {
          const menuItem = menuItems.find(menu => menu._id === itemId);
          price = menuItem?.price ?? 0;
        } else if (itemType === 'set') {
          const setItem = sets.find(set => set._id === itemId);
          price = setItem?.price ?? 0;
        }
        
        updatedOrderItems.push({
          itemId: itemId,
          itemType: itemType,
          quantity: 1,
          price: price
        });
      }
      return updatedOrderItems;
    });
  }, [menuItems, sets]);

  // FIXED: Add item function (prevents double clicks)
  const handleAddItem = useCallback((itemId: string, itemType: 'menu' | 'set') => {
    updateOrderItem(itemId, itemType, 1);
  }, [updateOrderItem]);

  // FIXED: Remove item function (prevents double clicks)
  const handleRemoveItem = useCallback((itemId: string, itemType: 'menu' | 'set') => {
    updateOrderItem(itemId, itemType, -1);
  }, [updateOrderItem]);

  // Get item quantity
  const getItemQuantity = (itemId: string, itemType: 'menu' | 'set'): number => {
    const item = orderItems.find(i => i.itemId === itemId && i.itemType === itemType);
    return item ? item.quantity : 0;
  };

  // Handle order confirmation
  const handleConfirmOrder = async () => {
    setOrderLoading(true)
    if (orderItems.length === 0) {
      toast.warn("Please add items to your order!");
       setOrderLoading(false)
      return;
    }

    if (!id) {
      toast.error("Table selection is required for ordering!");
      setOrderLoading(false)
      return;
    }
    let payload
   if(location.state.reservation_id){
     payload = {
    table_id: id,
    reservation_id:location.state.reservation_id ,
    order_items: orderItems.map(item => {
      const orderItemPayload: any = { quantity: item.quantity };
      if (item.itemType === 'menu') {
        orderItemPayload.menu_id = item.itemId;
      } else if (item.itemType === 'set') {
        orderItemPayload.set_id = item.itemId;
      }
      return orderItemPayload;
    }).filter(item => item.menu_id || item.set_id),
  };
   } else{
    payload = {
    table_id: id,
    reservation_id:location.state.reservation_id2 ,
    order_items: orderItems.map(item => {
      const orderItemPayload: any = { quantity: item.quantity };
      if (item.itemType === 'menu') {
        orderItemPayload.menu_id = item.itemId;
      } else if (item.itemType === 'set') {
        orderItemPayload.set_id = item.itemId;
      }
      return orderItemPayload;
    }).filter(item => item.menu_id || item.set_id),
  };
   }
   
    console.log("Payload being sent:", JSON.stringify(payload, null, 2)); // <--- ADD THIS LINE

  if (payload.order_items.length === 0) {
    toast.error("No valid items in the order!");
    setOrderLoading(false)
    return;
  }

    try {
      const response = await createOrderMutation(payload).unwrap(); 
      toast.success("Order placed successfully!");
      // navigate('/');
      toast.success(response.message)
      setOrderItems([]);
      setOrderLoading(false)
    } catch (error: any) {
      console.error("Error creating order:", error);
      const errorMessage = error?.data?.message || error?.message || "Failed to place order";
      toast.error(errorMessage);
      setOrderLoading(false)
    }
  };

  // FIXED: Render quantity controls (prevents double increment/decrement)
  const renderQuantityControls = useCallback((itemId: string, itemType: 'menu' | 'set') => {
    const quantity = getItemQuantity(itemId, itemType);
    const isItemInOrder = quantity > 0;

    return (
      <div 
        className="flex flex-col items-center gap-2"
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
      >
        {!isItemInOrder ? (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddItem(itemId, itemType);
            }}
            className="cursor-pointer p-2 px-3 rounded-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm"
            type="button"
          >
            <FontAwesomeIcon className="mr-2" icon={faCartPlus} /> 
            Add
          </button>
        ) : (
          <div className="flex items-center ">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveItem(itemId, itemType);
              }}
              className="p-1 px-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              type="button"
            >
              <FontAwesomeIcon icon={faMinus} size="sm"/>
            </button>
            <span className="text-lg font-semibold min-w-[2rem] text-center">
              {quantity}
            </span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddItem(itemId, itemType);
              }}
              className="p-1 px-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
              type="button"
            >
              <FontAwesomeIcon icon={faPlus} size="sm"/>
            </button>
          </div>
        )}
      </div>
    );
  }, [handleAddItem, handleRemoveItem, orderItems]);

  return (
    <div>
     {!payment ? <div className="w-full mx-auto lg:w-[800px] relative">
        {/* Navigation Bar */}
        <div className="w-full mx-auto sticky top-0 z-10 bg-white border-b">
          <nav className="flex justify-evenly items-center p-3">
            <button
              onClick={() => handleSectionClick("popular")}
              className={`text-xl p-3 px-5 rounded-md transition-all duration-200 cursor-pointer ${
                activeSection === "popular" ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
              type="button"
            >
              Popular
            </button>
            <button
              onClick={() => handleSectionClick("set")}
              className={`text-xl p-3 px-5 rounded-md transition-all duration-200 cursor-pointer ${
                activeSection === "set" ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
              type="button"
            >
              Set
            </button>
            <button
              onClick={() => handleSectionClick("menu")}
              className={`text-xl p-3 px-5 rounded-md transition-all duration-200 cursor-pointer ${
                activeSection === "menu" ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-100"
              }`}
              type="button"
            >
              Menu
            </button>
          </nav>
        </div>
        
        {!loading ? (
          <div 
            ref={scrollContainerRef}
            className="h-[calc(100vh-180px)] overflow-y-auto px-3 sm:px-6"
          >
            {/* Popular Section */}
            <h1 ref={popularRef} className="text-2xl font-semibold py-3 top-[0px] bg-white z-5">
              <FontAwesomeIcon icon={faFire} className="mr-2 text-orange-500"/> Popular
            </h1>
            <div className="grid grid-cols-1 gap-4">
              {sets.length > 0 ? (
                sets.map((s) => ( 
                  <div 
                    key={s._id} 
                    className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <img 
                      src={s.image || '/placeholder-image.jpg'} 
                      className="w-24 h-24 object-cover rounded-md" 
                      alt={s.name}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <h1 className="font-semibold text-lg">{s.name}</h1>
                      <div className="text-sm text-gray-500 mb-1">
                        {s.sets?.map((m, mIndex) => (
                          <span key={`${s._id}-set-${m._id}-${mIndex}`}>
                            {mIndex > 0 && ", "} ({m.unit_Quantity}) {m.menu?.name || 'Unknown Item'}
                          </span>

                        ))}
                      </div>
                      <p className="font-medium text-gray-800">{s.price} MMK</p>
                    </div>
                    {renderQuantityControls(s._id, 'set')}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No popular items found.</p>
              )}
            </div>

            {/* Set Section */}
            <h1 ref={setRef} className="text-2xl font-semibold py-3 top-[60px] bg-white z-5">
              Sets
            </h1>
            <div className="grid grid-cols-1 gap-4">
              {sets.length > 0 ? (
                sets.map((s) => ( 
                  <div 
                    key={`set-${s._id}`} 
                    className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <img 
                      src={s.image || '/placeholder-image.jpg'} 
                      className="w-24 h-24 object-cover rounded-md" 
                      alt={s.name}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <h1 className="font-semibold text-lg">{s.name}</h1>
                      <div className="text-sm text-gray-500 mb-1">
                        {s.sets?.map((m, mIndex) => (
                          <span key={`${s._id}-set-${m._id}-${mIndex}`}>
                            {mIndex > 0 && ", "} ({m.unit_Quantity}) {m.menu?.name || 'Unknown Item'}
                          </span>

                        ))}
                      </div>
                      <p className="font-medium text-gray-800">{s.price} MMK</p>
                    </div>
                    {renderQuantityControls(s._id, 'set')}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No sets found.</p>
              )}
            </div>

            {/* Menu Section */}
            <h1 ref={menuRef} className="text-2xl font-semibold py-3 top-[60px] bg-white z-5">
              Menu
            </h1>
            <div className="grid grid-cols-1 gap-4 pb-4">
              {menuItems.length > 0 ? (
                menuItems.map((m) => ( 
                  <div 
                    key={`menu-${m._id}`} 
                    className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <img 
                      src={m.image || '/placeholder-image.jpg'} 
                      className="w-24 h-24 object-cover rounded-md" 
                      alt={m.name}
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <h1 className="font-semibold text-lg">{m.name}</h1>
                      <p className="text-sm text-gray-500">{m.type}</p>
                      <p className="font-medium text-gray-800">{m.price} MMK</p>
                    </div>
                    {renderQuantityControls(m._id, 'menu')}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No menu items found.</p>
              )}
            </div>
          </div>
        ) : (
          // Loading spinner
          <div className="p-4 flex items-center justify-center h-[600px]">
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C0 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}

        {/* Sticky Footer for Confirm Button */}
        <div className="sticky bottom-0 bg-white p-4 border-t z-20">
          <button 
            onClick={handleConfirmOrder}
            disabled={orderItems.length === 0 || orderLoading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors 
                      ${orderItems.length === 0 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'}`}
            type="button"
          >
            Confirm Order ({orderItems.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>
      </div> : <div>
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
  <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Payment</h2>

      <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
        <form action="#" className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Full name (as displayed on card)* </label>
              <input type="text" id="full_name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Bonnie Green" required />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Card number* </label>
              <input type="text" id="card-number-input" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="xxxx-xxxx-xxxx-xxxx" pattern="^4[0-9]{12}(?:[0-9]{3})?$" required />
            </div>

            <div>
              <label  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Card expiration* </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                  <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <input datepicker-format="mm/yy" id="card-expiration-input" type="text" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="12/23" required />
              </div>
            </div>
            <div>
              <label  className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                CVV*
                <button data-tooltip-target="cvv-desc" data-tooltip-trigger="hover" className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white">
                  <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
                  </svg>
                </button>
                <div id="cvv-desc" role="tooltip" className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                  The last 3 digits on back of card
                  <div className="tooltip-arrow" data-popper-arrow></div>
                </div>
              </label>
              <input type="number" id="cvv-input" aria-describedby="helper-text-explanation" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="•••" required />
            </div>
          </div>

          <button type="submit" className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Pay now</button>
        </form>

        <div className="mt-6 grow sm:mt-8 lg:mt-0">
          <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-2">
              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Original price</dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">$6,592.00</dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
                <dd className="text-base font-medium text-green-500">-$299.00</dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Store Pickup</dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">$99</dd>
              </dl>

              <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Tax</dt>
                <dd className="text-base font-medium text-gray-900 dark:text-white">$799</dd>
              </dl>
            </div>

            <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
              <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
              <dd className="text-base font-bold text-gray-900 dark:text-white">$7,191.00</dd>
            </dl>
          </div>

          <div className="mt-6 flex items-center justify-center gap-8">
            <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal.svg" alt="" />
            <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal-dark.svg" alt="" />
            <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg" alt="" />
            <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa-dark.svg" alt="" />
            <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard.svg" alt="" />
            <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard-dark.svg" alt="" />
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-gray-500 dark:text-gray-400 sm:mt-8 lg:text-left">
        Payment processed by <a href="#" title="" className="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">Paddle</a> for <a href="#" title="" class="font-medium text-primary-700 underline hover:no-underline dark:text-primary-500">Flowbite LLC</a>
        - United States Of America
      </p>
    </div>
  </div>
</section>

<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/datepicker.min.js"></script>
        </div>}
    </div>
  );
}

export default PreOrder;