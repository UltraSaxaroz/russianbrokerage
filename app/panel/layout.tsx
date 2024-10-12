import React, {ReactNode} from 'react';
import AsidePanel from "@/components/aside";

const Layout = ({children}: { children: ReactNode }) => {
    return (
        <div className="flex">
            <AsidePanel/>
            <div className="flex justify-center items-center w-full">
                {children}
            </div>
        </div>
    );
};

export default Layout;