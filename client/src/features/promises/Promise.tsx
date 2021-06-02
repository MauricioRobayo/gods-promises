import React from "react";

type PromiseProps = {
  promise: {
    content: string;
    reference: string;
  };
};

const Promise = ({ promise }: PromiseProps) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: promise.content }} />
    </div>
  );
};

export default Promise;
