export function Folder({ name }: { name: string }) {
    return (
        <>
            <button className="p-1 truncate flex">
                <svg viewBox="0 0 16 16" className="h-5 w-5 text-blue-400" fill="currentColor">
                    <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z"></path>
                </svg>
                <span className="ml-2">{name}</span>
            </button>
        </>
    );
}

export function File({ name }: { name: string }) {
    return (
        <>
            <button className="p-1 truncate flex">
                <svg viewBox="0 0 16 16" className="h-5 w-5 text-white" fill="currentColor">
                    <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
                </svg>
                <span className="ml-2">{name}</span>
            </button>
        </>
    );
}

export default function FileSystemView({ data }: { data: string[] }) {
    return (
        <div className="container w-1/2 mx-auto m-4 flex flex-col">
            <table className="border-collapse border border-slate-500">
                <thead className="bg-gray-600">
                    <tr>
                        <th className="border border-slate-600">
                            
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((d: string, i: number) => {
                            if (d.includes('.')) {
                                return (
                                    <tr>
                                        <td className="border border-slate-700">
                                            <File name={d} />
                                        </td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr>
                                        <td className="border border-slate-700">
                                            <Folder name={d} />
                                        </td>
                                    </tr>
                                );
                            }
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}
