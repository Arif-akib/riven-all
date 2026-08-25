import Link from "next/link";
import SignupComponent from "./SignupComponent";

export default function SignUpPage() {
 

  return (
    <div className="flex items-center justify-center px-5 pt-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side */}
        <div className="flex flex-col justify-center p-12 text-white bg-linear-to-br from-[#800020] to-[#3b000f]">
          <h2 className="text-4xl font-bold mb-4">Join Our Store</h2>

          <p className="text-white/80">
            Create an account to track orders, save your wishlist, and enjoy
            exclusive member deals.
          </p>

          <div className="mt-10">
            <p className="text-sm text-white/70">Already have an account?</p>

            <Link
              href="/signin"
              className="inline-block mt-2 px-6 py-2 rounded-lg bg-white text-[#800020] font-semibold hover:bg-gray-200 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <SignupComponent/>
      </div>
    </div>
  );
}
