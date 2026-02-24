import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Mock data (bisa diganti fetch main.mo)
const summaryData = {
  AdminUser: { userPending: 5, partnerVerified: 12 },
  AdminFinance: { gmv: 50000000, withdrawPending: 3 },
  Asistenmu: { taskMasuk: 4, taskQA: 2, taskSelesai: 10 },
  Concierge: { openTickets: 7, searchUsersTask: 0 },
};

const mockListData = {
  AdminUser: [
    { name: "Budi", level: "Junior", verifiedSkill: ["Copywriting"] },
    { name: "Siti", level: "Senior", verifiedSkill: ["Design", "Social Media"] },
  ],
  AdminFinance: [
    { service: "Content Creation", unitActive: 10, unitOnHold: 2 },
    { service: "Social Media Management", unitActive: 5, unitOnHold: 1 },
  ],
  Asistenmu: [
    { task: "Desain Social Media", partner: "Budi", status: "On Progress" },
    { task: "Copywriting Blog", partner: "Siti", status: "QA" },
  ],
  Concierge: [
    { ticket: "Client A Issue", status: "Open" },
    { ticket: "Partner B Withdraw", status: "Closed" },
  ],
};

const mockHistoryData = {
  AdminUser: [{ name: "Dedi", action: "Approved", date: "12 Feb 2026" }],
  AdminFinance: [{ service: "Content Creation", date: "10 Feb 2026" }],
  Asistenmu: [{ task: "Copywriting Blog", status: "Selesai", date: "10 Feb 2026" }],
  Concierge: [{ ticket: "Partner B Issue", status: "Resolved", date: "11 Feb 2026" }],
};

type RoleKey = "AdminUser" | "AdminFinance" | "Asistenmu" | "Concierge";

const roles: RoleKey[] = ["AdminUser", "AdminFinance", "Asistenmu", "Concierge"];

type AdminUserListItem = { name: string; level: string; verifiedSkill: string[] };
type AdminFinanceListItem = { service: string; unitActive: number; unitOnHold: number };
type AsistenmListItem = { task: string; partner: string; status: string };
type ConciergeListItem = { ticket: string; status: string };

type AdminUserHistoryItem = { name: string; action: string; date: string };
type AdminFinanceHistoryItem = { service: string; date: string };
type AsistenmHistoryItem = { task: string; status: string; date: string };
type ConciergeHistoryItem = { ticket: string; status: string; date: string };

type SectionState = Record<RoleKey, { middle: boolean; bottom: boolean }>;
type OpenRolesState = Record<RoleKey, boolean>;

const buildInitialSections = (): SectionState =>
  roles.reduce((acc, r) => {
    acc[r] = { middle: false, bottom: false };
    return acc;
  }, {} as SectionState);

const buildInitialOpenRoles = (): OpenRolesState =>
  roles.reduce((acc, r) => {
    acc[r] = true; // default open
    return acc;
  }, {} as OpenRolesState);

