import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";

export function AdminUsersView() {
  const { technicians, currentUser, setActiveScreen } = useApp();
  const [roleFilter, setRoleFilter] = useState<"all" | "citizen" | "technician">("all");
  const [search, setSearch] = useState("");

  const citizens = [
    {
      id: "usr-1",
      name: currentUser.name,
      phone: currentUser.phone,
      email: currentUser.email,
      role: "citizen",
      area: "Koregaon Park",
      jobs: 12,
      status: "Active",
    },
    {
      id: "usr-2",
      name: "Meera Joshi",
      phone: "+91 98223 99887",
      email: "meera.joshi@example.com",
      role: "citizen",
      area: "Koregaon Park",
      jobs: 4,
      status: "Active",
    },
    {
      id: "usr-3",
      name: "Rahul Shah",
      phone: "+91 97651 22334",
      email: "rahul.shah@example.com",
      role: "citizen",
      area: "Viman Nagar",
      jobs: 7,
      status: "Active",
    },
    {
      id: "usr-4",
      name: "Nina Das",
      phone: "+91 97660 54321",
      email: "nina.das@example.com",
      role: "citizen",
      area: "Shastri Nagar",
      jobs: 3,
      status: "Active",
    },
  ];

  const allUsers = [
    ...citizens,
    ...technicians.map((t) => ({
      id: t.id,
      name: t.name,
      phone: t.phone,
      email: t.email,
      role: "technician",
      area: t.serviceArea,
      jobs: t.totalJobs,
      status: t.isVerified ? "Active" : "Under Review",
    })),
  ];

  const filtered = allUsers.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.phone.includes(search))
      return false;
    return true;
  });

  return (
    <div className="flow-page page-pad">
      <div className="flow-title">
        <button
          type="button"
          className="back-btn"
          onClick={() => setActiveScreen("admin_dashboard")}
          aria-label="Back"
        >
          <Icon name="chevron" size={18} />
        </button>
        <div>
          <span className="section-kicker">IDENTITY REGISTRY</span>
          <h1>User Directory & Access Control</h1>
          <p>Search, inspect, and manage accounts for all citizens and registered technicians.</p>
        </div>
      </div>

      <div className="user-directory-card card p-6 mt-6">
        <div className="user-dir-toolbar">
          <div className="search-wrap">
            <Icon name="search" size={18} />
            <input
              type="text"
              placeholder="Search by user name, phone, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="role-filter-group">
            <button
              type="button"
              className={roleFilter === "all" ? "active" : ""}
              onClick={() => setRoleFilter("all")}
            >
              All Users ({allUsers.length})
            </button>
            <button
              type="button"
              className={roleFilter === "citizen" ? "active" : ""}
              onClick={() => setRoleFilter("citizen")}
            >
              Citizens
            </button>
            <button
              type="button"
              className={roleFilter === "technician" ? "active" : ""}
              onClick={() => setRoleFilter("technician")}
            >
              Technicians
            </button>
          </div>
        </div>

        <div className="table-scroll mt-4">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Service Area</th>
                <th>Completed Jobs</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <b>{u.id}</b>
                  </td>
                  <td>{u.name}</td>
                  <td>
                    <span className={`role-tag ${u.role}`}>{u.role.toUpperCase()}</span>
                  </td>
                  <td>
                    <small>{u.phone}</small>
                  </td>
                  <td>{u.area}</td>
                  <td>
                    <b>{u.jobs}</b>
                  </td>
                  <td>
                    <span
                      className={`status ${u.status === "Active" ? "completed" : "in-progress"}`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <Button
                      kind="ghost"
                      size="sm"
                      onClick={() => alert(`Inspected user profile for ${u.name}`)}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
