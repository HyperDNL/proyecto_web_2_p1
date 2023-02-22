import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <>
      <div
        className="
    flex
    items-center
    justify-center
    w-screen
    h-screen
  "
      >
        <div className="px-40 py-20 bg-white rounded-md shadow-xl">
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-red-500 text-9xl">404</h1>

            <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
              <span className="text-red-500">Oops!</span> Página no encontrada
            </h6>

            <p className="mb-8 text-center text-gray-500 md:text-lg">
              La página que buscabas no existe.
            </p>

            <Link
              to={"/"}
              className="px-6 py-2 text-sm font-semibold text-red-500 bg-gray-200"
            >
              Ir a Inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
