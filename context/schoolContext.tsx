'use client'
import { SchoolSettingsSchemaT, UserSchemaT } from '@/lib/schemas';
import { BaseRequestHeaders } from '@/lib/utils';
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useAuthContext } from './authContext';

export interface SchoolContextProps {
    schoolSettings: SchoolSettingsSchemaT
}

export const SchoolContext = createContext<SchoolContextProps | null>(null)

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const userData = useAuthContext()
    const [schoolSettings, setSchoolSettings] = useState<SchoolSettingsSchemaT>({
        name: "",
        currentTerm: "",
        termStarts: new Date(),
        termEnds: new Date(),
        nextReopeningDate: new Date()
    })

    useEffect(() => {
        if (!userData || !userData.userInfo.id) return
        const fetchSchoolSettings = async () => {
            try {
                const response = await fetch(`/api/stats?query=main&admin_id=${userData?.userInfo.id}`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                console.log("results", result.data)
                if (!response.ok) {
                    return null
                } else {
                    setSchoolSettings(result.data)
                }
            } catch (err: any) {
            }
        }
        fetchSchoolSettings()
    }, [userData?.userInfo.id])

    if (!userData) return null

    const value: SchoolContextProps = {
        schoolSettings: schoolSettings
    };

    return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
};

export const useSchoolContext = () => {
    const context = useContext(SchoolContext);
    if (context === undefined) {
        throw new Error("useSchoolContext must be used within a SchoolProvider");
    }
    return context;
};
