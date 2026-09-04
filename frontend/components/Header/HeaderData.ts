import { Search, UserRound, Heart, ShoppingCart } from "lucide-react";

const navbarData = [
  {
    name: "Collections",
    link: "/shop",
    query: "",
    hasMegaMenu: true,
    categories: [
      {
        title: "Apparel & Fashion",
        href: "/category/fashion",
        featured: true,
        items: ["Men's Wear", "Women's Collection", "Streetwear", "Footwear", "Accessories"],
      },
      {
        title: "Electronics & Tech",
        href: "/category/electronics",
        items: ["Audio & Headphones", "Smartwatches", "Laptops & Tablets", "Gaming Accessories"],
      },
      {
        title: "Home & Living",
        href: "/category/home",
        items: ["Furniture", "Lighting", "Decor", "Kitchenware"],
      },
      {
        title: "Beauty & Wellness",
        href: "/category/beauty",
        highlight: true,
        items: ["Skincare", "Fragrances", "Haircare", "Organic Care"],
      },
    ],
  },
  {
    name: "Home",
    link: "/",
    query: "",
  },
  {
    name: "Shop",
    link: "/shop",
    query: "",
  },
  {
    name: "New Arrivals",
    link: "/new_arrival",
    query: "?new=true",
    badge: "HOT",
  },
  {
    name: "Flash Deals",
    link: "/offer",
    query: "?offer=true",
    icon: true,
  },
  // {
  //   name: "Our Story",
  //   link: "/brand",
  //   query: "",
  // },
];

const navbarDataSecondary = [
  {
    name: "Search",
    link: "",
    icon: Search,
    type: "search",
  },
  {
    name: "Account",
    link: "/user/dashboard",
    icon: UserRound,
    type: "account",
  },
  {
    name: "Wishlist",
    link: "/wishlist",
    icon: Heart,
    type: "wish",
  },
  {
    name: "Cart",
    link: "/cart",
    icon: ShoppingCart,
    type: "cart",
  },
];

export { navbarData, navbarDataSecondary };
