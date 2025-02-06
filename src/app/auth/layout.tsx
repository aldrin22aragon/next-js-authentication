
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <div className="h-dvh flex justify-center items-center">
        <div className="border rounded-sm shadow-lg p-4">
            {children}
        </div>
    </div>
}