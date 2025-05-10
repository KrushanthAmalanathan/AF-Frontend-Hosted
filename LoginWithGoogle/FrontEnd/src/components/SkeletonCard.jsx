import React from "react";

const SkeletonCard = () => {
  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -468px 0;
            }
            100% {
              background-position: 468px 0;
            }
          }
          .shimmer {
            background: linear-gradient(to right, #f3f4f6 8%, #e5e7eb 18%, #f3f4f6 33%);
            background-size: 800px 104px;
            animation: shimmer 1.5s infinite linear;
            border-radius: 6px;
          }
        `}
      </style>
      <article
        className="bg-white rounded-md p-3 sm:p-4"
        role="article"
        aria-hidden="true"
      >
        {/* Placeholder for flag image */}
        <div className="w-full h-36 shimmer rounded-md mb-3"></div>
        {/* Placeholder for country name */}
        <div className="h-6 shimmer rounded w-3/4 mb-1.5"></div>
        {/* Placeholder for details (capital, region, population, languages) */}
        <div className="space-y-1.5">
          <div className="flex flex-col">
            <div className="h-3 shimmer rounded w-16 mb-1"></div>{" "}
            {/* Capital label */}
            <div className="h-3 shimmer rounded w-24"></div>{" "}
            {/* Capital value */}
          </div>
          <div className="flex flex-col">
            <div className="h-3 shimmer rounded w-16 mb-1"></div>{" "}
            {/* Region label */}
            <div className="h-3 shimmer rounded w-20"></div>{" "}
            {/* Region value */}
          </div>
          <div className="flex flex-col">
            <div className="h-3 shimmer rounded w-20 mb-1"></div>{" "}
            {/* Population label */}
            <div className="h-3 shimmer rounded w-28"></div>{" "}
            {/* Population value */}
          </div>
          <div className="flex flex-col">
            <div className="h-3 shimmer rounded w-24 mb-1"></div>{" "}
            {/* Languages label */}
            <div className="h-3 shimmer rounded w-32"></div>{" "}
            {/* Languages value */}
          </div>
        </div>
        {/* Placeholder for favorite button */}
        <div className="mt-3 w-full h-10 shimmer rounded-md"></div>
      </article>
    </>
  );
};

export default SkeletonCard;
