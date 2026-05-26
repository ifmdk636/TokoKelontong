import { type RouteConfig, route, index } from "@react-router/dev/routes";

const routes: RouteConfig = [
  index("./routes/home.tsx"),
  route("/card/:id", "./src/components/card.tsx"),
  route("/product", "./src/product/productList.tsx"),
  route("/productdetail/:id", "./src/product/detailProduct.tsx"),

  // Routes Users
  route("/login", "./src/users/login.tsx"),
];

export default routes;
