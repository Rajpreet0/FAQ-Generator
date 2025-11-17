"use client"
import { MenuDock } from "@/components/ui/shadcn-io/menu-dock"
import { Home, Settings, Save } from 'lucide-react';

const Layout = ({children} : {children: React.ReactNode} ) => {
  return (
    <div className="w-full">
        {children}
        <div className="w-full flex items-center justify-center">
            <div className="fixed bottom-4 drop-shadow-2xl">  
                <MenuDock 
                  variant="compact" 
                  animated={false} 
                  showLabels={true} 
                  items={[
                    {label: "Home", icon:Home, href: "/result" },
                    {label: "Saved", icon:Save, href:"/saved"},
                    {label: "Settings", icon:Settings, href:"/settings"}
                  ]}
                  className="lg:hidden"/>
                <MenuDock 
                  variant="default" 
                  animated={false} 
                  showLabels={true} 
                  items={[
                    {label: "Home", icon:Home, href: "/result" },
                    {label: "Saved", icon:Save, href:"/saved"},
                    {label: "Settings", icon:Settings, href:"/settings"}
                  ]}
                  className="hidden lg:flex"/>
            </div>
        </div>
    </div>
  )
}

export default Layout
