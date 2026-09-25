# Panduan Dashboard Admin Penjualan TokoKelontong

**Status:** Panduan implementasi
**Versi:** 1.0
**Bahasa antarmuka:** Bahasa Indonesia
**Stack yang digunakan:** React 19, React Router v7, TypeScript, Tailwind CSS, Express.js, MySQL, JWT

## 1. Tujuan dan ruang lingkup

Dashboard ini digunakan admin atau pemilik toko untuk memantau performa penjualan dalam satu halaman. Fitur minimum yang wajib tersedia:

1. **Sales Overview** — tren penjualan berdasarkan periode waktu.
2. **Top Selling Products** — daftar produk terlaris.
3. **Total Sales (dalam Rupiah)** — total nilai transaksi yang berhasil.

Dashboard tidak boleh menggunakan data keranjang sebagai data penjualan. Keranjang hanya menunjukkan niat membeli; penjualan hanya tercatat setelah order berhasil dibayar atau diselesaikan.

### 1.1 Kondisi sistem saat ini

Proyek saat ini sudah memiliki:

- tabel `products` dengan kolom `price`, `sold`, dan `stock`;
- tabel `cart_items` untuk keranjang pengguna;
- autentikasi JWT melalui `authMiddleware`;
- backend Express pada `backend/app.js`;
- frontend React Router dan Tailwind CSS.

Kolom `products.sold` bersifat akumulatif sehingga belum dapat digunakan untuk laporan berdasarkan tanggal. Untuk mendukung dashboard yang akurat, tambahkan riwayat transaksi melalui tabel `orders` dan `order_items`.

## 2. Kebutuhan fungsional

### FR-01 — Total Sales dalam Rupiah

Dashboard harus menampilkan total nilai order berstatus penjualan berhasil pada periode yang dipilih.

**Status yang dihitung sebagai penjualan:** `PAID` dan/atau `COMPLETED`.

**Status yang tidak dihitung:** `PENDING`, `CANCELLED`, dan `REFUNDED`.

Rumus dasar:

```text
Total Sales = SUM(order_items.subtotal)
Subtotal item = harga pada saat transaksi × quantity
```

Jika biaya pengiriman atau diskon diterapkan, simpan nilainya pada `orders` dan gunakan rumus:

```text
Net Sales = subtotal item - discount_amount + shipping_amount
```

Ketentuan tampilan:

- gunakan nilai numerik integer dalam Rupiah;
- format frontend menggunakan `Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })`;
- contoh tampilan: `Rp 48.500.000`;
- jangan menghitung total dari string `products.price` di frontend jika data transaksi tersedia di backend.

Kartu ringkasan yang direkomendasikan:

- Total Sales;
- Total Orders;
- Average Order Value (AOV), yaitu `Total Sales / Total Orders`;
- persentase pertumbuhan dibanding periode sebelumnya.

### FR-02 — Sales Overview

Tampilkan grafik pendapatan dari waktu ke waktu. Grafik minimum berupa line chart atau area chart. Library chart belum tersedia pada `package.json`, sehingga implementasi awal dapat menggunakan SVG/CSS atau tim dapat menambahkan library chart setelah disetujui.

Preset filter:

- `7d` — tujuh hari terakhir;
- `30d` — tiga puluh hari terakhir;
- `this-month` — bulan berjalan;
- `this-year` — tahun berjalan;
- rentang tanggal khusus dengan `startDate` dan `endDate`.

Setiap titik data minimal berisi:

```json
{
  "date": "2026-09-24",
  "label": "24 Sep",
  "revenue": 1250000,
  "orders": 8
}
```

Aturan:

- tanggal pada grafik harus berurutan menaik;
- tanggal tanpa transaksi tetap dikembalikan dengan nilai `revenue: 0` dan `orders: 0`;
- zona waktu laporan harus konsisten dengan zona waktu bisnis toko;
- tooltip menampilkan tanggal, pendapatan, dan jumlah order.

### FR-03 — Top Selling Products

Tampilkan maksimal 10 produk dengan penjualan tertinggi pada periode aktif.

Kolom tabel:

| Kolom | Keterangan |
|---|---|
| Rank | Urutan produk |
| Produk | Thumbnail dan nama |
| Terjual | Total unit pada order berhasil |
| Omzet | Total `subtotal` produk |
| Stok | Stok saat ini dari `products.stock` |
| Status stok | Aman, terbatas, atau kritis |

Urutan default:

