import { useEffect, useState } from "react";
import { useGetAllMenuMutation } from "../Slice/API/userApi";
import { toast } from "react-toastify";

interface MenuItem {
  _id: string;
  name: string;
  type: string;
  price: number;
  is_avaliable: boolean;
  image?: string;
  cloudinary_id?: string;
}

interface SetItem {
  unit_Quantity: number;
  menu: MenuItem;
}

interface Set {
  _id: string;
  name: string;
  price: string | number;
  image?: string;
  sets: SetItem[];
  cloudinary_id?: string;
  timestamp: string;
  __v: number;
}

function Menu() {
  const [getall] = useGetAllMenuMutation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const start = async () => {
      try {
        setLoading(true);
        const res = await getall({});
        
        if (res?.data) {
          setMenuItems(res.data.menu || []);
          setSets(res.data.sets || []);
        } else {
          console.error("API response did not contain expected data.");
          toast.error("Failed to load menu items.");
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        toast.error("Failed to load menu items.");
      } finally {
        setLoading(false);
        console.log(sets)
      }
    };
    start();
  }, [getall]);

  const MenuItemCard = ({ item }: { item: MenuItem }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full h-full flex flex-col">
      {/* Image section */}
      <div className="bg-gray-200 flex-shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-32 sm:h-48 object-cover"
          />
        ) : (
          <div className="w-full h-32 sm:h-48 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
      </div>
      
      {/* Content section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm sm:text-lg text-gray-800 mb-1">{item.name}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 capitalize">{item.type}</p>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm sm:text-lg font-bold text-green-600">
            {item.price.toLocaleString()} MMK
          </span>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              item.is_avaliable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.is_avaliable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
    </div>
  );

  const SetCard = ({ set }: { set: Set }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full h-full flex flex-col">
      {/* Image section */}
      <div className="bg-gray-200 flex-shrink-0">
        {set.image ? (
          <img
            src={set.image}
            alt={set.name}
            className="w-full h-32 sm:h-48 object-cover"
          />
        ) : (
          <div className="w-full h-32 sm:h-48 bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
      </div>
      
      {/* Content section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm sm:text-lg text-gray-800 mb-2">{set.name}</h3>
          
          {/* Show set items - FIXED: using set.sets instead of set.sets > 0 */}
          {set.sets && set.sets.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-gray-600 mb-1">Includes:</p>
              <ul className="text-xs text-gray-500">
                {set.sets.slice(0, 2).map((setItem, index) => (
                  <li key={index}>
                    • {setItem.menu?.name} (x{setItem.unit_Quantity})
                  </li>
                ))}
                {set.sets.length > 2 && (
                  <li className="text-gray-400">...and {set.sets.length - 2} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm sm:text-lg font-bold text-green-600">
            {Number(set.price).toLocaleString()} MMK
          </span>
          {/* Note: Set doesn't seem to have is_available property in your data */}
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Available
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Sort items: available first, then unavailable
  const sortedMenuItems = [
    ...menuItems.filter(item => item.is_avaliable),
    ...menuItems.filter(item => !item.is_avaliable)
  ];

  // Sets don't seem to have is_available property, so just use as is
  const sortedSets = sets;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">Our Menu</h1>
      
      {/* SET MEALS SECTION */}
      {sets.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
            <h2 className="px-2 sm:px-4 text-lg sm:text-2xl font-bold text-gray-800 bg-white">
              🍽️ Set Meals ({sets.length})
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
          
          {/* 2 items per row on mobile, 4 items per row on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {sortedSets.map((set) => (
              <SetCard key={set._id} set={set} />
            ))}
          </div>
        </div>
      )}

      {/* MENU ITEMS SECTION */}
      {menuItems.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
            <h2 className="px-2 sm:px-4 text-lg sm:text-2xl font-bold text-gray-800 bg-white">
              🍚 Menu Items ({menuItems.length})
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
          
          {/* 2 items per row on mobile, 4 items per row on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {sortedMenuItems.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {sets.length === 0 && menuItems.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl sm:text-6xl mb-4">🍽️</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Menu Available</h2>
          <p className="text-sm sm:text-base text-gray-600">Our menu is being updated. Please check back soon!</p>
        </div>
      )}

      {/* SUMMARY STATISTICS */}
      {(menuItems.length > 0 || sets.length > 0) && (
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div>
              <div className="text-lg sm:text-xl font-bold text-blue-600">{sets.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Set Meals</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-green-600">{menuItems.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Menu Items</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-emerald-600">
                {sets.length + menuItems.filter(item => item.is_avaliable).length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Available Now</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-orange-600">
                {sets.length + menuItems.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Items</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;