const InternalDashboard = ({ role }: { role: string }) => {
  const [sections, setSections] = useState<SectionState>(buildInitialSections);
  const [openRoles, setOpenRoles] = useState<OpenRolesState>(buildInitialOpenRoles);

  const isSuperAdmin = role === "Admin" || role === "Superadmin";
  const rolesToRender: RoleKey[] = isSuperAdmin
    ? roles
    : roles.includes(role as RoleKey)
    ? [role as RoleKey]
    : [];

  const toggleRoleAccordion = (r: RoleKey) => {
    setOpenRoles((prev) => ({ ...prev, [r]: !prev[r] }));
  };

  const toggleSection = (r: RoleKey, section: "middle" | "bottom") => {
    setSections((prev) => ({
      ...prev,
      [r]: { ...prev[r], [section]: !prev[r][section] },
    }));
  };

  const renderSummaryCards = (r: RoleKey) => {
    switch (r) {
      case "AdminUser":
        return (
          <>
            <div className="p-4 bg-white shadow rounded text-center border border-slate-100">
              <p className="text-slate-500 text-sm">User Pending Approval</p>
              <p className="text-2xl font-bold text-navy mt-1">
                {summaryData.AdminUser.userPending}
              </p>
            </div>
            <div className="p-4 bg-white shadow rounded text-center border border-slate-100">
              <p className="text-slate-500 text-sm">Partner Verified Skill</p>
              <p className="text-2xl font-bold text-navy mt-1">
                {summaryData.AdminUser.partnerVerified}
              </p>
            </div>
          </>
        );
      case "AdminFinance":
        return (
          <>
            <div className="p-4 bg-white shadow rounded text-center border border-slate-100">
              <p className="text-slate-500 text-sm">GMV Total</p>
              <p className="text-2xl font-bold text-navy mt-1">
                Rp {summaryData.AdminFinance.gmv.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="p-4 bg-white shadow rounded text-center border border-slate-100">
              <p className="text-slate-500 text-sm">Withdraw Pending</p>
              <p className="text-2xl font-bold text-navy mt-1">
                {summaryData.AdminFinance.withdrawPending}
              </p>
            </div>
          </>
        );
      case "Asistenmu":
        return (
          <>
            <div className="p-4 bg-white shadow rounded text-center border border-slate-100">
              <p className="text-slate-500 text-sm">Task Masuk</p>
              <p className="text-2xl font-bold text-navy mt-1">
                {summaryData.Asistenmu.taskMasuk}
              </p>
            </div>
            <div className="p-4 bg-white shadow rounded text-center border border-slate-100">
              <p className="text-slate-500 text-sm">Task QA</p>
              <p className="text-2xl font-bold text-navy mt-1">
                {summaryData.Asistenmu.taskQA}
              </p>
            </div>
            <div className="p-4 bg-white shadow rounded text-center border border-slate-100">
              <p className="text-slate-500 text-sm">Task Selesai</p>
              <p className="text-2xl font-bold text-navy mt-1">
                {summaryData.Asistenmu.taskSelesai}
              </p>
            </div>
          </>
        );
      case "Concierge":
        return (
          <>
            <div className="p-4 bg-white shadow rounded text-center border border-slate-100">
              <p className="text-slate-500 text-sm">Open Tickets</p>
              <p className="text-2xl font-bold text-navy mt-1">
                {summaryData.Concierge.openTickets}
              </p>
            </div>
            <div className="p-4 bg-white shadow rounded text-center border border-slate-100">
              <p className="text-slate-500 text-sm">Search Users / Task</p>
              <p className="text-2xl font-bold text-navy mt-1">
                {summaryData.Concierge.searchUsersTask}
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderMiddleSection = (r: RoleKey) => {
    const list = mockListData[r] || [];
    return (
      <ul className="mt-3 space-y-2">
        {list.map((item, idx) => (
          <li
            key={idx}
            className="p-3 border border-slate-200 rounded-md bg-slate-50 text-sm text-slate-700"
          >
            {r === "AdminUser" && (
              <>
                <span className="font-medium">{(item as AdminUserListItem).name}</span>
                {" — "}
                {(item as AdminUserListItem).level}
                {" — "}
                {(item as AdminUserListItem).verifiedSkill.join(", ")}
              </>
            )}
            {r === "AdminFinance" && (
              <>
                <span className="font-medium">{(item as AdminFinanceListItem).service}</span>
                {" — Active: "}
                <span className="text-teal font-semibold">
                  {(item as AdminFinanceListItem).unitActive}
                </span>
                {", On Hold: "}
                <span className="text-amber-600 font-semibold">
                  {(item as AdminFinanceListItem).unitOnHold}
                </span>
              </>
            )}
            {r === "Asistenmu" && (
              <>
                <span className="font-medium">{(item as AsistenmListItem).task}</span>
                {" — Partner: "}
                {(item as AsistenmListItem).partner}
                {" — Status: "}
                <span className="font-semibold text-teal">
                  {(item as AsistenmListItem).status}
                </span>
              </>
            )}
            {r === "Concierge" && (
              <>
                <span className="font-medium">{(item as ConciergeListItem).ticket}</span>
                {" — Status: "}
                <span
                  className={`font-semibold ${
                    (item as ConciergeListItem).status === "Open"
                      ? "text-amber-600"
                      : "text-teal"
                  }`}
                >
                  {(item as ConciergeListItem).status}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const renderBottomSection = (r: RoleKey) => {
    const history = mockHistoryData[r] || [];
    return (
      <ul className="mt-3 space-y-2">
        {history.map((item, idx) => (
          <li
            key={idx}
            className="p-3 border border-slate-200 rounded-md bg-slate-50 text-sm text-slate-700"
          >
            {r === "AdminUser" && (
              <>
                <span className="font-medium">{(item as AdminUserHistoryItem).name}</span>
                {" — "}
                {(item as AdminUserHistoryItem).action}
                {" — "}
                <span className="text-slate-400">{(item as AdminUserHistoryItem).date}</span>
              </>
            )}
            {r === "AdminFinance" && (
              <>
                <span className="font-medium">{(item as AdminFinanceHistoryItem).service}</span>
                {" — "}
                <span className="text-slate-400">{(item as AdminFinanceHistoryItem).date}</span>
              </>
            )}
            {r === "Asistenmu" && (
              <>
                <span className="font-medium">{(item as AsistenmHistoryItem).task}</span>
                {" — "}
                {(item as AsistenmHistoryItem).status}
                {" — "}
                <span className="text-slate-400">{(item as AsistenmHistoryItem).date}</span>
              </>
            )}
            {r === "Concierge" && (
              <>
                <span className="font-medium">{(item as ConciergeHistoryItem).ticket}</span>
                {" — "}
                {(item as ConciergeHistoryItem).status}
                {" — "}
                <span className="text-slate-400">{(item as ConciergeHistoryItem).date}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Title */}
        <div className="mb-2">
          <h1 className="text-xl font-bold text-navy">Internal Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Role:{" "}
            <span className="font-medium text-teal">
              {isSuperAdmin ? role : role}
            </span>
          </p>
        </div>

        {/* Role Sections */}
        <div className="space-y-6">
          {rolesToRender.map((r) => (
            <section key={r} className="space-y-4">
              {/* Accordion header — only shown for Admin/Superadmin */}
              {isSuperAdmin && (
                <button
                  className="w-full flex items-center justify-between bg-white border border-slate-200 shadow-sm rounded-lg px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => toggleRoleAccordion(r)}
                >
                  <p className="font-bold text-lg text-navy">{r} Dashboard</p>
                  {openRoles[r] ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              )}

              {/* Role content — always visible for non-admin, toggled for admin */}
              {(isSuperAdmin ? openRoles[r] : true) && (
                <>
                  {/* Summary Cards */}
                  <section className="grid gap-4 md:grid-cols-4">
                    {renderSummaryCards(r)}
                  </section>

                  {/* Middle Section */}
                  <section
                    className="bg-white shadow rounded p-4 cursor-pointer border border-slate-100"
                    onClick={() => toggleSection(r, "middle")}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg text-navy">
                        Details / List Section
                      </p>
                      {sections[r].middle ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {sections[r].middle ? "Klik untuk tutup" : "Klik untuk buka"}
                    </p>
                    {sections[r].middle && renderMiddleSection(r)}
                  </section>

                  {/* Bottom Section */}
                  <section
                    className="bg-white shadow rounded p-4 cursor-pointer border border-slate-100"
                    onClick={() => toggleSection(r, "bottom")}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-lg text-navy">
                        History / Tickets Section
                      </p>
                      {sections[r].bottom ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {sections[r].bottom ? "Klik untuk tutup" : "Klik untuk buka"}
                    </p>
                    {sections[r].bottom && renderBottomSection(r)}
                  </section>
                </>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternalDashboard;
