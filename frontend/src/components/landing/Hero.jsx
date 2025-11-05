import React from "react";
import { ArrowRight, Sparkles, BookOpen, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import HERO_IMG from "../../assets/hero.png";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-violet-50">
      {/* Decorative purple shadow objects */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-linear-to-br from-violet-400 to-purple-500 opacity-20 rounded-full filter blur-3xl transform rotate-12 pointer-events-none" />
      <div className="absolute -bottom-28 -left-24 w-96 h-96 bg-linear-to-br from-violet-300 to-purple-400 opacity-15 rounded-full filter blur-2xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-8 lg:px-10 pt-6 lg:pt-8 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-600 px-3 py-1 rounded-full text-sm font-medium w-max mb-4">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered eBooks</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Create Stunning
              <span className="block bg-clip-text text-transparent bg-linear-to-br from-violet-400 to-purple-500 sm:inline sm:ml-2">
                Ebooks in Minutes
              </span>
            </h1>

            <p className="mt-4 text-gray-600 max-w-xl">
              From idea to published ebook, our AI-powered platform helps you
              write, design, and export professional-quality books effortlessly.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex items-center justify-center px-5 py-3 bg-linear-to-br from-violet-400 to-purple-500 text-white rounded-lg shadow hover:opacity-95 transition"
              >
                <span>Start Creating for Free</span>
                <ArrowRight className="w-4 h-4 ml-3" />
              </Link>

              {/* <a
                href="#demo"
                className="inline-flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                <span>Watch Demo</span>
              </a> */}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg">
                <div className="p-2 bg-white rounded-md shadow">
                  <Zap className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    AI Generation
                  </div>
                  <div className="text-xs text-gray-500">
                    Quickly produce chapters &amp; content
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg">
                <div className="p-2 bg-white rounded-md shadow">
                  <BookOpen className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Export Ready
                  </div>
                  <div className="text-xs text-gray-500">PDF and Docx</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Image preview */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={HERO_IMG}
                alt="AI Ebook Creator Dashboard"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="absolute -bottom-6 left-6 bg-white rounded-xl shadow-lg p-3 w-64">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-linear-to-br from-violet-400 to-purple-500 rounded-md flex items-center justify-center text-white font-semibold">
                  AI
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    Processing
                  </div>
                  <div className="text-xs text-gray-500">AI Generation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
