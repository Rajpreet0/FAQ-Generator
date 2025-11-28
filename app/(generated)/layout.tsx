"use client"
import { MenuDock } from "@/components/ui/shadcn-io/menu-dock"
import { useAuthStore } from "@/store/auth-store";
import { Home, Settings, Save } from 'lucide-react';

/**
 * Generated Routes Layout Component
 *
 * Layout wrapper for protected application routes (/result, /saved, /settings).
 * Provides a responsive navigation dock for authenticated and public users.
 *
 * Features:
 * - Responsive menu dock (compact on mobile, default on desktop)
 * - Dynamic menu items based on authentication state
 * - Fixed bottom positioning for easy access
 * - Waits for auth hydration before rendering
 *
 * Menu Items:
 * - Authenticated Users: Home, Saved, Settings
 * - Public Users: Home only
 *
 * Responsive Behavior:
 * - Mobile (<lg): Compact variant menu
 * - Desktop (≥lg): Default variant menu
 *
 * Note: Returns null until auth state is hydrated to prevent flash of incorrect menu
 */
const Layout = ({children} : {children: React.ReactNode} ) => {

    const user = useAuthStore((s) => s.user);
    const authReady = useAuthStore((s) => s.authReady);

    const menuItems = user 
      ? [
        {label: "Home", icon:Home, href: "/result" },
        {label: "Saved", icon:Save, href:"/saved"},
        {label: "Settings", icon:Settings, href:"/settings"}
      ]
      : [
        {label: "Home", icon:Home, href: "/result" }
      ];
  
    if (!authReady) return null;

  return (
    <div className="w-full">
        {children}
        <div className="w-full flex items-center justify-center">
            <div className="fixed bottom-4 drop-shadow-2xl">  
                <MenuDock 
                  variant="compact" 
                  animated={false} 
                  showLabels={true} 
                  items={menuItems}
                  className="lg:hidden"/>
                <MenuDock 
                  variant="default" 
                  animated={false} 
                  showLabels={true} 
                  items={menuItems}
                  className="hidden lg:flex"/>
            </div>
        </div>
    </div>
  )
}

export default Layout
