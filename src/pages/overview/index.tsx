import MainContainer from "../../components/containers/MainContainer";
import {
  AttendanceIcon,
  AvatarIcon,
  CGPAIcon,
  MoneyIcon,
} from "../../components/svgs/Icons";

const Overview = () => {
  const topPanelItems = [
    {
      id: 1,
      title: "CGPA",
      value: "8.5",
      icon: <CGPAIcon />,
    },
    {
      id: 2,
      title: "Attendance",
      value: "85%",
      icon: <AttendanceIcon />,
    },
    {
      id: 3,
      title: "Dues",
      value: "12000",
      icon: <MoneyIcon />,
    },
  ];
  return (
    <MainContainer active="overview">
      <div className="px-6 pt-10 text-[#2E4765]">
        <div className="w-[100%] p-4 bg-[#fff] shadow-md rounded-xl border border-[#ccc]">
          <h2 className="text-[24px]">Welcome John</h2>
          <div className="px-10 grid grid-cols-3 gap-10 mt-10 mb-20">
            {topPanelItems.map((item) => (
              <div
                key={item.id}
                className="flex space-x-6 px-10 py-3 rounded-[30px] items-center border-2 border-[#16BBE5] hover:shadow-none shadow-[0_0_12px_#16BBE5] transition-all duration-300 ease-in-out"
              >
                {item.icon}
                <div className="text-center">
                  <p className="text-[16px] font-bold">{item.title}</p>
                  <p className="text-[24px] font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between space-x-10 mt-10">
          <div className="w-[50%] p-4  bg-[#fff] shadow-md rounded-xl border border-[#ccc]">
            <h2 className="text-[24px]">Your Profile</h2>
            <div className="mt-10 flex flex-col items-center justify-center">
              <AvatarIcon size={200} />
              <p className="text-[24px] mt-6">John</p>
              <p className="text-[24px]">961321104000</p>
            </div>
          </div>
          <div className="w-[50%] p-4  bg-[#fff] shadow-md rounded-xl border border-[#ccc]">
            <h2 className="text-[24px]">Personal Details</h2>
            <div className="mt-10 grid grid-cols-2 px-4">
              <div className="space-y-6 text-[18px]">
                <p>DOB: 01.04.2000</p>
                <p>Gender: Male</p>
                <p>Department: CSE</p>
                <p>Year/sem: Third/06</p>
                <p>Batch: 2020 - 2024</p>
              </div>
              <div className="space-y-6 text-[18px]">
                <p>Arrears: 4</p>
                <p>Degree: B.E</p>
                <p>Email: xyz@gmail.com</p>
                <p>Mobile: 123456789</p>
                <p>Accommodation: Day Scholar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

export default Overview;
