import Link from "next/link";
import Image from "next/image";

const BackedBy = () => (
  <div className="mt-12 flex flex-col gap-4 justify-center items-center">
    <div>
      <h3 className="font-semibold text-sm text-gray-600 text-center">
        BACKED BY THE BEST IN THE INDUSTRY
      </h3>
    </div>

    <div className="flex flex-row gap-4">
      <Link
        href="https://www.microsoft.com/en-us/startups"
        target="_blank"
        className="group relative justify-center gap-2 w-full transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 rounded-md"
      >
        <Image
          src="/microsoft.png"
          alt="Backed by Microsoft for Startups"
          className="w-36"
          width={144}
          height={48}
        />
        <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
      </Link>
    </div>
  </div>
);

export default BackedBy;
