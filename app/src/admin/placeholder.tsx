import { ArrowLeft, Construction } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const labels: Record<string, string> = {
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/customers": "Customers",
  "/admin/marketing": "Marketing",
  "/admin/reports": "Reports",
  "/admin/settings": "Settings",
};

export default function AdminPlaceholder() {
  const { pathname } = useLocation();
  const title = labels[pathname] ?? "Halaman admin";

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Construction className="mx-auto h-12 w-12 text-amber-500" />
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
            Admin workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Menu ini sudah tersedia di sidebar dan sedang disiapkan untuk tahap
            implementasi berikutnya.
          </p>
          <Link
            to="/admin/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}