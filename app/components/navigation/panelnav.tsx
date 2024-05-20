'use client';
import { useState } from "react";
import Link from "next/link";

interface PanelProps {
    options: string[];
    path : 'hostboard' | 'dashboard';
}

export function PanelNav({ options, path }: PanelProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    return (
        <div className="panel-div">
            <ul className="panel-list">
            {options.map((option) => (
                <Link href={`/${path}/${option.toLowerCase()}`} >
                <li key={option}  className={`panel-option ${selectedOption === option ? 'bg-purple-500' : ''}`} onClick={()=>setSelectedOption(option)}>
                    {option}
                </li>
                </Link>
            ))}
            </ul>
        </div>
    );
}
