import Data from "../../data/productList.tsx";
import { useNavigate } from "react-router-dom";

function OtherProducts() {
  const navigate = useNavigate();

  return (
    <div className="w-full mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Other Products</h1>

      <div className="grid lg:grid-cols-4 grid-rows-4 gap-5">
        {Data.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/card/${item.id}`)}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer"
          >
            {/* Image */}
            <div className="w-full h-52 bg-gray-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
                {item.name}
              </h2>

              <p className="text-green-600 font-bold text-lg mt-2">
                Rp {item.price}
              </p>

              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                ⭐ {item.rating} • Terjual {item.sold}+
              </div>

              <p className="text-xs text-gray-400 mt-1">{item.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OtherProducts;
