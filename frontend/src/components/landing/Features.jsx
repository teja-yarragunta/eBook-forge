import React from "react";
import { Link } from "react-router-dom";
import { FEATURES } from "../../utils/data";

const Features = () => {
  return (
    <section
      id="features"
      className="relative py-15 bg-linear-to-b from-white to-violet-50 overflow-hidden"
    >
      {/* Decorative purple shadow objects */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-linear-to-br from-violet-400 to-purple-500 opacity-20 rounded-full filter blur-3xl transform rotate-12 pointer-events-none" />
      <div className="absolute -bottom-28 -left-24 w-96 h-96 bg-linear-to-br from-violet-300 to-purple-400 opacity-15 rounded-full filter blur-2xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-8 lg:px-10">
        {/* Section header */}
        <div className="text-center mb-16">
          {/* Features capsule with green pulsing dot */}
          <div className="inline-flex items-center gap-3 bg-violet-50 text-violet-600 px-3 py-1 rounded-full text-sm font-medium w-max mx-auto mb-4">
            <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-md animate-pulse" />
            <span>Features</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Everything you need to create an
            <span className="bg-clip-text text-transparent bg-linear-to-br from-violet-400 to-purple-500 ml-2">
              amazing ebook
            </span>
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Powerful tools to help you write, design, and publish your ebook
            with ease.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="relative group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                />
                <div
                  className={`w-12 h-12 bg-linear-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg mb-5`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 bg-linear-to-br from-violet-400 to-purple-500 text-white rounded-lg shadow hover:opacity-95 transition"
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
