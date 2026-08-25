"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Info,
  AlertCircle,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
} from "lucide-react";
import WebWrapper from "@/components/Wrapper/webWrapper";

export default function PremiumContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="">
      {/* Hero */}
      <section className="bg-linear-to-r from-[#800000] via-[#6b0000] to-[#4a0000] text-white pt-14 pb-24 px-6 text-center relative overflow-hidden">
        <WebWrapper>
          <h1 className="text-5xl font-extrabold z-10 relative">Contact Us</h1>
          <p className="mt-4 text-lg max-w-xl mx-auto z-10 relative">
            Need assistance or want to claim a warranty? Our support team is
            here 24/7.
          </p>
        </WebWrapper>
      </section>

      {/* Main Grid */}
      <WebWrapper>
        <section className="max-w-7xl mx-auto md:px-6 -mt-16 grid md:grid-cols-2 gap-12 items-start z-10 relative">
          <div className="grid gap-6">
            {/* Products with Warranty */}
            <div className="bg-white shadow-2xl rounded-3xl p-8 flex flex-col gap-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <ShieldCheck className="text-[#7b1e2b] w-12 h-12" />
                <h3 className="text-2xl font-bold">Products with Warranty</h3>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2">
                <li>Smart Watches , Fitness Bands</li>
                <li>Digital Watches, Classic Watches</li>
                <li>Premium Watches</li>
              </ul>
            </div>

            {/* How to Claim Warranty */}
            <div className="bg-white shadow-2xl rounded-3xl p-8 flex flex-col gap-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <Info className="text-[#7b1e2b] w-12 h-12" />
                <h3 className="text-2xl font-bold">How to Claim Warranty</h3>
              </div>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 pl-2">
                <li>Keep your purchase invoice or receipt.</li>
                <li>Contact support via form, email, or phone.</li>
                <li>
                  Provide order number, product details, and issue description.
                </li>
                <li>Follow instructions for repair, replacement, or refund.</li>
                <li>Warranty coverage verified per product terms.</li>
              </ol>
            </div>

            {/* Quick Tips */}
            <div className="bg-white shadow-2xl rounded-3xl p-8 flex flex-col gap-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <AlertCircle className="text-[#7b1e2b] w-12 h-12" />
                <h3 className="text-2xl font-bold">Quick Tips</h3>
              </div>
              <p className="text-gray-700 mb-1">
                Check the product page for warranty duration before purchase.
              </p>
              <p className="text-gray-700">
                Always keep your invoice for faster claims.
              </p>
            </div>
            <div className="bg-white shadow-2xl rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold text-[#7b1e2b] mb-4">
                Connect with Us
              </h3>
              <p className="text-gray-700 mb-3">
                Follow us on social media for updates, offers, and support.
              </p>
              <div className="flex justify-center gap-6 text-[#7b1e2b]">
                <a
                  href="https://facebook.com/yourpage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#912638] transition"
                >
                  <Facebook className="w-8 h-8" />
                </a>
                <a
                  href="https://instagram.com/yourpage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#912638] transition"
                >
                  <Instagram className="w-8 h-8" />
                </a>
                <a
                  href="https://youtube.com/yourchannel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#912638] transition"
                >
                  <Youtube className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white shadow-2xl rounded-3xl p-8 flex flex-col gap-4 hover:scale-105 transition-transform duration-300">
              <h2 className="text-3xl font-bold text-[#7b1e2b] flex items-center gap-2">
                <ShieldCheck className="w-8 h-8" /> Our Support
              </h2>
              <p className="text-gray-700">
                24/7 support and warranty guidance for select products. Reach
                out via form, email, or phone.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="text-[#7b1e2b] w-6 h-6" /> +880 9666 737475
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-[#7b1e2b] w-6 h-6" />{" "}
                  support@kaicombd.com
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-[#7b1e2b] w-6 h-6" /> Dhanmondi, Dhaka
                  Bangladesh
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-[#7b1e2b] w-6 h-6" /> Sat–Thu: 9AM–9PM
                  | Fri: 2PM–9PM
                </div>
              </div>
            </div>
            <div className="bg-white shadow-2xl rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#7b1e2b] rounded-full opacity-10 animate-pulse"></div>
              <h2 className="text-3xl font-bold text-[#7b1e2b] mb-6">
                Send Us a Message
              </h2>

              {submitted && (
                <p className="text-green-600 font-medium mb-4">
                  Your message has been sent successfully!
                </p>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#7b1e2b] outline-none transition"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#7b1e2b] outline-none transition"
                />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#7b1e2b] outline-none transition"
                />
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#7b1e2b] outline-none transition"
                >
                  <option value="">Select Subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="order">Order Status</option>
                  <option value="warranty">Warranty Claim</option>
                  <option value="feedback">Feedback</option>
                </select>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#7b1e2b] outline-none h-36 resize-none transition"
                />
                <button
                  type="submit"
                  className="w-full bg-[#7b1e2b] text-white py-3 rounded-full font-bold hover:opacity-90 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </WebWrapper>
    </div>
  );
}