1. `total_sold` terbesar;
2. jika sama, `total_revenue` terbesar;
3. jika masih sama, nama produk secara alfabetis.

Status stok:

- **Aman:** lebih dari 20 unit;
- **Terbatas:** 6–20 unit;
- **Kritis:** 0–5 unit.

Produk yang telah dihapus tidak boleh menghilangkan histori transaksi. Karena itu, pertimbangkan `ON DELETE RESTRICT` pada foreign key produk transaksi atau simpan snapshot nama produk pada `order_items`.

## 3. Desain database

Skema berikut adalah perubahan yang diusulkan. Terapkan melalui migration atau inisialisasi database, bukan dengan menghapus data produksi.

```sql
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  subtotal_amount BIGINT UNSIGNED NOT NULL DEFAULT 0,
  discount_amount BIGINT UNSIGNED NOT NULL DEFAULT 0,
  shipping_amount BIGINT UNSIGNED NOT NULL DEFAULT 0,
  total_amount BIGINT UNSIGNED NOT NULL DEFAULT 0,
  payment_status ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED', 'COMPLETED')
    NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_orders_status_date (payment_status, created_at),
  INDEX idx_orders_user (user_id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  unit_price BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  subtotal BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_product (product_id),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

`product_name` dan `unit_price` adalah snapshot pada saat order dibuat. Dengan demikian, perubahan harga atau nama produk di masa depan tidak mengubah laporan transaksi lama.

Jika tabel user memiliki foreign key yang stabil, tambahkan relasi `orders.user_id` ke tabel tersebut setelah struktur database diverifikasi. Jangan menebak nama kolom role sebelum role admin benar-benar tersedia pada model user.

## 4. Query agregasi backend

Semua query dashboard wajib menggunakan parameter binding (`?`) dan validasi tanggal dari request.

### 4.1 Summary

```sql
SELECT
  COALESCE(SUM(total_amount), 0) AS total_sales,
  COUNT(*) AS total_orders,
  COALESCE(AVG(total_amount), 0) AS average_order_value
FROM orders
WHERE payment_status IN ('PAID', 'COMPLETED')
  AND created_at >= ?
  AND created_at < ?;
```

### 4.2 Sales overview

```sql
SELECT
  DATE(created_at) AS sales_date,
  COALESCE(SUM(total_amount), 0) AS revenue,
  COUNT(*) AS orders
FROM orders
WHERE payment_status IN ('PAID', 'COMPLETED')
  AND created_at >= ?
  AND created_at < ?
GROUP BY DATE(created_at)
ORDER BY sales_date ASC;
```

Backend atau frontend harus mengisi tanggal yang tidak muncul dari hasil query dengan nilai nol agar grafik tidak menyesatkan.

### 4.3 Top products

```sql
SELECT
  p.id,
  p.name,
  p.image,
  p.stock,
  SUM(oi.quantity) AS total_sold,
  SUM(oi.subtotal) AS total_revenue
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
JOIN products p ON p.id = oi.product_id
WHERE o.payment_status IN ('PAID', 'COMPLETED')
  AND o.created_at >= ?
  AND o.created_at < ?
