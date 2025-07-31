import MainContainer from "../../../components/containers/MainContainer";
import { Trash2, Pencil } from "lucide-react";
import { AvatarIcon } from "../../../components/svgs/Icons";

const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    role: "Commander",
    unit: "Unit A",
    status: "Active",
  },
  {
    id: 2,
    name: "Mary Smith",
    role: "Officer",
    unit: "Unit B",
    status: "Inactive",
  },
];

const UserAccounts = () => {
  return (
    <MainContainer active="user accounts">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / User Accounts
      </div>

      <div className="grid gap-6">
        {dummyUsers.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800 border border-gray-700 p-4 rounded-md flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              {/* <img
                src={user.photo}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-600"
              /> */}
              <AvatarIcon />
              <div>
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-sm text-gray-400">{user.role}</p>
                <p className="text-xs text-gray-500">{user.unit}</p>
              </div>
            </div>

            <div>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  user.status === "Active"
                    ? "bg-green-700 text-green-300"
                    : "bg-red-700 text-red-300"
                }`}
              >
                {user.status}
              </span>
            </div>

            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm">
                <Pencil size={16} /> Edit
              </button>
              <button className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainContainer>
  );
};

export default UserAccounts;
