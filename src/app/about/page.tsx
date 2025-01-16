import Image from "next/image";

const Page = async () => {
  return (
    <div>
      <Image src="/logo.png" alt="PPMExplorer Logo" width={100} height={100} />
      <p>
        Welcome to PPMExplorer, a new way to explore the artwork of ancient
        Pompeii.
      </p>
    </div>
  );
};

export default Page;
