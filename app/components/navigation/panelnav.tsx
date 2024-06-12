'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PanelProps {
    options: string[];
    path : 'hostboard' | 'dashboard';
}

export function PanelNav({ options, path }: PanelProps) {
    const pathname = usePathname().split("/").at(2);
    return (
        <div className="panel-div">
            <ul className="panel-list">
                <Link key={path} href={`/${path}`}>
                    <li key="board" className={`panel-option ${!pathname? 'bg-purple-500' : ''}`} >{path.toUpperCase()}</li>
                </Link>
            {options.map((option, index) => (
                <Link key={index} href={`/${path}/${option.toLowerCase()}`}>
                <li key={index} className={`panel-option ${pathname === option.toLowerCase() ? 'bg-purple-500' : ''}`}>
                    {option}
                </li>
                </Link>
                
            ))}
            </ul>
        </div>
    );
}
