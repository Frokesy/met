import MainContainer from "../../../components/containers/MainContainer";

const SemesterResults = () => {
  const firstSemester = [
    {
      subject: "(CS3452) Theory of Computation",
      grade: "A+",
    },
    {
      subject: "(CS3751) Data Structures",
      grade: "A",
    },
    {
      subject: "(CS3453) Cryptography and Cyber Security",
      grade: "B+",
    },
    {
      subject: "(CS3852) Database Management System",
      grade: "O",
    },
  ];

  const secondSemester = [
    {
      subject: "(CS3452) Theory of Computation",
      grade: "A+",
    },
    {
      subject: "(CS3751) Data Structures",
      grade: "A",
    },
    {
      subject: "(CS3453) Cryptography and Cyber Security",
      grade: "B+",
    },
    {
      subject: "(CS3852) Database Management System",
      grade: "O",
    },
  ];

  return (
    <MainContainer active="semester results">
      <div className="px-6 pt-10 space-y-6 text-[#2E4765]">
        <div className="bg-[#fff] p-4 pb-14 rounded-xl shadow-md">
          <h2 className="text-[24px]">First Semester</h2>

          <div className="mt-6 mx-6 overflow-x-auto rounded-xl border border-[#676B84]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-[#16BBE5] text-[20px]">
                  <th className="py-3 border-r-2 border-[#2E4765] w-[50%] font-semibold">
                    Subject Name
                  </th>
                  <th className="py-3 w-[50%] font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody>
                {firstSemester.map((semester, index) => (
                  <tr
                    key={index}
                    className="bg-[#CFECF6] border-t border-[#2E4765]"
                  >
                    <td className="py-3 border-r-2 border-[#2E4765] font-semibold">
                      {semester.subject}
                    </td>
                    <td className="py-3 font-semibold">{semester.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#fff] p-4 pb-14 rounded-xl shadow-md">
          <h2 className="text-[24px]">Second Semester</h2>

          <div className="mt-6 mx-6 overflow-x-auto rounded-xl border border-[#676B84]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-[#16BBE5] text-[20px]">
                  <th className="py-3 border-r-2 border-[#2E4765] w-[50%] font-semibold">
                    Subject Name
                  </th>
                  <th className="py-3 w-[50%] font-semibold">Grade</th>
                </tr>
              </thead>
              <tbody>
                {secondSemester.map((semester, index) => (
                  <tr
                    key={index}
                    className="bg-[#CFECF6] border-t border-[#2E4765]"
                  >
                    <td className="py-3 border-r-2 border-[#2E4765] font-semibold">
                      {semester.subject}
                    </td>
                    <td className="py-3 font-semibold">{semester.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

export default SemesterResults;
