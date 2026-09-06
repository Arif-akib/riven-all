import Link from "next/link";
import SignInComponent from "./SignInComponent";

export default function SignInPage() {


  return (
    <div className="flex items-center justify-center p-5  min-h-[70vh]">
      <div className="w-full max-w-3xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl border border-red-400/20 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side */}
        <div className="flex flex-col justify-center p-12 text-white bg-linear-to-br from-[#800020] to-[#3b000f]">
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>

          <p className="text-white/80 leading-relaxed">
            Sign in to access your orders, wishlist, and exclusive deals. Shop
            smarter with a personalized experience.
          </p>

          <div className="mt-10">
            <p className="text-sm text-white/70">New to our store?</p>

            <Link
              href="/signup"
              className="inline-block mt-3 px-6 py-2 rounded-lg bg-white text-[#800020] font-semibold hover:bg-gray-200 transition w-full text-center"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-10 bg-white">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>

          <p className="text-gray-500 mb-5">
            Enter your credentials to continue
          </p>

          <SignInComponent/>
        </div>
      </div>
    </div>
  );
}
