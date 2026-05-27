import Badge from "../components/ui/Badge";
import DataTable from "../components/ui/DataTable";
import { useAsync } from "../hooks/useAsync";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Reports() {
  const { data, reload } = useAsync(async () => {
    const response = await api.get("/reports");
    return response.data.reports;
  }, []);

  const updateReport = async (id, status) => {
    try {
      await api.patch(`/reports/${id}`, { status });
      toast.success(`Report marked ${status}`);
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update report");
    }
  };

  return (
    <div className="space-y-5">
      <section>
        <p className="text-sm font-black uppercase tracking-wide text-green-600 dark:text-green-400">
          Moderation queue
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">
          Reports management
        </h1>
      </section>
      <DataTable
        columns={[
          {
            key: "tournament",
            label: "Tournament",
            render: (row) => row.tournament?.title,
          },
          {
            key: "reporter",
            label: "Reporter",
            render: (row) => row.reporter?.name,
          },
          // { key: 'reason', label: 'Reason' },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <Badge tone={row.status === "open" ? "amber" : "green"}>
                {row.status}
              </Badge>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <button
                  className="btn-secondary !px-3 !py-2"
                  onClick={() => updateReport(row._id, "reviewing")}
                >
                  Review
                </button>
                <button
                  className="btn-secondary !px-3 !py-2"
                  onClick={() => updateReport(row._id, "resolved")}
                >
                  Resolve
                </button>
                <button
                  className="btn-secondary !px-3 !py-2"
                  onClick={() => updateReport(row._id, "dismissed")}
                >
                  Dismiss
                </button>
              </div>
            ),
          },
        ]}
        rows={data || []}
      />
    </div>
  );
}
