import React, {ReactNode} from 'react';
import AsidePanel from "@/components/aside";
import ResponsiveAside from "@/components/responsive_aside";

const Layout = ({children}: { children: ReactNode }) => {
    return (
        <div className="flex w-full">
            {/*<AsidePanel/>*/}
            <ResponsiveAside />

            <div className="flex justify-center items-center w-full overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default Layout;