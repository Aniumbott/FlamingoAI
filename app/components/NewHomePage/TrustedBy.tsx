import { Icons } from "../icons";
import { Star } from "lucide-react";
import Image from "next/image";
const icons = [
  Icons.ycombinator,
  Icons.openaiLogo,
  Icons.googleLogo,
  Icons.lyft,
  Icons.microsoft,
];

export const TrustedBy = () => {
  return (
    <section id="trusted">
      <div className="py-14 bg-white">
        <div className="max-w-5xl px-4 mx-auto mt-20">
          <div className="flex flex-col items-center gap-8 p-8 transition-all duration-300 bg-white shadow-lg md:flex-row rounded-3xl hover:shadow-xl">
            <div className="flex items-center space-x-6 md:w-3/5">
              <div className="flex-shrink-0">
                <Image
                  src="/Testimonial 1.png"
                  alt="Laura"
                  width={90}
                  height={90}
                  className="rounded-full shadow-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold leading-tight text-gray-800 break-words">
                  &quot; Flamingo.ai is a lifesaver! Having all different LLMs
                  together in one single place saves a lot of time and
                  money.&quot;
                </p>
                <p className="mt-4 text-lg font-medium text-gray-600">
                  Emily - VP of Sales
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center md:w-2/5 md:items-end">
              <div className="flex items-center justify-center md:justify-end">
                <span className="mr-4 text-5xl font-bold text-gray-800">
                  4.95
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-8 h-8 text-yellow-400 drop-shadow"
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-lg text-center text-gray-600 md:text-right">
                Average rating from <span className="font-semibold">31k+</span>{" "}
                customers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
