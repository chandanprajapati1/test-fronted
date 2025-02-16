import type { ChildrenProps } from "@/types";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function MainLayout({ children }: ChildrenProps) {

    return (
        <div className="bg-brand1-10 flex flex-col items-center min-h-screen">
            {children}
            <ToastContainer autoClose={2000} theme="colored" />
        </div>
    );
}