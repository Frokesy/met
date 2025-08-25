import MainContainer from "../../../components/containers/MainContainer";

const Attendance = () => {
  return (
    <MainContainer active="attendance">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Attendance
      </div>

      <div className="flex items-center flex-wrap gap-4 mb-6">
        <span>From:</span>
        <input
          type="date"
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700"
        />
        <span>To:</span>
        <input
          type="date"
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700"
        />
        <select className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700">
          <option value="">All Units</option>
          <option>Unit A</option>
          <option>Unit B</option>
        </select>
        <input
          type="text"
          placeholder="Search Officer"
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700"
        />
        <button className="ml-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300 bg-gray-800 rounded-lg">
          <thead className="text-xs uppercase bg-gray-900 text-gray-200">
            <tr>
              <th className="px-6 py-3">Officer</th>
              <th className="px-6 py-3">Unit</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Shift</th>
              <th className="px-6 py-3">Check-In</th>
              <th className="px-6 py-3">Check-Out</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                officer: "John Doe",
                unit: "Unit A",
                date: "2025-07-14",
                shift: "Morning",
                checkIn: "06:03",
                checkOut: "12:00",
                status: "Present",
              },
              {
                officer: "Jane Smith",
                unit: "Unit B",
                date: "2025-07-14",
                shift: "Afternoon",
                checkIn: "-",
                checkOut: "-",
                status: "Absent",
              },
            ].map((row, i) => (
              <tr
                key={i}
                className="hover:bg-gray-700 transition-colors duration-150"
              >
                <td className="px-6 py-4">{row.officer}</td>
                <td className="px-6 py-4">{row.unit}</td>
                <td className="px-6 py-4">{row.date}</td>
                <td className="px-6 py-4">{row.shift}</td>
                <td className="px-6 py-4">{row.checkIn}</td>
                <td className="px-6 py-4">{row.checkOut}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      row.status === "Present"
                        ? "bg-green-600 text-white"
                        : row.status === "Absent"
                          ? "bg-red-600 text-white"
                          : "bg-yellow-500 text-black"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainContainer>
  );
};

export default Attendance;
