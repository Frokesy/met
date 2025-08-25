import { useEffect, useState } from "react";
import MainContainer from "../../../components/containers/MainContainer";
import { CheckCircle2, XCircle, FileText } from "lucide-react";
import { AvatarIcon } from "../../../components/svgs/Icons";
import { supabase } from "../../../../utils/supabaseClient";

type VerificationItem = {
  id: string | number;
  type: "OfficerVerification" | "Request";
  name: string;
  unit?: string;
  date: string;
  docType?: string;
  docURL?: string;
  status: string;
  requestType?: string;
  details?: string;
};

const Verifications = () => {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: officers, error: officersError } = await supabase
        .from("officers")
        .select("id, full_name, unit, created_at")
        .eq("verified", false);

      if (officersError)
        console.error("Error fetching officers:", officersError);

      const officerItems: VerificationItem[] =
        officers?.map((o) => ({
          id: o.id,
          type: "OfficerVerification",
          name: o.full_name,
          unit: o.unit,
          date: o.created_at,
          docType: "ID Verification",
          docURL: "#",
          status: "pending",
        })) || [];

      const { data: requests, error: requestsError } = await supabase
        .from("requests")
        .select("id, user_id, type, details, status, date")
        .eq("status", "pending");

      if (requestsError)
        console.error("Error fetching requests:", requestsError);

      let requestItems: VerificationItem[] = [];

      if (requests && requests.length > 0) {
        const userIds = requests.map((r) => r.user_id);

        const { data: officerProfiles, error: profilesError } = await supabase
          .from("officers")
          .select("id, user_id, full_name, unit")
          .in("user_id", userIds);

        if (profilesError)
          console.error("Error fetching officer profiles:", profilesError);

        requestItems =
          requests.map((r) => {
            const officer = officerProfiles?.find(
              (o) => o.user_id === r.user_id
            );
            return {
              id: r.id,
              type: "Request",
              name: officer?.full_name || "Unknown",
              unit: officer?.unit || "-",
              date: r.date,
              status: r.status,
              requestType: r.type,
              details: r.details,
            };
          }) || [];
      }

      setItems([...officerItems, ...requestItems]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAction = async (
    item: VerificationItem,
    action: "Approved" | "Rejected"
  ) => {
    if (item.type === "OfficerVerification") {
      const { error } = await supabase
        .from("officers")
        .update({ verified: action === "Approved" })
        .eq("id", item.id);

      if (error) {
        console.error("Error updating officer:", error.message);
        return;
      }
    } else if (item.type === "Request") {
      const { error } = await supabase
        .from("requests")
        .update({ status: action })
        .eq("id", item.id);

      if (error) {
        console.error("Error updating request:", error.message);
        return;
      }
    }

    // update UI
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id && i.type === item.type ? { ...i, status: action } : i
      )
    );
  };

  return (
    <MainContainer active="verifications">
      <div className="text-[20px] text-gray-400 font-semibold mb-6">
        Home / Verifications & Requests
      </div>

      <div className="grid gap-6">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-400">No pending verifications or requests</p>
        ) : (
          items.map((v) => (
            <div
              key={`${v.type}-${v.id}`}
              className="bg-gray-800 border border-gray-700 p-4 rounded-md flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <AvatarIcon />

                <div>
                  <p className="text-white font-semibold">{v.name}</p>
                  <p className="text-sm text-gray-400">{v.unit}</p>
                  <p className="text-xs text-gray-500">
                    Submitted:{" "}
                    {new Date(v.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-blue-400 italic">
                    {v.type === "OfficerVerification"
                      ? "Officer Verification"
                      : `Request: ${v.requestType}`}
                  </p>
                </div>
              </div>

              <div className="text-gray-300 flex-1">
                {v.type === "OfficerVerification" && v.docType ? (
                  <>
                    <FileText className="inline mr-1 text-blue-400" size={16} />
                    <a
                      href={v.docURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-500"
                    >
                      {v.docType}
                    </a>
                  </>
                ) : (
                  <p className="text-sm text-gray-300 max-w-md">{v.details}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    v.status === "pending"
                      ? "bg-yellow-600 text-white"
                      : v.status === "Approved"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {v.status}
                </span>
                {v.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction(v, "Approved")}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm"
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(v, "Rejected")}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </MainContainer>
  );
};

export default Verifications;
