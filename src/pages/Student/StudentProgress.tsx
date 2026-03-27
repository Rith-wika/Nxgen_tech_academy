import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentSidebarItems } from "./studentSidebarItems";
import axiosInstance from "@/api/axiosInstance";
import { Loader2 } from "lucide-react";

interface RecentProgress {
    id: number;
    course_title: string;
    lesson_title: string;
    completed_at: string;
}

const StudentProgress = () => {
    const [progressList, setProgressList] = useState<RecentProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await axiosInstance.get("/api/learning/progress/recent/");
                setProgressList(response.data);
            } catch (err) {
                console.error("Error fetching progress:", err);
                setError("Failed to load progress. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <DashboardLayout role="student" sidebarItems={studentSidebarItems} title="My Progress">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Learning Progress</h1>
            
            {loading ? (
                 <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!Array.isArray(progressList) || progressList.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No recent activity found.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {progressList.map((progress) => (
                                        <li key={progress.id} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                                            <div>
                                                <p className="font-semibold text-gray-800">Completed Lesson "{progress.lesson_title}"</p>
                                                <p className="text-sm text-gray-500">{progress.course_title}</p>
                                            </div>
                                            <span className="text-sm text-gray-400">{formatDate(progress.completed_at)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
};

export default StudentProgress;
