import React from "react";

type LayoutProps = {
  children?: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return <div>{children}</div>;
}

export default Layout;
