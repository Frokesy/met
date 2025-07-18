import MainContainer from "../../components/containers/MainContainer";
import {
  DownloadIcon,
  LeftArrowIcon,
  RightArrowIcon,
  SearchIcon,
} from "../../components/svgs/Icons";

const notesData = [
  {
    name: "Internal Examination",
    year: "I, II",
    date: "10.11.2025",
  },
  {
    name: "Semester Examination Timetable",
    year: "All",
    date: "12.12.2025",
  },
  {
    name: "Christmas Celebration",
    year: "All",
    date: "25.12.2025",
  },
  {
    name: "Pongal Holidays",
    year: "All",
    date: "01.01.2025",
  },
];

const Circulars = () => {
  return (
    <MainContainer active="circulars">
      <div className="px-6 pt-10 space-y-6 text-[#2E4765]">
        <div className="bg-white p-4 pb-14 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px]">Circulars</h2>
            <div className="flex items-center space-x-3 bg-[#D1D5DB] rounded-lg p-2">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search circulars"
                className="outline-none border-none bg-inherit"
              />
            </div>
          </div>

          <div className="mt-20 overflow-x-auto px-6">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[20px] font-semibold text-[#2E4765] border-b-2 border-[#ccc]">
                  <th className="w-[55%] pb-3">Name</th>
                  <th className="w-[15%] pb-3">Year</th>
                  <th className="w-[15%] text-center pb-3">Date</th>
                  <th className="w-[15%] text-center pb-3">Download</th>
                </tr>
              </thead>
              <tbody>
                {notesData.map((note, idx) => (
                  <tr
                    key={idx}
                    className="text-[#2E4765] border-b-2 border-[#ccc]"
                  >
                    <td className="py-3">{note.name}</td>
                    <td className="py-3">{note.year}</td>
                    <td className="py-3 text-center">{note.date}</td>
                    <td className="py-3 text-center">
                      <button title={`Download ${note.name}`}>
                        <DownloadIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-10 px-6">
            <div className="flex items-center space-x-3">
              <LeftArrowIcon />
              <p>Page 1 of 2</p>
              <RightArrowIcon />
            </div>

            <p>Total Circulars: {notesData.length}</p>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

export default Circulars;
