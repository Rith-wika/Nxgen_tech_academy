import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { adminSidebarItems } from "@/pages/Admin/adminSidebarItems";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, DollarSign, Wallet, Percent, PieChart, RefreshCw, BarChart2 } from "lucide-react";
import { enrollmentService } from "@/services/enrollmentService";
import { toast } from "sonner";

interface CourseRevenue {
  title: string;
  enrolled: number;
  totalRevenue: number;
  collected: number;
  outstanding: number;
}

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCollected: 0,
    totalProjected: 0,
    outstanding: 0,
    collectionRate: 0,
    totalStudents: 0
  });
  const [courseSummaries, setCourseSummaries] = useState<CourseRevenue[]>([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getAllEnrollments();
      const list = Array.isArray(data) ? data : data.results || [];
      
      let collected = 0;
      let projected = 0;
      let outstanding = 0;
      const coursesMap: Record<string, { enrolled: number; total: number; paid: number }> = {};

      list.forEach((env: any) => {
        const fee = Number(env.fee_amount) || 0;
        const paid = Number(env.payment_paid) || 0;
        const balance = Number(env.remaining_balance) || 0;

        projected += fee;
        collected += paid;
        outstanding += balance;

        const courseName = env.course || "General Training";
        if (!coursesMap[courseName]) {
          coursesMap[courseName] = { enrolled: 0, total: 0, paid: 0 };
        }
        coursesMap[courseName].enrolled += 1;
        coursesMap[courseName].total += fee;
        coursesMap[courseName].paid += paid;
      });

      const summaries: CourseRevenue[] = Object.entries(coursesMap).map(([title, val]) => ({
        title,
        enrolled: val.enrolled,
        totalRevenue: val.total,
        collected: val.paid,
        outstanding: Math.max(0, val.total - val.paid),
      }));

      setStats({
        totalCollected: collected,
        totalProjected: projected,
        outstanding,
        collectionRate: projected > 0 ? Math.round((collected / projected) * 100) : 0,
        totalStudents: list.length
      });
      setCourseSummaries(summaries);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load financial reports.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin" sidebarItems={adminSidebarItems} title="NxGen Admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
            <p className="text-gray-500">Visual breakdown of Academy collections, receivables, and course revenues.</p>
          </div>
          <Button onClick={fetchReportData} variant="outline" size="sm" className="border-slate-200">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#000080]" />
          </div>
        ) : (
          <>
            {/* Metric widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Projected</span>
                    <div className="p-2 bg-blue-50 text-[#000080] rounded-lg">
                      <BarChart2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-slate-800">₹{stats.totalProjected.toLocaleString()}</h3>
                    <p className="text-xs text-gray-500 mt-1">Sum of all tuition fee policies</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Collected</span>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-green-600">₹{stats.totalCollected.toLocaleString()}</h3>
                    <p className="text-xs text-green-600 font-semibold mt-1">↑ Verified Bank Receipts</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Receivables</span>
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <Wallet className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-red-600">₹{stats.outstanding.toLocaleString()}</h3>
                    <p className="text-xs text-red-500 font-semibold mt-1">Pending student balances</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Collection Ratio</span>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Percent className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-purple-600">{stats.collectionRate}%</h3>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full rounded-full" 
                        style={{ width: `${stats.collectionRate}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course-wise summary list */}
            <Card className="shadow-lg border">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#000080]" /> Revenue Breakdown by Courses
                </CardTitle>
                <CardDescription>Performance tracking and outstanding collections per course training program.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {courseSummaries.map((course, idx) => {
                  const rate = course.totalRevenue > 0 ? Math.round((course.collected / course.totalRevenue) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-2 border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <h4 className="font-bold text-slate-800 text-base">{course.title}</h4>
                          <p className="text-xs text-gray-400">Total Enrolled: {course.enrolled} students</p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm font-semibold">
                          <div>
                            <span className="text-gray-400 text-xs block font-normal">Expected</span>
                            <span className="text-slate-800">₹{course.totalRevenue.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-green-500 text-xs block font-normal">Collected</span>
                            <span className="text-green-600">₹{course.collected.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-red-500 text-xs block font-normal">Outstanding</span>
                            <span className="text-red-600">₹{course.outstanding.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Premium progress bar */}
                      <div className="flex items-center gap-4 pt-1">
                        <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-green-500 h-full rounded-l-full" 
                            style={{ width: `${rate}%` }}
                            title={`Collected: ${rate}%`}
                          />
                          <div 
                            className="bg-red-400 h-full rounded-r-full" 
                            style={{ width: `${100 - rate}%` }}
                            title={`Outstanding: ${100 - rate}%`}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-10 shrink-0 text-right">{rate}%</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
