import MainContainer from "../../components/containers/MainContainer";

const InternalMarks = () => {
  const firstInternalExamination = [
    {
      subject: "(CS3452) Theory of Computation",
      mark: "75/100",
    },
    {
      subject: "(CS3751) Data Structures",
      mark: "97/100",
    },
    {
      subject: "(CS3453) Cryptography and Cyber Security",
      mark: "80/100",
    },
    {
      subject: "(CS3852) Database Management System",
      mark: "98/100",
    },
  ];

  const semesterInternalMarks = [
    {
      subject: "(CS3452) Theory of Computation",
      mark: "25/40",
    },
    {
      subject: "(CS3751) Data Structures",
      mark: "35/40",
    },
    {
      subject: "(CS3453) Cryptography and Cyber Security",
      mark: "30/40",
    },
    {
      subject: "(CS3852) Database Management System",
      mark: "39/40",
    },
  ];

  return (
    <MainContainer active="internal marks">
      <div className="px-6 pt-10 space-y-6 text-[#2E4765]">
        <div className="bg-[#fff] p-4 pb-14 rounded-xl shadow-md">
          <h2 className="text-[24px]">First Internal Examination</h2>

          <div className="mt-6 mx-6 overflow-x-auto rounded-xl border border-[#676B84]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-[#16BBE5] text-[20px]">
                  <th className="py-3 border-r-2 border-[#2E4765] w-[50%] font-semibold">
                    Subject Name
                  </th>
                  <th className="py-3 w-[50%] font-semibold">Mark</th>
                </tr>
              </thead>
              <tbody>
                {firstInternalExamination.map((assignment, index) => (
                  <tr
                    key={index}
                    className="bg-[#CFECF6] border-t border-[#2E4765]"
                  >
                    <td className="py-3 border-r-2 border-[#2E4765] font-semibold">
                      {assignment.subject}
                    </td>
                    <td className="py-3 font-semibold">{assignment.mark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#fff] p-4 pb-14 rounded-xl shadow-md">
          <h2 className="text-[24px]">Semester Internal Marks</h2>

          <div className="mt-6 mx-6 overflow-x-auto rounded-xl border border-[#676B84]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-[#16BBE5] text-[20px]">
                  <th className="py-3 border-r-2 border-[#2E4765] w-[50%] font-semibold">
                    Subject Name
                  </th>
                  <th className="py-3 w-[50%] font-semibold">Mark</th>
                </tr>
              </thead>
              <tbody>
                {semesterInternalMarks.map((assignment, index) => (
                  <tr
                    key={index}
                    className="bg-[#CFECF6] border-t border-[#2E4765]"
                  >
                    <td className="py-3 border-r-2 border-[#2E4765] font-semibold">
                      {assignment.subject}
                    </td>
                    <td className="py-3 font-semibold">{assignment.mark}</td>
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

export default InternalMarks;
