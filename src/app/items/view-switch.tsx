"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Table, Grid2x2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewSwitch = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentView = searchParams.get("view") || "table";

  const updateView = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs defaultValue={currentView}>
      <div className="max-w-[400px] mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="table" onClick={() => updateView("table")}>
            <Table className="h-4 w-4 mr-2" />
            Table
          </TabsTrigger>
          <TabsTrigger value="grid" onClick={() => updateView("grid")}>
            <Grid2x2 className="h-4 w-4 mr-2" />
            Grid
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};

export default ViewSwitch;
