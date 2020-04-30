import { h } from 'preact';

const Logo = ({ size }) => {
  const height = size === 'small' ? 42 * 0.75 : 42;

  return (
    <div class="logo">
      <svg
        width="336"
        height={height}
        viewBox={`0 0 336 42`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 11.4329H11.645V41.0912H25.0414V11.4329H36.6864V0.908936H0V11.4329Z"
          fill="white"
        />
        <path
          d="M122.746 2.77443C120 1.5307 116.828 0.956665 113.136 0.956665H94.0118V41.1389H107.408V31.2369H113.136C116.828 31.2369 120 30.615 122.746 29.4191C125.491 28.1753 127.574 26.4533 129.041 24.1571C130.509 21.861 131.266 19.1822 131.266 16.1207C131.266 13.0592 130.509 10.3804 129.041 8.08423C127.574 5.7881 125.491 3.97033 122.746 2.77443ZM116.402 19.5649C115.503 20.3781 114.13 20.8086 112.331 20.8086H107.456V11.3849H112.331C114.13 11.3849 115.503 11.8154 116.402 12.6286C117.302 13.4419 117.775 14.5899 117.775 16.1207C117.775 17.6514 117.302 18.7038 116.402 19.5649Z"
          fill="white"
        />
        <path
          d="M159.527 41.0912H172.923V28.2233H189.491V18.0342H172.923V11.1458H191.811V0.908936H159.527V41.0912Z"
          fill="white"
        />
        <path
          d="M275.456 22.6265C275.456 25.5923 274.935 27.6971 273.893 29.0365C272.852 30.3759 271.337 31.0456 269.396 31.0456C267.456 31.0456 265.941 30.3759 264.899 29.0365C263.858 27.6971 263.337 25.5445 263.337 22.6265V0.908936H249.941V23.0092C249.941 29.0365 251.645 33.6766 255.053 37.0251C258.462 40.3736 263.195 42.0001 269.302 42.0001C275.408 42.0001 280.142 40.3258 283.55 37.0251C286.959 33.6766 288.663 29.0365 288.663 23.0092V0.908936H275.503V22.6265H275.456Z"
          fill="white"
        />
        <path
          d="M327.669 28.7015C330.083 27.4578 331.929 25.7357 333.254 23.5831C334.533 21.4305 335.195 18.943 335.195 16.0728C335.195 13.0113 334.438 10.3325 332.97 8.03639C331.503 5.74026 329.373 3.97033 326.627 2.77443C323.882 1.5307 320.71 0.956665 317.018 0.956665H297.893V41.1389H311.29V30.9977H314.935L321.704 41.0911H336L327.669 28.7015ZM320.284 19.5649C319.385 20.3781 318.012 20.8086 316.213 20.8086H311.337V11.3849H316.213C318.012 11.3849 319.385 11.8154 320.284 12.6286C321.183 13.4419 321.657 14.5899 321.657 16.1207C321.657 17.6514 321.183 18.7038 320.284 19.5649Z"
          fill="white"
        />
        <path
          d="M75.0769 2.67882C71.6686 0.908884 67.8343 0 63.574 0C59.3136 0 55.4319 0.908884 52.0237 2.67882C48.6154 4.49658 45.9645 6.98406 44.0237 10.1891C42.0828 13.3941 41.1361 16.9818 41.1361 21C41.1361 25.0182 42.0828 28.6059 44.0237 31.8109C45.9645 35.0159 48.6154 37.5034 52.0237 39.3212C55.4319 41.139 59.2663 42 63.574 42C67.8816 42 71.716 41.0911 75.1242 39.3212C78.5325 37.5034 81.1834 35.0159 83.1242 31.8109C85.0651 28.6059 86.0118 25.0182 86.0118 21C86.0118 16.9818 85.0651 13.3941 83.1242 10.1891C81.1834 6.98406 78.4852 4.49658 75.0769 2.67882ZM59.2663 31.7153L59.1716 31.6196L55.9526 28.3667L49.9408 22.2916L53.2071 18.9909L59.2189 25.0661L74.2722 9.85421L77.5384 13.1549L59.2663 31.7153Z"
          fill="white"
        />
        <path
          d="M231.29 2.67882C227.882 0.908884 224.047 0 219.787 0C215.527 0 211.645 0.908884 208.237 2.67882C204.828 4.49658 202.178 6.98406 200.237 10.1891C198.296 13.3941 197.349 16.9818 197.349 21C197.349 25.0182 198.296 28.6059 200.237 31.8109C202.178 35.0159 204.828 37.5034 208.237 39.3212C211.645 41.139 215.479 42 219.787 42C224.095 42 227.929 41.0911 231.337 39.3212C234.746 37.5034 237.396 35.0159 239.337 31.8109C241.278 28.6059 242.225 25.0182 242.225 21C242.225 16.9818 241.278 13.3941 239.337 10.1891C237.396 6.98406 234.698 4.49658 231.29 2.67882ZM230.58 28.3667L227.314 31.6674L219.787 24.0615L212.26 31.6674L208.994 28.3667L216.521 20.7608L208.994 13.1549L212.26 9.85421L219.787 17.4601L227.314 9.85421L230.58 13.1549L223.053 20.7608L230.58 28.3667Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default Logo;
