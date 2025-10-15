'use client'
import {Sidebar} from "@/components/blog/sidebar";
import {BlogLayout} from "@/components/layout/blog-layout";

interface LayoutProps {
    children: React.ReactNode;
}

export default function ContentLayout({ children }: LayoutProps) {
    return (
        <BlogLayout>
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
                <div className="lg:col-span-5 space-y-8">{children}</div>
                <div className="lg:col-span-2">
                    <Sidebar />
                </div>
            </div>
        </BlogLayout>
        );
}