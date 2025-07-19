import MainContainer from "../../components/containers/MainContainer";
import { CheckCircle2, XCircle, FileText } from "lucide-react";
import { AvatarIcon } from "../../components/svgs/Icons";

const dummyVerifications = [
  {
    id: 1,
    name: "John Doe",
    unit: "Unit A",
    date: "2025-07-14",
    photo: "/john.jpg",
    docType: "ID Card",
    docURL: "/uploads/id-john.pdf",
    status: "Pending",
  },
  {
    id: 2,
    name: "Sarah Lee",
    unit: "Unit C",
    date: "2025-07-13",
    photo: "/sarah.jpg",
    docType: "Training Certificate",
    docURL: "/uploads/cert-sarah.pdf",
    status: "Pending",
  },
];

const Verifications = () => {
  return (
    <MainContainer active="verifications">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Verifications
      </div>

      <div className="grid gap-6">
        {dummyVerifications.map((v) => (
          <div
            key={v.id}
            className="bg-gray-800 border border-gray-700 p-4 rounded-md flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              {/* <img
                src={v.photo}
                alt={v.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-600"
              /> */}
              <AvatarIcon />
              <div>
                <p className="text-white font-semibold">{v.name}</p>
                <p className="text-sm text-gray-400">{v.unit}</p>
                <p className="text-xs text-gray-500">Submitted: {v.date}</p>
              </div>
            </div>

            <div className="text-gray-300">
              <FileText className="inline mr-1 text-blue-400" size={16} />
              <a
                href={v.docURL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-500"
              >
                {v.docType}
              </a>
            </div>

            <div className="flex gap-2">
              <button className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm">
                <CheckCircle2 size={16} /> Approve
              </button>
              <button className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm">
                <XCircle size={16} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainContainer>
  );
};

export default Verifications;
