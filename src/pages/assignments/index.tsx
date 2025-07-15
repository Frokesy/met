import MainContainer from "../../components/containers/MainContainer";

const firstAssignment = [
  {
    subject: "(CS3452) Theory of Computation",
    status: "✓",
    mark: "9/10",
  },
  {
    subject: "(CS3751) Data Structures",
    status: "❌",
    mark: "-",
  },
  {
    subject: "(CS3453) Cryptography and Cyber Security",
    status: "✓",
    mark: "8/10",
  },
  {
    subject: "(CS3852) Database Management System",
    status: "✓",
    mark: "10/10",
  },
];

const secondAssignment = [
  {
    subject: "(CS3452) Theory of Computation",
    status: "✓",
    mark: "9/10",
  },
  {
    subject: "(CS3751) Data Structures",
    status: "❌",
    mark: "-",
  },
  {
    subject: "(CS3453) Cryptography and Cyber Security",
    status: "✓",
    mark: "8/10",
  },
  {
    subject: "(CS3852) Database Management System",
    status: "✓",
    mark: "10/10",
  },
];

const Assignments = () => {
  return (
    <MainContainer active="assignments">
      <div className="px-6 pt-10 space-y-6 text-[#2E4765]">
        <div className="bg-[#fff] p-4 pb-14 rounded-xl shadow-md">
          <h2 className="text-[24px]">First Assignment</h2>

          <div className="mt-6 mx-6 overflow-x-auto rounded-xl border border-[#676B84]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-[#16BBE5] text-[20px]">
                  <th className="py-3 border-r-2 border-[#2E4765] w-[50%] font-semibold">
                    Subject Name
                  </th>
                  <th className="py-3 border-r-2 border-[#2E4765] w-[25%] font-semibold">
                    Status
                  </th>
                  <th className="py-3 w-[25%] font-semibold">Mark</th>
                </tr>
              </thead>
              <tbody>
                {firstAssignment.map((assignment, index) => (
                  <tr
                    key={index}
                    className="bg-[#CFECF6] border-t border-[#2E4765]"
                  >
                    <td className="py-3 border-r-2 border-[#2E4765] font-semibold">
                      {assignment.subject}
                    </td>
                    <td className="py-3 border-r-2 border-[#2E4765] font-semibold">
                      {assignment.status}
                    </td>
                    <td className="py-3 font-semibold">{assignment.mark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#fff] p-4 pb-14 rounded-xl shadow-md">
          <h2 className="text-[24px]">Second Assignment</h2>

          <div className="mt-6 mx-6 overflow-x-auto rounded-xl border border-[#676B84]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-[#16BBE5] text-[20px]">
                  <th className="py-3 border-r-2 border-[#2E4765] w-[50%] font-semibold">
                    Subject Name
                  </th>
                  <th className="py-3 border-r-2 border-[#2E4765] w-[25%] font-semibold">
                    Status
                  </th>
                  <th className="py-3 w-[25%] font-semibold">Mark</th>
                </tr>
              </thead>
              <tbody>
                {secondAssignment.map((assignment, index) => (
                  <tr
                    key={index}
                    className="bg-[#CFECF6] border-t border-[#2E4765]"
                  >
                    <td className="py-3 border-r-2 border-[#2E4765] font-semibold">
                      {assignment.subject}
                    </td>
                    <td className="py-3 border-r-2 border-[#2E4765] font-semibold">
                      {assignment.status}
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

export default Assignments;
