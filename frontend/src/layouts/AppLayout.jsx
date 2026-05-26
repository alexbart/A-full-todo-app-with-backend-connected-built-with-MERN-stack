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
            <Sidebar />

            {/* MAIN SECTION */}
            <div className="flex-1 flex flex-col">

                <Navbar
                    user={user}
                    search={search}
                    setSearch={setSearch}
                />

                <main className="flex-1 p-6">
                    {children}
                </main>

                <Footer />

            </div>

        </div>
    );
}