import { signInWithPopup } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../firebase";
import { LogIn } from "lucide-react";

const Login = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      navigate("/");
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <div>
          <div className="mx-auto h-12 w-12 text-blue-600">
            <LogIn className="h-full w-full" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="flex justify-center items-center mt-14">
          <button
            className="py-4 px-6 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={loginWithGoogle}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
