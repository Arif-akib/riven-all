import { Search, UserRound, Heart, ShoppingCart } from "lucide-react";

const navbarData = [
  {
    name: "Home",
    link: "/",
    query:''
  },
  {
    name: "Shop",
    link: "/shop",
    query:''
  },
  {
    name: "New Arrival",
    link: "/new_arrival",
    query:'?new=true'
  },
  {
    name: "Offer",
    link: "/offer",
    query:'?offer=true'
  },
  {
    name: "Contact",
    link: "/contact",
    query:''
  },
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
