import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { studentSidebarItems } from "./studentSidebarItems";
import { Trophy } from "lucide-react";

const StudentCertificates = () => {
    return (
        <DashboardLayout role="student" sidebarItems={studentSidebarItems} title="My Certificates">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Earned Certificates</h1>
            
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100 mt-8">
                <Trophy className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-medium text-gray-800">Certificates Coming Soon</h2>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    The certification feature is currently under development. Soon you'll be able to earn and download certificates for completed courses!
                </p>
                <div className="mt-8">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        Work in Progress
                    </span>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentCertificates;
