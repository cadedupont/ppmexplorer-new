import Map from "@/components/ui/map";

const Page = async () => {
  return (
    <Map
      center={{ lat: 40.75103, lng: 14.4884 }}
      zoom={17}
      width={"100%"}
      height={"100vh"}
    />
  );
};

export default Page;