GROUP BY p.id, p.name, p.image, p.stock
ORDER BY total_sold DESC, total_revenue DESC, p.name ASC
LIMIT ?;
```

## 5. REST API contract

Gunakan prefix `/admin/dashboard` agar konsisten dengan backend Express saat ini. Semua endpoint harus dilindungi JWT dan, setelah role tersedia, pemeriksaan role admin.

### GET `/admin/dashboard/summary`

Query:

```text
?startDate=2026-09-01&endDate=2026-09-25
```

`endDate` diperlakukan eksklusif pada pukul 00:00 hari berikutnya agar seluruh transaksi pada tanggal akhir ikut terhitung.

Response `200`:

```json
{
  "success": true,
  "data": {
    "totalSales": 48500000,
    "totalOrders": 320,
    "averageOrderValue": 151562,
    "growthPercentage": 14.8
  }
}
```

### GET `/admin/dashboard/sales-overview`

Query:

```text
?range=30d
```

Response `200`:

```json
{
  "success": true,
  "data": [
    { "date": "2026-09-01", "label": "01 Sep", "revenue": 1450000, "orders": 10 },
    { "date": "2026-09-02", "label": "02 Sep", "revenue": 0, "orders": 0 }
  ]
}
```

### GET `/admin/dashboard/top-products`

Query:

```text
?startDate=2026-09-01&endDate=2026-09-25&limit=10
```

Response `200`:

```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "id": 12,
      "name": "Parfum YSL",
      "image": "/assets/images/parfumysl.jpg",
      "totalSold": 84,
      "totalRevenue": 155400000,
      "stock": 16,
      "stockStatus": "LIMITED"
    }
  ]
}
```

### Error response

Gunakan format konsisten:

```json
{ "success": false, "message": "Rentang tanggal tidak valid", "code": "INVALID_DATE_RANGE" }
```

Status HTTP:

- `400` parameter tidak valid;
- `401` token tidak ada atau kedaluwarsa;
- `403` user bukan admin;
- `500` kegagalan database atau server.

## 6. Panduan UI/UX frontend

File utama: `app/src/admin/dashboard.tsx`.

Tambahkan route berikut ke `app/routes.ts`:

```ts
route("/admin/dashboard", "./src/admin/dashboard.tsx")
```

Struktur tampilan yang direkomendasikan:

```text
Admin Layout
├── Admin Sidebar
│   ├── Dashboard
│   ├── Orders
│   ├── Products
│   ├── Customers
│   ├── Marketing
│   ├── Reports
│   └── Settings
└── Konten halaman aktif
    └── Dashboard Admin
        ├── Header: judul, waktu sinkronisasi, filter periode
        ├── KPI cards
        │   ├── Total Sales (Rp)
        │   ├── Total Orders
        │   └── Average Order Value
        ├── Sales Overview
        │   ├── preset periode
        │   ├── grafik tren
        │   └── tooltip pendapatan dan transaksi
        └── Top Selling Products
            └── tabel produk, omzet, unit terjual, dan stok
