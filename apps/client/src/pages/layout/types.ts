import { LinkProps } from "react-router";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Team {
  name: string;
  logo: React.ElementType;
  plan: string;
}

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  url?: LinkProps['to'];
  items?: BaseNavItem[];
}

interface NavGroup {
  title: string;
  items: BaseNavItem[];
}

interface SidebarData {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
}

export type { SidebarData, NavGroup, BaseNavItem };
