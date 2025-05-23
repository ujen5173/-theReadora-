import { env } from "~/env";

const TailwindIndicator = () => {
  if (env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-1 left-1 z-50 flex size-7 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
      <div className="block xxs:hidden">xxs</div>
      <div className="hidden xxs:block xs:hidden">xs</div>
      <div className="hidden xs:block sm:hidden">sm</div>
      <div className="hidden sm:block md:hidden">md</div>
      <div className="hidden md:block lg:hidden">lg</div>
      <div className="hidden lg:block xl:hidden">xl</div>
      <div className="hidden xl:block 2xl:hidden">2xl</div>
      <div className="hidden 2xl:block">3xl</div>
    </div>
  );
};

export default TailwindIndicator;
