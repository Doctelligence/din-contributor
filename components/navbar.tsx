import { Input } from "@nextui-org/input";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import NextLink from "next/link";

import {
  DiscordIcon,
  GithubIcon,
  SearchIcon,
  TwitterIcon
} from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProjectCount } from "@/components/project-counter";
import { siteConfig } from "@/config/site";

export const DINLogo = () => {
  return <svg width="122px" height="32px" viewBox="0 0 121 32" version="1.1">
  <g id="surface1">
  <path fill="currentColor" fillRule="evenodd" d="M 87.765625 31.777344 C 80.566406 32.195312 76.238281 25.929688 75.699219 19.964844 C 75.375 16.375 75.78125 12.863281 77.574219 9.59375 C 81.128906 3.109375 88.34375 2.035156 93.59375 7.246094 C 95.222656 8.863281 96.375 10.84375 97.816406 12.875 C 98.570312 11.660156 99.167969 10.625 99.839844 9.636719 C 102.070312 6.339844 104.714844 3.574219 109.105469 3.847656 C 114.667969 4.195312 118.066406 7.457031 119.886719 12.496094 C 121.738281 17.617188 121.320312 22.59375 118.285156 27.164062 C 114.386719 33.042969 106.859375 33.410156 102.316406 28.003906 C 101.113281 26.570312 100.058594 25.007812 98.679688 23.164062 C 96.15625 27.5 93.238281 31.214844 87.765625 31.777344 M 81.625 25.261719 C 85.523438 27.875 88.203125 27.542969 91.335938 24.066406 C 92.515625 22.757812 93.457031 21.289062 94.289062 19.746094 C 96.445312 15.761719 96.351562 15.203125 93.03125 12.007812 C 89.035156 8.164062 82.707031 8.714844 79.894531 13.183594 C 77.601562 16.832031 78.40625 22.71875 81.625 25.261719 M 113.566406 25.367188 C 118.929688 21.921875 119.597656 15.773438 115.109375 11.125 C 112.476562 8.394531 108.980469 8.257812 106.140625 10.792969 C 103.621094 13.042969 102.15625 15.980469 100.84375 19.019531 C 100.597656 19.59375 100.75 20.039062 101.050781 20.523438 C 103.988281 25.261719 107.398438 27.152344 113.566406 25.367188 Z M 113.566406 25.367188 "/>
  <path fill="currentColor" fillRule="evenodd" d="M 0.429688 12.257812 C 2.523438 5.417969 6.949219 1.402344 13.851562 0.234375 C 22.390625 -1.214844 31.238281 6.351562 31.480469 15.015625 C 31.675781 22.070312 29 27.472656 22.597656 30.40625 C 12.832031 34.878906 1.671875 29.273438 0.128906 18.214844 C -0.144531 16.246094 0.0390625 14.335938 0.429688 12.257812 M 8.777344 5.3125 C 4.53125 10.359375 5.5 21.5625 10.394531 26.667969 C 14.988281 31.457031 21.691406 30.242188 24.308594 24.171875 C 27.152344 17.566406 24.558594 10.066406 20.523438 5.621094 C 17.351562 2.128906 12.289062 2.066406 8.777344 5.3125 Z M 8.777344 5.3125 "/>
  <path fill="currentColor" fillRule="evenodd" d="M 63.207031 15.179688 C 55.871094 15.175781 48.730469 15.117188 41.59375 15.199219 C 39.6875 15.222656 39.179688 14.515625 39.1875 12.710938 C 39.191406 10.925781 39.664062 10.175781 41.585938 10.195312 C 49.125 10.277344 56.667969 10.21875 64.210938 10.226562 C 66.796875 10.230469 67.023438 10.453125 67.03125 12.722656 C 67.035156 15 66.839844 15.171875 64.214844 15.183594 C 63.945312 15.1875 63.675781 15.183594 63.207031 15.179688 Z M 63.207031 15.179688 "/>
  <path fill="currentColor" fillRule="evenodd" d="M 39.257812 22.484375 C 39.382812 21.15625 40.242188 21.160156 41.058594 21.160156 C 49.128906 21.152344 57.195312 21.179688 65.261719 21.140625 C 67.332031 21.128906 66.933594 22.566406 67.050781 23.792969 C 67.175781 25.109375 66.800781 25.796875 65.308594 25.789062 C 57.242188 25.75 49.175781 25.734375 41.109375 25.789062 C 38.53125 25.808594 39.410156 23.980469 39.257812 22.484375 Z M 39.257812 22.484375 "/>
  </g>
  </svg>
}

export const Navbar = () => {
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <DINLogo />
            {/* <p className="font-bold text-inherit"> | DIN</p> */}
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ProjectCount />
          <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Discord" href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
