import Link from "next/link";
import SignupComponent from "./SignupComponent";

export default function SignUpPage() {
 

  return (
    <div className="flex items-center justify-center p-5 min-h-[70vh]">
      <div className="w-full max-w-3xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl border border-red-400/20 rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side */}
        <div className="flex flex-col justify-center p-6 sm:p-8 text-white bg-linear-to-br from-[#800020] to-[#3b000f]">
          <h2 className="text-4xl font-bold mb-4">Join Our Store</h2>

          <p className="text-white/80">
            Create an account to track orders, save your wishlist, and enjoy
            exclusive member deals.
          </p>

          <div className="mt-10">
            <p className="text-sm text-white/70">Already have an account?</p>

            <Link
              href="/signin"
              className="inline-block mt-4 px-6 py-2 rounded-lg bg-white text-[#800020] font-semibold hover:bg-gray-200 transition w-full text-center"
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
