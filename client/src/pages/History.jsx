
import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  FileImage,
  CalendarDays,
  ExternalLink,
  Search,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import API from "../services/auth";

const isPdf = (fileName = "") =>
  fileName.toLowerCase().endsWith(".pdf");

function getStatus(item) {
  const status = (
    item.match_status ||
    item.matchStatus ||
    item.status ||
    ""
  ).toLowerCase();

  if (status === "exact_match" || status === "exact match") {
    return "recognized";
  }

  if (status === "needs_review" || status === "needs review") {
    return "review";
  }

  if (status === "unmatched" || item.matched === false) {
    return "unmatched";
  }

  return "unknown";
}

function StatusLabel({ status }) {
  const styles = {
    recognized: "bg-[#EAF3EC] text-[#527C69]",
    review: "bg-[#FFF3D9] text-[#98743A]",
    unmatched: "bg-[#FBEAE6] text-[#A65E50]",
    unknown: "bg-gray-100 text-gray-600",
  };

  const labels = {
    recognized: "Recognized",
    review: "Please review",
    unmatched: "Not identified",
    unknown: "Status unavailable",
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function History() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await API.get("/prescriptions");
        setPrescriptions(response.data.prescriptions || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load your prescription history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const investigations = selectedPrescription?.investigations || [];

  const filteredInvestigations = useMemo(() => {
    return investigations.filter((item) => {
      const status = getStatus(item);

      const matchesSearch =
        (item.raw_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.standard_name || "").toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "recognized" && status === "recognized") ||
        (filter === "review" && status === "review") ||
        (filter === "unmatched" && status === "unmatched");

      return matchesSearch && matchesFilter;
    });
  }, [investigations, search, filter]);

  const counts = {
    all: investigations.length,
    recognized: investigations.filter(
      (item) => getStatus(item) === "recognized"
    ).length,
    review: investigations.filter(
      (item) => getStatus(item) === "review"
    ).length,
    unmatched: investigations.filter(
      (item) => getStatus(item) === "unmatched"
    ).length,
  };

  const openPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setSearch("");
    setFilter("all");
  };

  const goBack = () => {
    setSelectedPrescription(null);
    setSearch("");
    setFilter("all");
  };

  if (loading) {
    return (
      <main className="flex-1 min-h-screen bg-[#F8F8F1] p-8 lg:p-12">
        <p className="text-[#65766C]">Loading your prescriptions...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 min-h-screen bg-[#F8F8F1] p-8 lg:p-12">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex-1 min-w-0 min-h-screen bg-[#F8F8F1] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">

        {!selectedPrescription ? (
          <>
            {/* HISTORY LIST */}

            <div className="mb-8">
              <p className="text-sm text-[#82A18F] mb-3">
                Workspace / History
              </p>

              <h1 className="text-3xl font-semibold text-[#34443D]">
                Prescription history
              </h1>

              <p className="text-[#849087] mt-2">
                All your uploaded prescriptions in one place.
              </p>
            </div>

            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-[#34443D]">
                Your documents
              </h2>

              <span className="text-sm text-[#849087]">
                {prescriptions.length} uploads
              </span>
            </div>

            {prescriptions.length === 0 ? (
              <div className="bg-white border border-[#E8EDE5] rounded-2xl p-12 text-center">
                <FileText size={34} className="mx-auto text-[#82B9A2]" />

                <h2 className="mt-4 font-medium text-[#34443D]">
                  No prescriptions yet
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  Upload a prescription to see its results here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => {
                  const pdf = isPdf(prescription.fileName);
                  const testCount =
                    prescription.investigations?.length || 0;

                  return (
                    <div
                      key={prescription.id}
                      className="bg-white border border-[#E8EDE5] rounded-2xl p-5 sm:p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-5">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 shrink-0 rounded-xl bg-[#EAF3EC] flex items-center justify-center">
                            {pdf ? (
                              <FileText size={23} className="text-[#527C69]" />
                            ) : (
                              <FileImage size={23} className="text-[#527C69]" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-[#34443D] truncate">
                              {prescription.fileName}
                            </h3>

                            <p className="text-xs text-[#849087] mt-2 flex items-center gap-1">
                              <CalendarDays size={13} />
                              {new Date(
                                prescription.createdAt
                              ).toLocaleDateString()}
                              <span className="mx-1">·</span>
                              {pdf ? "PDF document" : "Image"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-5 ml-auto">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-[#34443D]">
                              {testCount}
                            </p>
                            <p className="text-xs text-[#849087]">
                              Tests found
                            </p>
                          </div>

                          <button
                            onClick={() => openPrescription(prescription)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#EAF3EC] text-[#527C69] text-sm font-medium hover:bg-[#DCEBDD] transition"
                          >
                            View results
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {/* INDIVIDUAL PRESCRIPTION RESULTS */}

            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm text-[#718276] hover:text-[#34443D] mb-7"
            >
              <ArrowLeft size={17} />
              Back to history
            </button>

            <div className="mb-7">
              <p className="text-sm text-[#82A18F] mb-3">
                Workspace / History / Results
              </p>

              <h1 className="text-3xl font-semibold text-[#34443D]">
                {selectedPrescription.fileName}
              </h1>

              <p className="text-sm text-[#849087] mt-2">
                Uploaded on{" "}
                {new Date(
                  selectedPrescription.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            {/* Original document */}
            <section className="bg-white border border-[#E8EDE5] rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-[#34443D]">
                    Original document
                  </h2>
                  <p className="text-xs text-[#849087] mt-1">
                    Your uploaded prescription
                  </p>
                </div>

                <a
                  href={selectedPrescription.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#527C69] hover:underline"
                >
                  {isPdf(selectedPrescription.fileName)
                    ? "View original PDF"
                    : "View original image"}
                  <ExternalLink size={14} />
                </a>
              </div>

              {!isPdf(selectedPrescription.fileName) && (
                <div className="mt-5 bg-[#F8F8F1] rounded-xl p-3 flex justify-center">
                  <img
                    src={selectedPrescription.fileUrl}
                    alt="Original prescription"
                    className="max-h-[380px] max-w-full object-contain rounded-lg"
                  />
                </div>
              )}
            </section>

            {/* Summary cards */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total tests", value: counts.all },
                { label: "Recognized", value: counts.recognized },
                { label: "Please review", value: counts.review },
                { label: "Not identified", value: counts.unmatched },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white border border-[#E8EDE5] rounded-xl p-4"
                >
                  <p className="text-xs text-[#849087]">{item.label}</p>
                  <p className="text-2xl font-semibold text-[#34443D] mt-2">
                    {item.value}
                  </p>
                </div>
              ))}
            </section>

            {/* Investigations table */}
            <section className="bg-white border border-[#E8EDE5] rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[#EEF1EA]">
                <h2 className="font-semibold text-[#34443D]">
                  Tests found on your prescription
                </h2>

                <p className="text-xs text-[#849087] mt-1">
                  Search and review the tests identified from your document.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <div className="flex items-center gap-2 border border-[#E5EAE2] rounded-lg px-3 py-2 flex-1">
                    <Search size={16} className="text-[#91A095]" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by test name..."
                      className="w-full text-sm outline-none bg-transparent text-[#34443D]"
                    />
                  </div>

                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-[#E5EAE2] rounded-lg px-3 py-2 text-sm text-[#52665A] bg-white outline-none"
                  >
                    <option value="all">All results</option>
                    <option value="recognized">Recognized</option>
                    <option value="review">Please review</option>
                    <option value="unmatched">Not identified</option>
                  </select>
                </div>
              </div>

              <div className="max-h-[480px] overflow-auto">
                <table className="w-full text-left min-w-[780px]">
                  <thead className="sticky top-0 bg-[#F7F9F5] z-10">
                    <tr className="text-xs text-[#718276]">
                      <th className="px-5 py-4 font-medium">Written on prescription</th>
                      <th className="px-5 py-4 font-medium">Full test name</th>
                      <th className="px-5 py-4 font-medium">Page</th>
                      <th className="px-5 py-4 font-medium">AI reading confidence</th>
                      <th className="px-5 py-4 font-medium">Result</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInvestigations.map((item, index) => {
                      const confidence = Number(item.confidence);
                      const hasConfidence =
                        item.confidence !== null &&
                        item.confidence !== undefined &&
                        item.confidence !== "" &&
                        Number.isFinite(confidence);

                      const percentage = hasConfidence
                        ? Math.round(
                            Math.max(0, Math.min(1, confidence)) * 100
                          )
                        : null;

                      return (
                        <tr
                          key={index}
                          className="border-t border-[#F0F2EC] hover:bg-[#FAFBF8]"
                        >
                          <td className="px-5 py-4 text-sm font-medium text-[#34443D]">
                            {item.raw_name || "—"}
                          </td>

                          <td className="px-5 py-4 text-sm text-[#718276]">
                            {item.standard_name || "Could not identify"}
                          </td>

                          <td className="px-5 py-4 text-sm text-[#718276]">
                            {item.page_number || "—"}
                          </td>

                          <td className="px-5 py-4 text-sm text-[#34443D]">
                            {hasConfidence ? `${percentage}%` : "Not available"}
                          </td>

                          <td className="px-5 py-4">
                            <StatusLabel status={getStatus(item)} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredInvestigations.length === 0 && (
                  <p className="text-center text-sm text-gray-500 py-12">
                    No matching tests found.
                  </p>
                )}
              </div>
            </section>

            <div className="mt-5 bg-[#EDF3EB] border border-[#DFE9DE] rounded-xl p-4">
              <p className="text-sm font-medium text-[#527C69]">
                Understanding your results
              </p>

              <p className="text-xs text-[#718276] leading-6 mt-2">
                AI reading confidence is the AI's estimate of how clearly it
                read the handwriting. It is not a guarantee that the test
                name is correct. A recognized result means the name matched
                an entry in our test list. Always check the original
                prescription, especially for results marked Please review
                or Not identified.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default History;