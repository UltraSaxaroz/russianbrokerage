import React, {ReactNode} from 'react';
import AsidePanel from "@/components/aside";
import ResponsiveAside from "@/components/responsive_aside";

const Layout = ({children}: { children: ReactNode }) => {
    return (
        <div className="flex bg-gradient-to-br w-full from-gray-100 to-neutral-200">
            {/*<AsidePanel/>*/}
            <ResponsiveAside />
            <div className="flex justify-center items-center w-full">
                {children}
            </div>
        </div>
    );
};

export default Layout;