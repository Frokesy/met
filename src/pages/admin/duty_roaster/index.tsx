import MainContainer from "../../../components/containers/MainContainer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addDays, startOfWeek, endOfWeek, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

const shifts = [
  { label: "Morning Shift", time: "06:00 - 12:00" },
  { label: "Afternoon Shift", time: "12:00 - 18:00" },
  { label: "Evening Shift", time: "18:00 - 00:00" },
];

const getShiftBorderColor = (shift: string) => {
  switch (shift) {
    case "Morning Shift":
      return "border-l-2 border-l-green-500";
    case "Afternoon Shift":
      return "border-l-2 border-l-yellow-500";
    case "Evening Shift":
      return "border-l-2 border-l-blue-500";
    default:
      return "";
  }
};

const units = ["Unit A", "Unit B", "Unit C", "Unit D"];

const DutyRoaster = () => {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const weekStart = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

  const days = Array.from({ length: 7 }, (_, i) =>
    format(addDays(weekStart, i), "EEEE"),
  );

  const openModal = (day: string, shift: string) => {
    setSelectedDay(day);
    setSelectedShift(shift);
    setModalOpen(true);
  };

  const assignUnit = (unit: string) => {
    if (selectedDay && selectedShift) {
      const key = `${format(weekStart, "yyyy-MM-dd")}_${selectedDay}_${selectedShift}`;
      setAssignments((prev) => ({ ...prev, [key]: unit }));
      setModalOpen(false);
    }
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };

  return (
    <MainContainer active="duty roaster">
      <span className="text-[20px] text-gray-400 font-semibold mb-6 block">
        Home / Duty Roaster
      </span>

      <div className="flex justify-between mb-6 bg-gray-900 px-6 py-4 rounded-xl items-center">
        <div className="flex items-center gap-4 text-gray-300">
          <button onClick={goToPreviousWeek} className="hover:text-white">
            <ChevronLeft />
          </button>
          <div className="text-sm">
            <span className="font-medium">Week:</span>{" "}
            {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd")}
          </div>
          <button onClick={goToNextWeek} className="hover:text-white">
            <ChevronRight />
          </button>
        </div>

        <div className="flex gap-4 text-gray-400 text-sm">
          {shifts.map((shift) => {
            const count = Object.keys(assignments).filter(
              (key) =>
                key.includes(shift.label) &&
                key.startsWith(format(weekStart, "yyyy-MM-dd")),
            ).length;

            return (
              <div key={shift.label} className="flex items-center gap-1">
                <span
                  className={`w-3 h-3 rounded-full ${
                    shift.label === "Morning Shift"
                      ? "bg-green-500"
                      : shift.label === "Afternoon Shift"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                ></span>
                {shift.label.split(" ")[0]}: {count} assigned
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full table-fixed bg-gray-800 text-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-900 text-gray-100 uppercase text-xs">
              <th className="p-4 text-left font-semibold w-40">Shift / Day</th>
              {days.map((day) => (
                <th key={day} className="p-4 text-left font-semibold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.map(({ label, time }) => (
              <tr key={label}>
                <td className="p-4 font-semibold text-gray-300 bg-gray-900">
                  <div>
                    {label}
                    <div className="text-xs text-gray-500">{time}</div>
                  </div>
                </td>
                {days.map((day) => {
                  const key = `${format(weekStart, "yyyy-MM-dd")}_${day}_${label}`;
                  return (
                    <td
                      key={key}
                      onClick={() => openModal(day, label)}
                      className={`px-4 py-8 cursor-pointer transition-colors duration-200 hover:bg-gray-700 rounded-md ${getShiftBorderColor(label)}`}
                    >
                      {assignments[key] ? (
                        <span className="font-medium text-white">
                          {assignments[key]}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">
                          Click to assign
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 w-[90%] max-w-sm shadow-xl"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Assign unit for
                <br />
                <span className="text-blue-500">
                  {selectedShift} on {selectedDay}
                </span>
              </h3>

              <select
                onChange={(e) => assignUnit(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a unit
                </option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setModalOpen(false)}
                className="mt-6 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainContainer>
  );
};

export default DutyRoaster;
