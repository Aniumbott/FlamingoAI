import React from "react";

function Footer() {
  return (
    <>
      <footer className="border-t mt-10">
        <div className="mx-auto w-full max-w-screen-xl px-4">
          <div className="gap-4 p-4 py-16 sm:pb-24 md:flex md:justify-between">
            <div className="mb-12 flex flex-col gap-4">
              <a className="flex items-center gap-2" href="/">
                <img
                  src="logo.png"
                  alt="Flamingo.ai Logo"
                  className="h-8 w-8"
                />
                <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                  Flamingo.ai
                </span>
              </a>
              <p className="max-w-xs text-lg">
                All-in-one AI workspace for teams
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-4 sm:gap-6">
              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                  Features
                </h2>
                <ul className="grid gap-2">
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      ChatGPT for Teams
                    </a>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      Claude for Teams
                    </a>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      Gemini for Teams
                    </a>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      Llama for Teams
                    </a>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      Mistral for Teams
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                  Resources
                </h2>
                <ul className="grid gap-2">
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      Free Tools
                    </a>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      Watch a Demo
                    </a>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      Book a Call
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                  Company
                </h2>
                <ul className="grid gap-2">
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      Affiliate Program
                    </a>
                  </li>

                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="#"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                  Legal
                </h2>
                <ul className="grid gap-2">
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="/terms"
                    >
                      Terms
                    </a>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="/privacy"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer text-gray-400 duration-200 hover:text-gray-600 hover:opacity-90"
                      href="/refund-policy"
                    >
                      Refund Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t py-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
            <div className="flex space-x-5 sm:mt-0 sm:justify-center">
              {/* <a
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-600"
                href="https://discord.gg/eVtDPmRWXm"
              >
                <svg
                  width={15}
                  height={15}
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.07451 1.82584C5.03267 1.81926 4.99014 1.81825 4.94803 1.82284C4.10683 1.91446 2.82673 2.36828 2.07115 2.77808C2.02106 2.80525 1.97621 2.84112 1.93869 2.88402C1.62502 3.24266 1.34046 3.82836 1.11706 4.38186C0.887447 4.95076 0.697293 5.55032 0.588937 5.98354C0.236232 7.39369 0.042502 9.08728 0.0174948 10.6925C0.0162429 10.7729 0.0351883 10.8523 0.0725931 10.9234C0.373679 11.496 1.02015 12.027 1.66809 12.4152C2.32332 12.8078 3.08732 13.1182 3.70385 13.1778C3.85335 13.1922 4.00098 13.1358 4.10282 13.0255C4.2572 12.8581 4.5193 12.4676 4.71745 12.1643C4.80739 12.0267 4.89157 11.8953 4.95845 11.7901C5.62023 11.9106 6.45043 11.9801 7.50002 11.9801C8.54844 11.9801 9.37796 11.9107 10.0394 11.7905C10.1062 11.8957 10.1903 12.0269 10.2801 12.1643C10.4783 12.4676 10.7404 12.8581 10.8947 13.0255C10.9966 13.1358 11.1442 13.1922 11.2937 13.1778C11.9102 13.1182 12.6742 12.8078 13.3295 12.4152C13.9774 12.027 14.6239 11.496 14.925 10.9234C14.9624 10.8523 14.9813 10.7729 14.9801 10.6925C14.9551 9.08728 14.7613 7.39369 14.4086 5.98354C14.3003 5.55032 14.1101 4.95076 13.8805 4.38186C13.6571 3.82836 13.3725 3.24266 13.0589 2.88402C13.0214 2.84112 12.9765 2.80525 12.9264 2.77808C12.1708 2.36828 10.8907 1.91446 10.0495 1.82284C10.0074 1.81825 9.96489 1.81926 9.92305 1.82584C9.71676 1.85825 9.5391 1.96458 9.40809 2.06355C9.26977 2.16804 9.1413 2.29668 9.0304 2.42682C8.86968 2.61544 8.71437 2.84488 8.61428 3.06225C8.27237 3.03501 7.90138 3.02 7.5 3.02C7.0977 3.02 6.72593 3.03508 6.38337 3.06244C6.28328 2.84501 6.12792 2.61549 5.96716 2.42682C5.85626 2.29668 5.72778 2.16804 5.58947 2.06355C5.45846 1.96458 5.2808 1.85825 5.07451 1.82584ZM11.0181 11.5382C11.0395 11.5713 11.0615 11.6051 11.0838 11.6392C11.2169 11.843 11.3487 12.0385 11.4508 12.1809C11.8475 12.0916 12.352 11.8818 12.8361 11.5917C13.3795 11.2661 13.8098 10.8918 14.0177 10.5739C13.9852 9.06758 13.7993 7.50369 13.4773 6.21648C13.38 5.82759 13.2038 5.27021 12.9903 4.74117C12.7893 4.24326 12.5753 3.82162 12.388 3.5792C11.7376 3.24219 10.7129 2.88582 10.0454 2.78987C10.0308 2.79839 10.0113 2.81102 9.98675 2.82955C9.91863 2.881 9.84018 2.95666 9.76111 3.04945C9.71959 3.09817 9.68166 3.1471 9.64768 3.19449C9.953 3.25031 10.2253 3.3171 10.4662 3.39123C11.1499 3.6016 11.6428 3.89039 11.884 4.212C12.0431 4.42408 12.0001 4.72494 11.788 4.884C11.5759 5.04306 11.2751 5.00008 11.116 4.788C11.0572 4.70961 10.8001 4.4984 10.1838 4.30877C9.58933 4.12585 8.71356 3.98 7.5 3.98C6.28644 3.98 5.41067 4.12585 4.81616 4.30877C4.19988 4.4984 3.94279 4.70961 3.884 4.788C3.72494 5.00008 3.42408 5.04306 3.212 4.884C2.99992 4.72494 2.95694 4.42408 3.116 4.212C3.35721 3.89039 3.85011 3.6016 4.53383 3.39123C4.77418 3.31727 5.04571 3.25062 5.35016 3.19488C5.31611 3.14738 5.27808 3.09831 5.23645 3.04945C5.15738 2.95666 5.07893 2.881 5.01081 2.82955C4.98628 2.81102 4.96674 2.79839 4.95217 2.78987C4.28464 2.88582 3.25999 3.24219 2.60954 3.5792C2.42226 3.82162 2.20825 4.24326 2.00729 4.74117C1.79376 5.27021 1.61752 5.82759 1.52025 6.21648C1.19829 7.50369 1.01236 9.06758 0.97986 10.5739C1.18772 10.8918 1.61807 11.2661 2.16148 11.5917C2.64557 11.8818 3.15003 12.0916 3.5468 12.1809C3.64885 12.0385 3.78065 11.843 3.9138 11.6392C3.93626 11.6048 3.95838 11.5708 3.97996 11.5375C3.19521 11.2591 2.77361 10.8758 2.50064 10.4664C2.35359 10.2458 2.4132 9.94778 2.63377 9.80074C2.85435 9.65369 3.15236 9.71329 3.29941 9.93387C3.56077 10.3259 4.24355 11.0201 7.50002 11.0201C10.7565 11.0201 11.4392 10.326 11.7006 9.93386C11.8477 9.71329 12.1457 9.65369 12.3663 9.80074C12.5869 9.94779 12.6465 10.2458 12.4994 10.4664C12.2262 10.8762 11.8041 11.2598 11.0181 11.5382ZM4.08049 7.01221C4.32412 6.74984 4.65476 6.60162 5.00007 6.59998C5.34538 6.60162 5.67603 6.74984 5.91966 7.01221C6.16329 7.27459 6.30007 7.62974 6.30007 7.99998C6.30007 8.37021 6.16329 8.72536 5.91966 8.98774C5.67603 9.25011 5.34538 9.39833 5.00007 9.39998C4.65476 9.39833 4.32412 9.25011 4.08049 8.98774C3.83685 8.72536 3.70007 8.37021 3.70007 7.99998C3.70007 7.62974 3.83685 7.27459 4.08049 7.01221ZM9.99885 6.59998C9.65354 6.60162 9.3229 6.74984 9.07926 7.01221C8.83563 7.27459 8.69885 7.62974 8.69885 7.99998C8.69885 8.37021 8.83563 8.72536 9.07926 8.98774C9.3229 9.25011 9.65354 9.39833 9.99885 9.39998C10.3442 9.39833 10.6748 9.25011 10.9184 8.98774C11.1621 8.72536 11.2989 8.37021 11.2989 7.99998C11.2989 7.62974 11.1621 7.27459 10.9184 7.01221C10.6748 6.74984 10.3442 6.60162 9.99885 6.59998Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="sr-only">Discord</span>
              </a> */}
              <a
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-600"
                href="#"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Contact</span>
              </a>
              {/* <a
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-600"
                href="https://github.com/dillionverma"
              >
                <svg
                  viewBox="0 0 438.549 438.549"
                  width={120}
                  height={60}
                  className="h-4 w-4"
                >
                  <path
                    fill="currentColor"
                    d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
                  />
                </svg>
                <span className="sr-only">GitHub</span>
              </a> */}
            </div>
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © {new Date().getFullYear()}{" "}
              <a className="cursor-pointer" href="/">
                Flamingo.ai™
              </a>{" "}
              All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full fill-gray-400/30 stroke-gray-300/30 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
      >
        <defs>
          <pattern
            id=":S1:"
            width={40}
            height={40}
            patternUnits="userSpaceOnUse"
            x={-1}
            y={-1}
          >
            <path d="M.5 40V.5H40" fill="none" strokeDasharray={0} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#:S1:)" />
      </svg>
      <div
        role="region"
        aria-label="Notifications (F8)"
        tabIndex={-1}
        style={{ pointerEvents: "none" }}
      >
        <ol
          tabIndex={-1}
          className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
        />
      </div>
      <div
        style={{
          position: "fixed",
          zIndex: 9999,
          top: 16,
          left: 16,
          right: 16,
          bottom: 16,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

export default Footer;
