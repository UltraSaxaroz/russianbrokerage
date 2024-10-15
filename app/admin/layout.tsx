import React, {ReactNode} from 'react';
import AdminSide from "@/components/admin_sidenav";

const Layout = ({children}: { children: ReactNode }) => {
    return (
        <div className="flex w-full">
            <div className="flex-shrink-0">
                <AdminSide/>
            </div>
            <div className="flex-grow flex items-center">
                {children}
            </div>
        </div>
    );
};

export default Layout;