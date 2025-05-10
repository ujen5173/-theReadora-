import type { HugeiconsProps } from "hugeicons-react";

const CrownMinus = ({
  className,
  props,
}: {
  className?: string;
  props?: HugeiconsProps;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      data-src="https://cdn.hugeicons.com/icons/crown-minus-stroke-standard.svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      role="img"
      className={className}
      {...props}
    >
      <path
        d="M21.5 3L16.5 3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M5 21H19"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M19 18H5L2.05123 9.57668C1.93172 9.22325 2.02503 8.8336 2.29225 8.57016C2.62854 8.23864 3.15545 8.1872 3.55117 8.44727L7.5 11L11.2412 4.43412C11.3968 4.16567 11.6864 4 12 4C12.3136 4 12.6032 4.16567 12.7588 4.43412L16.5 11L20.4488 8.44727C20.8445 8.1872 21.3715 8.23864 21.7078 8.57016C21.975 8.8336 22.0683 9.22325 21.9488 9.57668L19 18Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export default CrownMinus;
