// app/page.tsx (sau similar)
// import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
  
    <div className="min-h-screen flex flex-col items-center p-8 pb-20 sm:p-20 bg-white"> 
    
      <section className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white w-full max-w-4xl rounded-lg mb-12 p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Personalized AI Meal Plans</h1>
        <p className="text-xl mb-6">
          Let our AI do the planning. You focus on cooking and enjoying!
        </p>
        <Link
          href="/sign-up"
          className="inline-block bg-white text-emerald-500 font-medium px-5 py-3 rounded hover:bg-gray-100 transition-colors"
        >
          Get Started
        </Link>
      </section>

    
      <section id="how-it-works" className="w-full max-w-4xl mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">How It Works</h2> 
          <p className="mt-2 text-gray-600"> 
            Follow these simple steps to get your personalized meal plan
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8">

        
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="bg-emerald-500 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v7m-3-3h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-900">Create an Account</h3> 
            <p className="text-center text-gray-600"> 
              Sign up or sign in to access your personalized meal plans.
            </p>
          </div>

         
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="bg-emerald-500 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-900">Set Your Preferences</h3> 
            <p className="text-center text-gray-600">
              Input your dietary preferences and goals to tailor your meal plans.
            </p>
          </div>

          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="bg-emerald-500 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2 text-gray-900">Receive Your Meal Plan</h3> {/* Text negru */}
            <p className="text-center text-gray-600">
              Get your customized meal plan delivered weekly to your account.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}