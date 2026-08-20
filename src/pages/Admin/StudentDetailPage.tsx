import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { adminSidebarItems } from "./adminSidebarItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Loader2, User, BookOpen, Clock, Award, Phone, Mail } from "lucide-react";
import { enrollmentService, EnrollmentData, PaymentDetails } from "@/services/enrollmentService";
import { toast } from "sonner";
import PaymentDialog from "@/components/PaymentDialog";

const StudentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<EnrollmentData | null>(null);
  const [allEnrollments, setAllEnrollments] = useState<EnrollmentData[]>([]);
  const [payments, setPayments] = useState<Record<string | number, PaymentDetails>>({});
  const [selectedPaymentEnrollment, setSelectedPaymentEnrollment] = useState<EnrollmentData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const studentData = await enrollmentService.getEnrollmentById(id);
      setStudent(studentData);
      
      let enrollmentsList: EnrollmentData[] = [studentData];
      try {
        const rawAll = await enrollmentService.getAllEnrollments();
        const allList = Array.isArray(rawAll) ? rawAll : rawAll.results || [];
        const matching = allList.filter((e: any) => 
          (e.email && studentData.email && e.email.toLowerCase().trim() === studentData.email.toLowerCase().trim()) ||
          (e.phone && studentData.phone && e.phone.trim() === studentData.phone.trim())
        );
        if (matching.length > 0) {
          enrollmentsList = matching;
        }
      } catch (err) {
        console.error("Failed to load all enrollments, fallback to single:", err);
      }
      setAllEnrollments(enrollmentsList);

      const paymentMap: Record<string | number, PaymentDetails> = {};
      for (const env of enrollmentsList) {
        if (!env.id) continue;
        try {
          const paymentData = await enrollmentService.getPaymentDetails(env.id);
          paymentMap[env.id] = paymentData;
        } catch (payError: any) {
          if (payError.response?.status === 404) {
            paymentMap[env.id] = {
              course_name: String(env.course),
              fee_amount: env.fee_amount || 0,
              payment_paid: 0,
              remaining_balance: env.fee_amount || 0,
            };
          } else {
            console.error(payError);
          }
        }
      }
      setPayments(paymentMap);
    } catch (error: any) {
      toast.error("Failed to fetch student details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout role="admin" sidebarItems={adminSidebarItems} title="Student Details">
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout role="admin" sidebarItems={adminSidebarItems} title="Student Details">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Student not found.</p>
          <Button onClick={() => navigate("/admin/students")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Students
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" sidebarItems={adminSidebarItems} title={`Student: ${student.name}`}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/students")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-500 text-sm">Student Profile View</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-medium mb-1 flex items-center gap-1"><Mail className="w-3 h-3"/> Email</p>
                <p className="font-semibold text-slate-800 break-all">{student.email}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone</p>
                <p className="font-semibold text-slate-800">{student.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1">Qualification</p>
                <p className="font-semibold text-slate-800">{student.qualification || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1">Current Status</p>
                <p className="font-semibold text-slate-800">{student.current_status || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Course list rendering */}
        <div className="space-y-6">
          {allEnrollments.map((env, index) => {
            const pmInfo = payments[env.id!] || {
              course_name: String(env.course),
              fee_amount: env.fee_amount || 0,
              payment_paid: 0,
              remaining_balance: env.fee_amount || 0,
            };
            return (
              <Card key={env.id} className="border-l-4 border-l-indigo-600">
                <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between py-3 border-b">
                  <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Course Details {index + 1}: <span className="text-[#000080]">{env.course}</span>
                  </CardTitle>
                  <Button 
                    size="sm"
                    onClick={() => setSelectedPaymentEnrollment(env)} 
                    className="bg-indigo-600 hover:bg-indigo-700 h-8"
                  >
                    <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                    Manage Payment
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Course info */}
                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Course Type</p>
                        <p className="font-semibold text-slate-800">{env.course_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Mode</p>
                        <p className="font-semibold text-slate-800">{env.preferred_mode}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400"/> Timing</p>
                        <p className="font-semibold text-slate-800">{env.preferred_timing || "—"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1 flex items-center gap-1"><Award className="w-3.5 h-3.5 text-slate-400"/> Experience</p>
                        <p className="font-semibold text-slate-800">{env.experience_level || "—"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Status</p>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          env.status === "approved" ? "bg-green-100 text-green-800" :
                          env.status === "rejected" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {env.status || "pending"}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Fee Status</p>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          String(env.fee_status || "").toLowerCase() === "paid" ? "bg-green-100 text-green-800" :
                          String(env.fee_status || "").toLowerCase() === "partial" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {env.fee_status || "Pending"}
                        </span>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6 space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Summary</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-slate-50 rounded border text-center">
                          <p className="text-[10px] text-gray-500 font-medium">Total Fee</p>
                          <p className="font-bold text-xs text-gray-800 mt-0.5">₹{pmInfo.fee_amount ?? 0}</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded border border-green-100 text-center">
                          <p className="text-[10px] text-green-600 font-medium">Paid</p>
                          <p className="font-bold text-xs text-green-700 mt-0.5">₹{pmInfo.payment_paid ?? 0}</p>
                        </div>
                        <div className="p-2 bg-orange-50 rounded border border-orange-100 text-center">
                          <p className="text-[10px] text-orange-600 font-medium">Due</p>
                          <p className="font-bold text-xs text-orange-700 mt-0.5">₹{pmInfo.remaining_balance ?? 0}</p>
                        </div>
                      </div>

                      {pmInfo.transactions && pmInfo.transactions.length > 0 && (
                        <div className="pt-2 border-t space-y-1.5">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment History</p>
                          <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                            {pmInfo.transactions.map((t) => (
                              <div key={t.id} className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">
                                  {new Date(t.paid_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                </span>
                                <span className="font-semibold text-green-700">₹{Number(t.amount).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {selectedPaymentEnrollment && (
        <PaymentDialog
          isOpen={!!selectedPaymentEnrollment}
          onClose={() => setSelectedPaymentEnrollment(null)}
          student={selectedPaymentEnrollment}
          onSuccess={fetchStudent}
        />
      )}
    </DashboardLayout>
  );
};

export default StudentDetailPage;
