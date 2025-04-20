import React from "react";

const gradientColors = {
  blue: "from-blue-400 to-cyan-400",
  green: "from-emerald-400 to-teal-400",
  yellow: "from-yellow-400 to-amber-400",
  red: "from-rose-400 to-red-500",
  purple: "from-violet-400 to-indigo-400",
};

const StatsCard = ({ title, value, icon, color = "blue" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100">
      {/* Icon Badge */}
      <div
        className={`bg-gradient-to-br ${gradientColors[color]} p-3 rounded-xl shadow-lg shadow-${color}-200/40 transform transition-transform duration-300`}
      >
        <span className="material-icons text-white text-3xl">{icon}</span>
      </div>

      {/* Text Info */}
      <div>
        <h2 className="text-sm text-gray-500 font-semibold mb-1 tracking-wide">
          {title}
        </h2>
        <p className="text-2xl font-extrabold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
