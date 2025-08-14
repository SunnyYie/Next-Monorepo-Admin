import { SidebarProvider } from '@/components/ui/sidebar';
import { Container } from './container';
import { Header } from './header';
import { AppSidebar } from './sidebar';
import { TopNav } from './components/header/top-nav';
import { Search } from '@/components/common/search';
import { ThemeSwitch } from '@/components/common/theme-switch';
import { ProfileDropdown } from '@/components/common/profile-dropdown';
import { SearchProvider } from '@/context/search-context';

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard',
    disabled: false,
  },
  {
    title: 'UserEvent',
    href: 'dashboard/userEvent',
    disabled: false,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    disabled: true,
  },
];

export default function Layout() {
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full flex-col sm:flex-row">
          <AppSidebar />
          <div className="flex-1 overflow-hidden">
            <Header>
              <TopNav links={topNav} />
              <div className="ml-auto flex items-center space-x-4">
                <Search />
                <ThemeSwitch />
                <ProfileDropdown />
              </div>
            </Header>
            <Container />
          </div>
        </div>
      </SidebarProvider>
    </SearchProvider>
  );
}
