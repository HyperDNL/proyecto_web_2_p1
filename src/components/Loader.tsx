import React from "react";
import { BallTriangle } from "react-loader-spinner";

export const Loader = () => {
  return (
    <BallTriangle
      height={100}
      width={100}
      radius={5}
      color="white"
      ariaLabel="ball-triangle-loading"
      visible={true}
    />
  );
};
