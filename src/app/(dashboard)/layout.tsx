import DashboardNavbar from "@/components/DashboardNavbar";
import "./dashboard.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="capitol">
      <div className="capitol-shell">
        <DashboardNavbar />
        <main className="capitol-main">
          <div className="capitol-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
