import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useRequireAuth } from "../auth/useRequireAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
type Period = "7d" | "30d" | "this-month" | "this-year";
type Summary = {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  growthPercentage: number;
};
type SalesPoint = {
  date: string;
  label: string;
  revenue: number;
  orders: number;
};
type Product = {
  rank: number;
  id: number;
  name: string;
  image?: string;
  totalSold: number;
  totalRevenue: number;
  stock: number;
};
type OrderItem = {
  order_id: number;
  nama_pembeli: string;
  nama_produk: string;
  jumlah: number;
  harga_satuan: number;
};
type ApiResponse<T> = { data?: T } | T;

const emptySummary: Summary = {
  totalSales: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  growthPercentage: 0,
};
const numberValue = (value: unknown) => {
  const parsed =
    typeof value === "number"
      ? value
      : Number(String(value ?? 0).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
function unwrap<T>(payload: ApiResponse<T>): T {
  return typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    payload.data !== undefined
    ? (payload.data as T)
    : (payload as T);
}
function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}
function getPeriodDates(period: Period) {
  const today = new Date();
  const start = new Date(today);
  if (period === "7d") start.setDate(today.getDate() - 6);
  if (period === "30d") start.setDate(today.getDate() - 29);
  if (period === "this-month") start.setDate(1);
  if (period === "this-year") start.setMonth(0, 1);
  const end = new Date(today);
  end.setDate(end.getDate() + 1);
  return { startDate: toDateInput(start), endDate: toDateInput(end) };
}
function stockInfo(stock: number) {
  if (stock <= 5)
    return { label: "Kritis", className: "bg-red-50 text-red-700" };
  if (stock <= 20)
    return { label: "Terbatas", className: "bg-amber-50 text-amber-700" };
  return { label: "Aman", className: "bg-emerald-50 text-emerald-700" };
}
function imageUrl(image?: string) {
  return image
    ? image.startsWith("http") || image.startsWith("/")
      ? image
      : `${API_URL}/${image}`
    : undefined;
}

function DashboardChart({ points }: { points: SalesPoint[] }) {
  const width = 900,
    height = 250,
    padding = { top: 20, right: 18, bottom: 38, left: 18 };
  const chartWidth = width - padding.left - padding.right,
    chartHeight = height - padding.top - padding.bottom;
  const maxRevenue = Math.max(...points.map((point) => point.revenue), 1);
  const getX = (index: number) =>
    padding.left +
    (points.length === 1
      ? chartWidth / 2
      : (index / (points.length - 1)) * chartWidth);
  const getY = (value: number) =>
    padding.top + chartHeight - (value / maxRevenue) * chartHeight;
  const line = points
    .map((point, index) => `${getX(index)},${getY(point.revenue)}`)
    .join(" ");
  const area = `${padding.left},${height - padding.bottom} ${line} ${padding.left + chartWidth},${height - padding.bottom}`;
  const labels =
    points.length > 10
      ? points.filter((_, index) => index % Math.ceil(points.length / 7) === 0)
      : points;
  if (!points.length)
    return (
      <div className="flex h-[250px] items-center justify-center text-sm text-slate-400">
        Belum ada data penjualan.
      </div>
    );
  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[250px] min-w-[620px] w-full"
        role="img"
        aria-label="Grafik sales overview"
      >
        <defs>
          <linearGradient id="sales-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((ratio) => (
          <line
            key={ratio}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + chartHeight * ratio}
            y2={padding.top + chartHeight * ratio}
            stroke="#e2e8f0"
            strokeDasharray="4 6"
          />
        ))}
        <polygon points={area} fill="url(#sales-fill)" />
        <polyline
          points={line}
          fill="none"
          stroke="#f59e0b"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        {points.map((point, index) => (
          <circle
            key={point.date}
            cx={getX(index)}
            cy={getY(point.revenue)}
            r="4"
            fill="white"
            stroke="#f59e0b"
            strokeWidth="3"
          >
            <title>{`${point.label}: ${formatRupiah(point.revenue)} · ${point.orders} order`}</title>
          </circle>
        ))}
        {labels.map((point) => {
          const index = points.indexOf(point);
          return (
            <text
              key={point.date}
              x={getX(index)}
              y={height - 12}
              textAnchor="middle"
              className="fill-slate-400 text-[11px]"
            >
              {point.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function Dashboard() {
  const { checkingAuth, authenticated } = useRequireAuth();
  const [period, setPeriod] = useState<Period>("30d");
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [sales, setSales] = useState<SalesPoint[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderId, setOrderId] = useState("1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = window.localStorage.getItem("authToken");
    const dates = getPeriodDates(period);
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const query = new URLSearchParams({ ...dates, limit: "10" });
      const responses = await Promise.all([
        fetch(`${API_URL}/admin/dashboard/summary?${query}`, { headers }),
        fetch(`${API_URL}/admin/dashboard/sales-overview?${query}`, {
          headers,
        }),
        fetch(`${API_URL}/admin/dashboard/top-products?${query}`, { headers }),
        fetch(
          `${API_URL}/admin/dashboard/order-items?orderId=${encodeURIComponent(orderId)}`,
          { headers },
        ),
      ]);
      const failed = responses.find((response) => !response.ok);
      if (failed)
        throw new Error(`Dashboard API mengembalikan status ${failed.status}`);
      const [summaryPayload, salesPayload, productPayload, orderItemsPayload] =
        (await Promise.all(responses.map((response) => response.json()))) as [
          ApiResponse<Partial<Summary>>,
          ApiResponse<SalesPoint[]>,
          ApiResponse<Partial<Product>[]>,
          ApiResponse<OrderItem[]>,
        ];
      const summaryData = unwrap(summaryPayload),
        salesData = unwrap(salesPayload),
        productData = unwrap(productPayload),
        orderItemsData = unwrap(orderItemsPayload);
      setSummary({
        totalSales: numberValue(summaryData.totalSales),
        totalOrders: numberValue(summaryData.totalOrders),
        averageOrderValue: numberValue(summaryData.averageOrderValue),
        growthPercentage: numberValue(summaryData.growthPercentage),
      });
      setSales(
        (Array.isArray(salesData) ? salesData : []).map((point) => ({
          date: point.date,
          label: point.label || point.date,
          revenue: numberValue(point.revenue),
          orders: numberValue(point.orders),
        })),
      );
      setProducts(
        (Array.isArray(productData) ? productData : []).map(
          (product, index) => ({
            rank: numberValue(product.rank) || index + 1,
            id: numberValue(product.id),
            name: product.name || "Produk tanpa nama",
            image: product.image,
            totalSold: numberValue(product.totalSold),
            totalRevenue: numberValue(product.totalRevenue),
            stock: numberValue(product.stock),
          }),
        ),
      );
      setOrderItems(Array.isArray(orderItemsData) ? orderItemsData : []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal memuat data dashboard.",
      );
      setSummary(emptySummary);
      setSales([]);
      setProducts([]);
      setOrderItems([]);
    } finally {
      setLoading(false);
    }
  }, [orderId, period]);
  useEffect(() => {
    if (authenticated) void loadDashboard();
  }, [authenticated, loadDashboard]);
  const periodLabel = useMemo(
    () =>
      ({
        "7d": "7 hari terakhir",
        "30d": "30 hari terakhir",
        "this-month": "bulan ini",
        "this-year": "tahun ini",
      })[period],
    [period],
  );
  const growthUp = summary.growthPercentage >= 0;
  if (checkingAuth || !authenticated)
    return <div className="min-h-screen bg-slate-50" />;
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              Admin workspace
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Sales dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Pantau performa penjualan dan produk terbaik toko Anda.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative flex items-center">
              <CalendarDays className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value as Period)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-semibold shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              >
                <option value="7d">7 hari terakhir</option>
                <option value="30d">30 hari terakhir</option>
                <option value="this-month">Bulan ini</option>
                <option value="this-year">Tahun ini</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
            </label>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm hover:border-amber-300 hover:text-amber-600"
              aria-label="Muat ulang dashboard"
            >
              <RefreshCw
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </header>
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Data dashboard belum dapat dimuat</p>
              <p className="mt-1">
                {error}. Pastikan backend dan endpoint dashboard sudah aktif.
              </p>
            </div>
          </div>
        )}
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Total sales"
            value={formatRupiah(summary.totalSales)}
            detail={
              growthUp
                ? `Naik ${summary.growthPercentage.toFixed(1)}%`
                : `Turun ${Math.abs(summary.growthPercentage).toFixed(1)}%`
            }
            icon={<CircleDollarSign className="h-5 w-5" />}
            positive={growthUp}
            loading={loading}
          />
          <MetricCard
            title="Total orders"
            value={summary.totalOrders.toLocaleString("id-ID")}
            detail={`Periode ${periodLabel}`}
            icon={<ShoppingCart className="h-5 w-5" />}
            loading={loading}
          />
          <MetricCard
            title="Average order value"
            value={formatRupiah(summary.averageOrderValue)}
            detail="Rata-rata nilai transaksi"
            icon={<TrendingUp className="h-5 w-5" />}
            loading={loading}
          />
        </section>
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold">Sales overview</h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Pendapatan dan jumlah order pada {periodLabel}.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">
              Nilai dalam Rupiah
            </span>
          </div>
          {loading ? (
            <div className="h-[250px] animate-pulse rounded-xl bg-slate-100" />
          ) : (
            <DashboardChart points={sales} />
          )}
        </section>
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold">Detail order</h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Data dari orders, order_items, products, dan users.
              </p>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
              Order ID
              <input
                value={orderId}
                onChange={(event) =>
                  setOrderId(event.target.value.replace(/\D/g, ""))
                }
                className="w-24 rounded-lg border border-slate-200 px-3 py-2"
                inputMode="numeric"
              />
            </label>
          </div>
          {loading ? (
            <div className="h-24 animate-pulse bg-slate-100" />
          ) : orderItems.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Tidak ada item untuk order ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-4 py-3">Nama pembeli</th>
                    <th className="px-4 py-3">Nama produk</th>
                    <th className="px-4 py-3">Jumlah</th>
                    <th className="px-4 py-3">Harga satuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orderItems.map((item, index) => (
                    <tr key={`${item.order_id}-${item.nama_produk}-${index}`}>
                      <td className="px-6 py-4">{item.order_id}</td>
                      <td className="px-4 py-4 font-semibold">
                        {item.nama_pembeli}
                      </td>
                      <td className="px-4 py-4">{item.nama_produk}</td>
                      <td className="px-4 py-4">{numberValue(item.jumlah)}</td>
                      <td className="px-4 py-4 font-semibold">
                        {formatRupiah(numberValue(item.harga_satuan))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold">Top selling products</h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Produk paling banyak terjual pada periode aktif.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Top 10
            </span>
          </div>
          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Belum ada produk terjual pada periode ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Produk</th>
                    <th className="px-4 py-3 font-semibold">Terjual</th>
                    <th className="px-4 py-3 font-semibold">Omzet</th>
                    <th className="px-4 py-3 font-semibold">Stok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => {
                    const stock = stockInfo(product.stock);
                    const image = imageUrl(product.image);
                    return (
                      <tr key={product.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-400">
                          {product.rank}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              {image ? (
                                <img
                                  src={image}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package className="m-3 h-5 w-5 text-slate-400" />
                              )}
                            </div>
                            <span className="max-w-[280px] truncate font-semibold text-slate-800">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-700">
                          {product.totalSold.toLocaleString("id-ID")} unit
                        </td>
                        <td className="px-4 py-4 font-semibold text-emerald-600">
                          {formatRupiah(product.totalRevenue)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">
                              {product.stock}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stock.className}`}
                            >
                              {stock.label}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
function MetricCard({
  title,
  value,
  detail,
  icon,
  positive,
  loading,
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  positive?: boolean;
  loading: boolean;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          {icon}
        </span>
        {positive !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-bold ${positive ? "text-emerald-600" : "text-red-600"}`}
          >
            {positive ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {positive ? "Positif" : "Negatif"}
          </span>
        )}
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{title}</p>
      {loading ? (
        <div className="mt-2 h-8 w-40 animate-pulse rounded bg-slate-100" />
      ) : (
        <p className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </article>
  );
}
export default Dashboard;
