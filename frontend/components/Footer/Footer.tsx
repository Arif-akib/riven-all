import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import WebWrapper from "../Wrapper/webWrapper";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-white pt-16 pb-8">
      <WebWrapper>
        {/* Top Grid */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/">
              <h2 className="text-2xl font-bold text-white mb-3 italic">
                Riven
              </h2>
            </Link>
            <p className="text-sm">
              Discover premium products with unbeatable prices and fast
              delivery.
            </p>

            <div className="flex gap-3 mt-4">
              <Facebook className="cursor-pointer hover:text-white" />
              <Instagram className="cursor-pointer hover:text-white" />
              <Twitter className="cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products">All Products</Link>
              </li>
              <li>
                <Link href="/categories">Categories</Link>
              </li>
              
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Offers</h3>
            <ul className="space-y-2 text-sm">
             <li>
                <Link href="/deals">Hot Deals</Link>
              </li>
              <li>
                <Link href="/new">New Arrivals</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}

          <div>
            <h3 className="text-white font-semibold mb-4">Get In Touch</h3>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1" size={18} />
                <span>123 Commerce Street, Dhaka, Bangladesh</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="" size={18} />
                <span>+880 1234 567 890</span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="" size={18} />
                <span>support@shopverse.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/50 pt-6 text-center text-xs">
          © {new Date().getFullYear()} Riven BD . All rights reserved.
        </div>
      </WebWrapper>
    </footer>
  );
}
