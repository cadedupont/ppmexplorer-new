'use client';

import Image from 'next/image';

const Page = () => {
  return (
    <div className="mb-8 mt-8 flex flex-col items-center justify-center">
      <Image src="/logo.png" alt="PPMExplorer Logo" width={200} height={200} className="mb-8" />
      Welcome to PPMExplorer, a new way to explore the artwork of ancient Pompeii!
    </div>
  );
};

export default Page;
