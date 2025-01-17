import PompeiiMap from "@/components/ui/pompeii-map";

const Page = async () => {
  return (
    <PompeiiMap
      center={{ lat: 40.75103, lng: 14.4884 }}
      zoom={16}
      width={"100%"}
      height={"100vh"}
    />
  );
};

export default Page;
