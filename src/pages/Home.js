import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";

export default function Home() {
  const [truckList, setTruckList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 20,
  });

  const [exporting, setExporting] = useState(false);
  const [searchDate, setSearchDate] = useState(""); // For date input
  const [isSearching, setIsSearching] = useState(false); // Track search mode

  // 🔐 Get user from auth cookie
  const getUserRoleAndType = () => {
    const authCookie = Cookies.get("auth");
    if (!authCookie) return null;
    try {
      return JSON.parse(authCookie);
    } catch (err) {
      console.error("Failed to parse auth cookie");
      return null;
    }
  };

  const user = getUserRoleAndType();
  const canExport = user && user.role === "admin" && user.type === "internal";

  // 🔽 Fetch all trucks (paginated)
  const fetchTrucks = (page = 1) => {
    setIsSearching(false);
    setLoading(true);

    if (!user?.token) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/v1/trucks/all?page=${page}&limit=20`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch trucks");
        return res.json();
      })
      .then((responseData) => {
        if (Array.isArray(responseData.data)) {
          setTruckList(responseData.data);
        } else {
          setTruckList([]);
        }

        if (responseData.pagination) {
          setPagination(responseData.pagination);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trucks:", err);
        setTruckList([]);
        setLoading(false);
      });
  };

  // 🔍 Fetch trucks by created date
  const handleSearchByDate = () => {
    if (!searchDate || !user?.token) return;

    setIsSearching(true);
    setLoading(true);

    // Call filter API
    fetch(`http://localhost:5000/api/v1/trucks/filter?date=${searchDate}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch filtered trucks");
        return res.json();
      })
      .then((responseData) => {
        // Assume response structure: { data: [...], totalItems: 10 }
        const data = Array.isArray(responseData.data) ? responseData.data : [];

        setTruckList(data);
        setPagination((prev) => ({
          ...prev,
          totalItems: responseData.totalItems || data.length,
          currentPage: 1,
          totalPages: Math.ceil((responseData.totalItems || data.length) / prev.limit),
        }));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error searching trucks by date:", err);
        setTruckList([]);
        setLoading(false);
      });
  };

  // 🔽 Export to Excel (full list or filtered)
  const exportToExcel = () => {
    if (!canExport || !user?.token) return;

    setExporting(true);
    const exportUrl = isSearching && searchDate
      ? `http://localhost:5000/api/v1/trucks/filter?createdDate=${searchDate}&limit=1000`
      : "http://localhost:5000/api/v1/trucks/all?limit=1000";

    fetch(exportUrl, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => res.json())
      .then((responseData) => {
        const dataToExport = Array.isArray(responseData.data) ? responseData.data : [];

        const worksheetData = dataToExport.map((truck) => {
          const gross = parseFloat(truck.gross_weight) || 0;
          const tare = parseFloat(truck.tare_weight) || 0;
          const net = gross - tare;

          return {
            "Vehicle No": truck.vehicle_no,
            "Party Name": truck.party_name,
            Type: truck.type || "",
            "No. of Bags": truck.no_of_bags,
            Commodity: truck.commodity || "",
            "Gross Weight (kg)": gross.toFixed(2),
            "Tare Weight (kg)": tare.toFixed(2),
            "Net Weight (kg)": net.toFixed(2),
            Transport: truck.transport || "",
            "RST No": truck.rst_no,
            Godown: truck.godown || "",
            "Created At": truck.type_created
              ? new Date(truck.type_created).toLocaleString()
              : "",
            "Updated At": truck.type_updated
              ? new Date(truck.type_updated).toLocaleString()
              : "",
          };
        });

        const ws = XLSX.utils.json_to_sheet(worksheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Trucks List");

        const wscols = [
          { wch: 14 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 15 },
          { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
          { wch: 15 }, { wch: 20 }, { wch: 20 },
        ];
        ws["!cols"] = wscols;

        const dateStr = new Date().toISOString().slice(0, 10);
        const suffix = isSearching ? `_date_${searchDate}` : "";
        XLSX.writeFile(wb, `Trucks_List${suffix}_${dateStr}.xlsx`);
        setExporting(false);
      })
      .catch((err) => {
        console.error("Export failed:", err);
        setExporting(false);
      });
  };

  // Load initial data
  useEffect(() => {
    if (user?.token) {
      fetchTrucks(1);
    }
  }, [user?.token]);

  const goToPreviousPage = () => {
    if (pagination.currentPage > 1) {
      fetchTrucks(pagination.currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchTrucks(pagination.currentPage + 1);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Trucks List</h2>

      {/* 🔍 Search by Date */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <label className="block mb-2 font-medium text-gray-700">
          Search by Created Date
        </label>
        <div className="flex gap-3 flex-wrap">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearchByDate}
            disabled={!searchDate || loading}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            Search
          </button>
          {isSearching && (
            <button
              onClick={() => fetchTrucks(1)}
              className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* ✅ Export Button */}
      {canExport && (
        <div className="mb-4">
          <button
            onClick={exportToExcel}
            disabled={exporting}
            className={`bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition flex items-center gap-2
              ${exporting ? "opacity-80 cursor-not-allowed" : ""}`}
          >
            {exporting ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Exporting...
              </>
            ) : (
              <>📥 Export to Excel</>
            )}
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center">Loading trucks...</p>
      ) : truckList.length === 0 ? (
        <p className="text-center">No trucks found</p>
      ) : (
        <>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Vehicle No</th>
                  <th className="border p-2">Party Name</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">No. of Bags</th>
                  <th className="border p-2">Commodity</th>
                  <th className="border p-2">Gross Weight</th>
                  <th className="border p-2">Tare Weight</th>
                  <th className="border p-2">Net Weight</th>
                  <th className="border p-2">Transport</th>
                  <th className="border p-2">RST No</th>
                  <th className="border p-2">Godown</th>
                  <th className="border p-2">Created</th>
                  <th className="border p-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {truckList.map((truck) => {
                  const gross = parseFloat(truck.gross_weight) || 0;
                  const tare = parseFloat(truck.tare_weight) || 0;
                  const net = gross - tare;

                  return (
                    <tr key={truck.id} className="text-center border hover:bg-gray-50">
                      <td className="border p-2 font-mono">{truck.vehicle_no}</td>
                      <td className="border p-2">{truck.party_name}</td>
                      <td
                        className={`border p-2 font-semibold ${
                          truck.type === "Loading"
                            ? "text-green-600"
                            : truck.type === "Unloading"
                            ? "text-orange-600"
                            : "text-blue-600"
                        }`}
                      >
                        {truck.type || "—"}
                      </td>
                      <td className="border p-2">{truck.no_of_bags || "—"}</td>
                      <td className="border p-2">{truck.commodity || "—"}</td>
                      <td className="border p-2">{gross.toFixed(2)} kg</td>
                      <td className="border p-2">{tare.toFixed(2)} kg</td>
                      <td className="border p-2 font-bold">{net.toFixed(2)} kg</td>
                      <td className="border p-2">{truck.transport || "—"}</td>
                      <td className="border p-2">{truck.rst_no || "—"}</td>
                      <td className="border p-2">{truck.godown || "—"}</td>
                      <td className="border p-2 text-xs">
                        {truck.type_created
                          ? new Date(truck.type_created).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="border p-2 text-xs">
                        {truck.type_updated
                          ? new Date(truck.type_updated).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages} •{" "}
              {pagination.totalItems} {isSearching ? "filtered" : "total"} trucks
            </div>
            <div className="flex gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={pagination.currentPage === 1}
                className={`px-4 py-2 rounded text-white font-medium transition
                  ${pagination.currentPage === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`px-4 py-2 rounded text-white font-medium transition
                  ${pagination.currentPage === pagination.totalPages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}