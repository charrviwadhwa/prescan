
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  UploadCloud,
  Files,
  Bell,
  Plus,
  ArrowUpRight,
  FileText,
  FileImage,
  Clock3,
  ChevronRight,
  FlaskConical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/auth";

function Dashboard() {
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/prescriptions");
        setPrescriptions(response.data.prescriptions || []);
      } catch (err) {
        setError("Unable to load your dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalPrescriptions = prescriptions.length;

  const totalInvestigations = prescriptions.reduce(
    (total, prescription) =>
      total + (prescription.investigations?.length || 0),
    0
  );

  const recentPrescriptions = prescriptions.slice(0, 3);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const isPdf = (fileName = "") =>
    fileName.toLowerCase().endsWith(".pdf");

  return (
    <main className="flex-1 min-w-0 w-full min-h-screen bg-[#F8F8F1] p-6 lg:p-12">
      <div className="w-full max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <p className="text-sm text-[#789083]">
              Workspace / Dashboard
            </p>

            <h1 className="text-3xl font-semibold mt-2 text-[#34443D]">
              Dashboard
            </h1>
          </div>

          <div className="w-11 h-11 rounded-full bg-white border border-[#E8EBE3] flex items-center justify-center text-[#527C69]">
            <Bell size={19} />
          </div>
        </header>

        {/* Welcome */}
        <section className="mb-9">
          <h2 className="text-2xl font-semibold text-[#34443D]">
            Welcome to Prescan
          </h2>

          <p className="text-gray-500 mt-2">
            Manage your prescriptions and view the tests identified from them.
          </p>
        </section>

        {/* Upload CTA */}
        <section className="bg-[#DCEBDD] rounded-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-sm text-[#527C69] font-medium mb-2">
              PRESCRIPTION ANALYSIS
            </p>

            <h2 className="text-2xl font-semibold text-[#34443D]">
              Have a new prescription?
            </h2>

            <p className="text-[#527C69] mt-2 text-sm">
              Upload a PDF or image to identify its written investigations.
            </p>
          </div>

          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 bg-[#527C69] hover:bg-[#426653] text-white px-5 py-3 rounded-xl transition"
          >
            <Plus size={19} />
            Upload prescription
          </button>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-9">

          <div className="bg-white rounded-2xl p-6 border border-[#E8EBE3]">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">
                Total prescriptions
              </p>

              <Files className="text-[#527C69]" size={21} />
            </div>

            <h3 className="text-3xl font-semibold mt-4 text-[#34443D]">
              {loading ? "—" : totalPrescriptions}
            </h3>

            <p className="text-xs text-gray-400 mt-2">
              Documents uploaded so far
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8EBE3]">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">
                Tests identified
              </p>

              <FlaskConical className="text-[#527C69]" size={21} />
            </div>

            <h3 className="text-3xl font-semibold mt-4 text-[#34443D]">
              {loading ? "—" : totalInvestigations}
            </h3>

            <p className="text-xs text-gray-400 mt-2">
              Across all uploaded prescriptions
            </p>
          </div>

        </section>

        {/* Recent Prescriptions */}
        <section className="bg-white rounded-2xl border border-[#E8EBE3] p-6">

          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#34443D]">
                Recent prescriptions
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Your latest uploaded documents
              </p>
            </div>

            <button
              onClick={() => navigate("/history")}
              className="flex items-center gap-2 text-sm text-[#527C69] font-medium hover:underline"
            >
              View history
              <ArrowUpRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm text-gray-400">
              Loading your prescriptions...
            </div>
          ) : error ? (
            <div className="py-10 text-center text-sm text-red-500">
              {error}
            </div>
          ) : recentPrescriptions.length === 0 ? (
            <div className="py-12 text-center">
              <Files size={34} className="mx-auto text-[#96D7C6]" />

              <p className="font-medium mt-4 text-[#34443D]">
                No prescriptions yet
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Your uploaded prescriptions will appear here.
              </p>

              <button
                onClick={() => navigate("/upload")}
                className="mt-5 text-sm text-[#527C69] font-medium hover:underline"
              >
                Upload your first prescription →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#EEF1EA]">
              {recentPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#EAF3EC] flex items-center justify-center shrink-0">
                      {isPdf(prescription.fileName) ? (
                        <FileText size={21} className="text-[#527C69]" />
                      ) : (
                        <FileImage size={21} className="text-[#527C69]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#34443D] truncate">
                        {prescription.fileName}
                      </p>

                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock3 size={12} />
                        {formatDate(prescription.createdAt)}
                        <span>·</span>
                        {prescription.investigations?.length || 0} tests found
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-1 text-sm text-[#527C69] hover:underline shrink-0"
                  >
                    View history
                    <ChevronRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </section>

        {/* Footer note */}
        <p className="text-xs text-[#91A095] text-center mt-8">
          Prescan helps organize investigations written on your prescriptions.
        </p>

      </div>
    </main>
  );
}

export default Dashboard;
