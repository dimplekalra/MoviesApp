import React, { Suspense } from "react";

import MainRouter from "../routes/MainRouter";

const loading = <div className="pt-3 text-center">Loading...</div>;

const Content: React.FC = (): React.ReactElement => {
  return (
    <main className="section">
      <Suspense fallback={loading}>
        <MainRouter />
      </Suspense>
    </main>
  );
};

export default Content;
