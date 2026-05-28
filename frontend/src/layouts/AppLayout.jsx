import { Sidebar } from "../components/layout/Sidebar";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export function AppLayout({
    children,
    user,
    search,
    setSearch
}) {

    return (
        <div className="flex bg-gray-100 min-h-screen">

            {/* SIDEBAR */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* MAIN SECTION */}
            <div className="flex-1 flex flex-col min-w-0">


                <Navbar
                    user={user}
                    search={search}
                    setSearch={setSearch}
                />

                <main className="flex-1 p-4 sm:p-6">
                    {children}
                </main>


                <Footer />

            </div>

        </div>
    );
}