```

### 6.1 Sidebar Admin

Sidebar menjadi navigasi utama untuk seluruh area admin. Implementasikan layout
terpusat pada `app/src/admin/AdminLayout.tsx` dan komponen navigasi pada
`app/src/admin/components/AdminSidebar.tsx`. Layout menggunakan `<Outlet />`
agar satu sidebar dapat digunakan oleh semua halaman admin.

#### Daftar menu

| Label | Rute | Ikon `lucide-react` | Fungsi |
|---|---|---|---|
| Dashboard | `/admin/dashboard` | `LayoutDashboard` | Ringkasan performa penjualan |
| Orders | `/admin/orders` | `ShoppingCart` | Pesanan dan status transaksi |
| Products | `/admin/products` | `Package` | Katalog, harga, dan stok |
| Customers | `/admin/customers` | `Users` | Data pelanggan dan riwayat pembelian |
| Marketing | `/admin/marketing` | `Megaphone` | Promosi, voucher, dan kampanye |
| Reports | `/admin/reports` | `FileBarChart` | Laporan dan ekspor data |
| Settings | `/admin/settings` | `Settings` | Pengaturan toko dan admin |

#### Perilaku UI/UX

- Pada desktop (`lg` ke atas), sidebar tampil tetap di sisi kiri dengan lebar
  sekitar `16rem`; konten utama diberi ruang yang sesuai dan tidak tertutup.
- Pada layar yang lebih kecil, sidebar berubah menjadi drawer. Tombol hamburger
  pada header membuka drawer dan backdrop menutupnya ketika diklik.
- Gunakan `NavLink` untuk active state. Menu aktif harus memiliki kontras
  visual yang jelas, bukan hanya perbedaan warna ikon, dan dapat diakses melalui
  keyboard.
- Sidebar memiliki identitas `TokoKelontong`, label `Admin`, tautan kembali ke
  `/home`, serta tombol logout yang menghapus `authToken` dari `localStorage`.
- Semua rute admin wajib berada di bawah `AdminLayout` dan menggunakan
  `useRequireAuth` pada layout agar halaman admin tidak dapat dibuka tanpa token.
- Menu yang belum memiliki fitur backend tetap harus memiliki route placeholder
  agar navigasi tidak menghasilkan 404. Placeholder hanya memberi informasi
  bahwa fitur sedang disiapkan dan tidak boleh mengklaim data sudah tersedia.

Struktur route yang direkomendasikan:

```ts
layout("./src/admin/AdminLayout.tsx", [
  route("/admin/dashboard", "./src/admin/dashboard.tsx"),
  route("/admin/orders", "./src/admin/placeholder.tsx"),
  route("/admin/products", "./src/admin/placeholder.tsx"),
  route("/admin/customers", "./src/admin/placeholder.tsx"),
  route("/admin/marketing", "./src/admin/placeholder.tsx"),
  route("/admin/reports", "./src/admin/placeholder.tsx"),
  route("/admin/settings", "./src/admin/placeholder.tsx"),
])
```

Implementasi sidebar tahap pertama tidak mencakup logika CRUD untuk menu-menu
tersebut; tahap ini hanya menyiapkan navigasi dan layout admin.

Ketentuan antarmuka:

- tampilkan skeleton saat data sedang dimuat;
- tampilkan pesan error yang dapat dipahami pengguna;
- tampilkan empty state jika tidak ada transaksi;
- gunakan layout responsif untuk mobile, tablet, dan desktop;
- jangan menyimpan token di URL;
- gunakan `Authorization: Bearer <authToken>` mengikuti pola yang sudah dipakai pada `cart.tsx`;
- tombol filter dan tabel harus dapat digunakan melalui keyboard;
- warna merah untuk stok kritis tidak boleh menjadi satu-satunya penanda; sertakan teks status.

Utility format Rupiah:

```ts
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}
```

## 7. Keamanan, akurasi, dan performa

### Keamanan

- lindungi route dashboard dengan `authMiddleware`;
- tambahkan pemeriksaan role admin sebelum dashboard digunakan di produksi;
- gunakan query parameter binding untuk mencegah SQL injection;
- validasi `limit` dengan rentang, misalnya 1–50;
- jangan mengirim password atau data pribadi yang tidak diperlukan ke frontend.

### Akurasi

- simpan nilai uang sebagai `BIGINT` dalam Rupiah, bukan floating point;
- snapshot harga pada `order_items`;
- hanya hitung status `PAID`/`COMPLETED`;
- gunakan batas tanggal eksklusif untuk menghindari transaksi akhir hari terlewat;
- uji refund dan pembatalan secara terpisah.

### Performa

- gunakan index gabungan `(payment_status, created_at)`;
- batasi jumlah produk dengan `LIMIT`;
- hindari tiga request yang tidak perlu jika satu endpoint agregator dapat digunakan;
- target waktu respons endpoint dashboard di bawah 500 ms pada data normal;
- pertimbangkan cache singkat setelah data transaksi bertambah besar.

## 8. Rencana implementasi

1. Buat migration `orders` dan `order_items`.
2. Pastikan proses checkout membuat order dan item transaksi dalam database transaction.
3. Buat `dashboardModel.js` berisi query summary, overview, dan top products.
4. Buat `dashboardController.js` untuk validasi parameter dan response JSON.
5. Buat `dashboardRoutes.js`, pasang `authMiddleware`, lalu daftarkan di `backend/app.js`.
6. Tambahkan route frontend `/admin/dashboard`.
7. Buat `AdminLayout` dan `AdminSidebar`, lalu daftarkan tujuh menu admin.
8. Tambahkan placeholder untuk menu admin yang belum memiliki halaman.
9. Implementasikan state loading, error, empty, filter periode, KPI cards, grafik, dan tabel.
10. Tambahkan pemeriksaan role admin ketika data role sudah tersedia.
11. Lakukan pengujian integrasi dengan data transaksi nyata atau seed data khusus.

## 9. Acceptance criteria

- Admin dapat membuka `/admin/dashboard` setelah login.
- User tanpa token menerima `401` atau `403` dan tidak melihat data dashboard.
- Total Sales hanya menjumlahkan transaksi berhasil.
- Nominal tampil dalam format Rupiah tanpa desimal.
- Sales Overview menampilkan data sesuai periode dan tetap menampilkan tanggal tanpa transaksi sebagai nol.
- Top Selling Products terurut berdasarkan unit terjual.
- Stok kritis memiliki indikator teks yang jelas.
- Filter tanggal menampilkan hasil yang konsisten di tiga bagian dashboard.
- Kesalahan API menampilkan pesan yang dapat dipahami.
- Layout dapat digunakan pada layar mobile dan desktop.
- Sidebar menampilkan menu Dashboard, Orders, Products, Customers, Marketing, Reports, dan Settings.
- Menu yang sedang aktif memiliki active state yang jelas dan navigasi tidak melakukan full-page reload.
- Sidebar desktop tetap terlihat, sedangkan sidebar mobile dapat dibuka dan ditutup melalui drawer.
- Tautan kembali ke toko dan logout tersedia pada sidebar.

