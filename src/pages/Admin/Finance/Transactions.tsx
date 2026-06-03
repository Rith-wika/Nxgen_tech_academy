import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { adminSidebarItems } from "@/pages/Admin/adminSidebarItems";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, ArrowUpRight, IndianRupee, Filter, RefreshCw } from "lucide-react";
import { enrollmentService, EnrollmentData } from "@/services/enrollmentService";
import { toast } from "sonner";

const Transactions = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await enrollmentService.getAllEnrollments();
      // Filter out rejected or pending enrollments if we only want active ones,
      // but showing all lets the admin see everything. Let's filter to approved/active students.
      const list = Array.isArray(data) ? data : data.results || [];
      setEnrollments(list);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch transaction data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = enrollments.filter((tx) => {
    const matchesSearch =
      tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(tx.course || "").toLowerCase().includes(searchTerm.toLowerCase());

    const fee_status = tx.fee_status || "Pending";
    const matchesFilter =
      statusFilter === "all" ||
      fee_status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status?: string) => {
    const st = status || "Pending";
    if (st.toLowerCase().includes("paid") && !st.toLowerCase().includes("partial")) {
      return <Badge className="bg-green-100 text-green-800 border-none font-bold">Fully Paid</Badge>;
    }
    if (st.toLowerCase().includes("partial")) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-none font-bold">Partially Paid</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 border-none font-bold">Unpaid</Badge>;
  };

  return (
    <DashboardLayout role="admin" sidebarItems={adminSidebarItems} title="NxGen Admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Transactions Ledger</h1>
            <p className="text-gray-500">Track all tuition payments and course fee statuses across all student enrollments.</p>
          </div>
          <Button onClick={fetchTransactions} variant="outline" size="sm" className="border-slate-200">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {/* Analytics Header Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md border-l-4 border-l-green-500">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Received</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  ₹{enrollments.reduce((acc, curr) => acc + (curr.payment_paid || 0), 0).toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <IndianRupee className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-l-4 border-l-red-500">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Outstanding Dues</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">
                  ₹{enrollments.reduce((acc, curr) => acc + (curr.remaining_balance || 0), 0).toLocaleString()}
                </h3>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-md border-l-4 border-l-[#000080]">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Active Ledgers</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{enrollments.length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#000080]">
                <Filter className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by student name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto shrink-0">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              className={statusFilter === "all" ? "bg-[#000080] hover:bg-blue-800 text-white" : "border-gray-200"}
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "paid" ? "default" : "outline"}
              className={statusFilter === "paid" ? "bg-green-600 hover:bg-green-700 text-white" : "border-gray-200"}
              onClick={() => setStatusFilter("paid")}
            >
              Paid
            </Button>
            <Button
              variant={statusFilter === "partially paid" ? "default" : "outline"}
              className={statusFilter === "partially paid" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "border-gray-200"}
              onClick={() => setStatusFilter("partially paid")}
            >
              Partial
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#000080]" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Transactions Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </Card>
        ) : (
          <Card className="shadow-lg border">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg text-slate-800">Transactions Records</CardTitle>
              <CardDescription>Click details or search parameters above to narrow down results.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Course</th>
                      <th className="px-6 py-4">Total Tuition</th>
                      <th className="px-6 py-4">Amount Paid</th>
                      <th className="px-6 py-4">Outstanding Due</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{tx.name}</div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">{tx.email}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {tx.course}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          ₹{(tx.fee_amount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-semibold text-green-600">
                          ₹{(tx.payment_paid || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 font-bold text-red-600">
                          ₹{(tx.remaining_balance || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(tx.fee_status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
