import { useState } from "react";
import { Pencil, Trash2, UserPlus, Users } from "lucide-react";
import MainContainer from "../../components/containers/MainContainer";
import { AvatarIcon } from "../../components/svgs/Icons";
import AddPersonnelModal from "../../components/modals/AddPersonnelModal";

const Personnel = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);

  const personnel = [
    {
      id: 1,
      name: "John Doe",
      securityId: "12weq765",
      unit: "Unit A",
      enlistmentDate: "2022-01-01",
      status: "Active",
      rank: "Private",
      pic: "https://example.com/john-doe.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      securityId: "3456789",
      unit: "Unit B",
      enlistmentDate: "2021-06-15",
      status: "Inactive",
      rank: "Corporal",
      pic: "https://example.com/jane-smith.jpg",
    },
    {
      id: 3,
      name: "Bob Johnson",
      securityId: "9876543",
      unit: "Unit C",
      enlistmentDate: "2020-12-31",
      status: "Active",
      rank: "Sergeant",
      pic: "https://example.com/bob-johnson.jpg",
    },
  ];

  return (
    <MainContainer active="personnel">
      <div className="flex justify-between items-center">
        <span className="text-[20px] text-gray-500 font-semibold mb-6 block">
          Home / Personnel
        </span>

        <button
          onClick={handleOpenModal}
          className="py-2 px-6 bg-cyan-600 text-[#fff] hover:bg-cyan-800 cursor-pointer transition rounded-lg font-semibold text-lg flex items-center space-x-3"
        >
          <UserPlus />
          <span>Add New Personnel</span>
        </button>
      </div>

      <div className="grid gap-4 mt-6">
        {personnel.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between bg-[#0d1329] text-white p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              {!p.pic ? (
                <img
                  src={p.pic}
                  alt={p.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
                />
              ) : (
                <AvatarIcon />
              )}
              <div>
                <p className="font-semibold text-lg">{p.name}</p>
                <p className="text-xs text-gray-400">{p.securityId}</p>
              </div>
            </div>

            <div className="text-center space-y-2 hidden md:block">
              <div className="flex space-x-2 items-center">
                <div className="p-1 rounded-full bg-gray-700">
                  <Users size={16} />
                </div>
                <p className="text-sm">{p.unit}</p>
              </div>
              <p className="text-xs text-gray-400">{p.enlistmentDate}</p>
            </div>

            <div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  p.status === "Active"
                    ? "bg-green-700 text-green-100"
                    : "bg-red-700 text-red-100"
                }`}
              >
                {p.status}
              </span>
            </div>

            <div>
              <span className="text-sm font-semibold text-cyan-400">
                {p.rank}
              </span>
            </div>

            <div className="flex gap-3">
              <button className="hover:text-yellow-400 transition">
                <Pencil size={18} color="blue" />
              </button>
              <button className="hover:text-red-500 transition">
                <Trash2 size={18} color="red" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && <AddPersonnelModal onClose={() => setShowModal(false)} />}
    </MainContainer>
  );
};

export default Personnel;
