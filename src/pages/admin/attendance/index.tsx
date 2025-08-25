import { useEffect, useState } from "react";
import MainContainer from "../../../components/containers/MainContainer";
import { supabase } from "../../../../utils/supabaseClient";

interface AttendanceRecord {
  user_id: string;
  officer: string;
  unit: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
}

const Attendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // filters
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [unitFilter, setUnitFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);

      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("id, user_id, status, marked_at")
        .order("marked_at", { ascending: true });

      if (attendanceError) {
        console.error("Error fetching attendance:", attendanceError.message);
        setLoading(false);
        return;
      }

      const { data: officersData, error: officersError } = await supabase
        .from("officers")
        .select("user_id, full_name, unit");

      if (officersError) {
        console.error("Error fetching officers:", officersError.message);
        setLoading(false);
        return;
      }

      // merge & group
      const grouped: Record<string, AttendanceRecord> = {};

      (attendanceData || []).forEach((att) => {
        const officer = officersData?.find((o) => o.user_id === att.user_id);
        const dateKey = new Date(att.marked_at).toISOString().split("T")[0]; // YYYY-MM-DD
        const key = `${att.user_id}-${dateKey}`;

        if (!grouped[key]) {
          grouped[key] = {
            user_id: att.user_id,
            officer: officer?.full_name || "Unknown",
            unit: officer?.unit || "-",
            date: dateKey,
            checkIn: null,
            checkOut: null,
            status: "Absent",
          };
        }

        if (att.status === "checked_in") {
          grouped[key].checkIn = new Date(att.marked_at).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );
          grouped[key].status = "Present";
        }

        if (att.status === "checked_out") {
          grouped[key].checkOut = new Date(att.marked_at).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          );
          grouped[key].status = "Present";
        }
      });

      setRecords(Object.values(grouped));
      setLoading(false);
    };

    fetchAttendance();
  }, []);

  // filter records
  const filteredRecords = records.filter((r) => {
    let match = true;

    if (fromDate && new Date(r.date) < new Date(fromDate)) match = false;
    if (toDate && new Date(r.date) > new Date(toDate)) match = false;
    if (unitFilter && r.unit !== unitFilter) match = false;
    if (search && !r.officer.toLowerCase().includes(search.toLowerCase()))
      match = false;

    return match;
  });

  const exportCSV = () => {
    const headers = [
      "Officer",
      "Unit",
      "Date",
      "Check-In",
      "Check-Out",
      "Status",
    ];
    const rows = filteredRecords.map((r) => [
      r.officer,
      r.unit,
      r.date,
      r.checkIn || "-",
      r.checkOut || "-",
      r.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "attendance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainContainer active="attendance">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Attendance
      </div>

      <div className="flex items-center flex-wrap gap-4 mb-6">
        <span>From:</span>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700"
        />
        <span>To:</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700"
        />
        <select
          value={unitFilter}
          onChange={(e) => setUnitFilter(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700"
        >
          <option value="">All Units</option>
          <option>Unit A</option>
          <option>Unit B</option>
          <option>Unit C</option>
          <option>Unit D</option>
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Officer"
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700"
        />
        <button
          onClick={exportCSV}
          className="ml-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md"
        >
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
              <th className="px-6 py-3">Check-In</th>
              <th className="px-6 py-3">Check-Out</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="px-6 py-4">{row.officer}</td>
                  <td className="px-6 py-4">{row.unit}</td>
                  <td className="px-6 py-4">
                    {new Date(row.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">{row.checkIn || "-"}</td>
                  <td className="px-6 py-4">{row.checkOut || "-"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === "Present"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </MainContainer>
  );
};

export default Attendance;
