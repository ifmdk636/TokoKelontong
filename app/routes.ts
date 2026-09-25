import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

const routes: RouteConfig = [
  index("./routes/home.tsx"),
  route("/home", "./routes/home.tsx", { id: "home-route" }),
  route("/card/:id", "./src/components/card.tsx"),
  route("/productdetail/:id", "./src/product/detailProduct.tsx"),
  route("/cart", "./src/product/cart.tsx"),

  // Routes Users
  route("/login", "./src/users/login.tsx"),
  route("/register", "./src/users/register.tsx"),
  route("/myprofile", "./src/users/profile.tsx"),
  route("/settings", "./src/users/settings.tsx"),

  // Admin
  layout("./src/admin/AdminLayout.tsx", [
    route("/admin/dashboard", "./src/admin/dashboard.tsx"),
    route("/admin/orders", "./src/admin/placeholder.tsx", {
      id: "admin-orders",
    }),
    route("/admin/products", "./src/admin/placeholder.tsx", {
      id: "admin-products",
    }),
    route("/admin/customers", "./src/admin/placeholder.tsx", {
      id: "admin-customers",
    }),
    route("/admin/marketing", "./src/admin/placeholder.tsx", {
      id: "admin-marketing",
    }),
    route("/admin/reports", "./src/admin/placeholder.tsx", {
      id: "admin-reports",
    }),
    route("/admin/settings", "./src/admin/placeholder.tsx", {
      id: "admin-settings",
    }),
  ]),
];

export default routes;
