import { SidebarProvider } from '@/components/ui/sidebar';
import { Container } from './container';
import { Header } from './header';
import { AppSidebar } from './sidebar';
import { TopNav } from './components/header/top-nav';
import { Search } from '@/components/common/search';
import { ThemeSwitch } from '@/components/common/theme-switch';
import { ProfileDropdown } from '@/components/common/profile-dropdown';
import { SearchProvider } from '@/context/search-context';
import { useLocation } from 'react-router';
import { DashBoardNav } from '../dashboard';
import { ListNav } from '../message-list';

export default function Layout() {
  const location = useLocation();
  const curNav =
    location.pathname.split('/')[2] === 'dashboard' ? DashBoardNav : ListNav;

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full flex-col sm:flex-row">
          <AppSidebar />
          <div className="flex-1 overflow-hidden">
            <Header>
              <TopNav links={curNav} />
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
