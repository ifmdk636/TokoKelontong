import { useState } from "react";
import { Minus, Plus } from "lucide-react";

function Button() {
  const [count, setCount] = useState(1);

  function increment() {
    setCount((prev) => prev + 1);
  }

  function decrement() {
    if (count <= 1) return;

    setCount((prev) => prev - 1);
  }

  return (
    <div className="flex items-center gap-4">
      {/* Counter */}
      <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden h-12">
        {/* Minus */}
        <button
          onClick={decrement}
          className="w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
        >
          <Minus size={18} />
        </button>

        {/* Count */}
        <div className="w-14 text-center font-medium text-lg">{count}</div>

        {/* Plus */}
        <button
          onClick={increment}
          className="w-12 h-full flex items-center justify-center text-green-500 hover:bg-green-50 transition"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Stock */}
      <p className="text-lg">
        Stok: <span className="font-bold">542</span>
      </p>
    </div>
  );
}

export default Button;
