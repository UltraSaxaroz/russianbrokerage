import React, {FC, ReactNode} from 'react';
import {golos} from "@/app/fonts/fonts";

interface Props {
    children: ReactNode;
}

const Layout: FC<Props> = ({children}) => {
    return (
        <div className={`container mx-auto p-4 overflow-auto ${golos.className}`}>
            {children}
        </div>
    );
};

export default Layout;