import React from "react";

interface ImageProps {
  params: { id: string };
}

const Image = ({ params }: ImageProps) => {
  const { id } = params;

  return <div>Image ID: {id}</div>;
};

export default Image;
