"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/items");
  }, [router]);

  return <main>Redirecting to /items...</main>;
};

export default Page;
