import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCreateOrderMutation, useGetAllMenuMutation } from "../Slice/API/userApi";
import { useEffect, useState, useRef, useCallback } from "react";
import { faCartPlus, faFire, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router";

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

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [sets, setSets] = useState<Set[]>([]);
  const [activeSection, setActiveSection] = useState("popular");
  const [loading, setLoading] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItemState[]>([]);

  const { id } = useParams<{ tableId: string }>();

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
        if (res?.data) {
          setMenuItems(res.data.menu || []);
          setSets(res.data.sets || []);
        } else {
          console.error("API response did not contain expected data.");
          toast.error("Failed to load menu items.");
        }
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
    if (orderItems.length === 0) {
      toast.warn("Please add items to your order!");
      return;
    }

    if (!id) {
      toast.error("Table selection is required for ordering!");
      return;
    }
    
    const payload = {
    table_id: id,
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
    console.log("Payload being sent:", JSON.stringify(payload, null, 2)); // <--- ADD THIS LINE

  if (payload.order_items.length === 0) {
    toast.error("No valid items in the order!");
    return;
  }

    try {
      const response = await createOrderMutation(payload).unwrap(); 
      toast.success("Order placed successfully!");
      // navigate('/');
      console.log(response)
      setOrderItems([]);
    } catch (error: any) {
      console.error("Error creating order:", error);
      const errorMessage = error?.data?.message || error?.message || "Failed to place order";
      toast.error(errorMessage);
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
    <div className="w-full mx-auto lg:w-[800px] relative">
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
                      {s.menu_items?.map((m, mIndex) => ( 
                        <span key={`${s._id}-${m._id}-${mIndex}`}>
                          {mIndex > 0 && ", "} ({m.quantity}) {m.menu?.name || 'Unknown Item'} 
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
                      {s.menu_items?.map((m, mIndex) => (
                        <span key={`${s._id}-set-${m._id}-${mIndex}`}>
                          {mIndex > 0 && ", "} ({m.quantity}) {m.menu?.name || 'Unknown Item'}
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
          disabled={orderItems.length === 0}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-colors 
                     ${orderItems.length === 0 
                       ? 'bg-gray-400 cursor-not-allowed' 
                       : 'bg-blue-500 hover:bg-blue-600'}`}
          type="button"
        >
          Confirm Order ({orderItems.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </div>
    </div>
  );
}

export default PreOrder;