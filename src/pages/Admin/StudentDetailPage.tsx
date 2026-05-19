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
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const fetchStudent = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const studentData = await enrollmentService.getEnrollmentById(id);
      setStudent(studentData);
      
      try {
        const paymentData = await enrollmentService.getPaymentDetails(id);
        setPayment(paymentData);
      } catch (payError: any) {
        if (payError.response?.status === 404) {
          setPayment({
            course_name: String(studentData.course),
            fee_amount: studentData.fee_amount || 0,
            payment_paid: 0,
            remaining_balance: studentData.fee_amount || 0,
          });
        } else {
          console.error(payError);
        }
      }
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
            <p className="text-gray-500 text-sm">Enrollment ID: #{student.id}</p>
          </div>
        </div>
        <Button onClick={() => setIsPaymentOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <CreditCard className="w-4 h-4 mr-2" />
          Manage Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-medium mb-1 flex items-center gap-1"><Mail className="w-3 h-3"/> Email</p>
                <p className="font-semibold">{student.email}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Phone</p>
                <p className="font-semibold">{student.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1">Qualification</p>
                <p className="font-semibold">{student.qualification || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1">Current Status</p>
                <p className="font-semibold">{student.current_status || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-medium mb-1">Course</p>
                <p className="font-semibold">{student.course}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1">Course Type</p>
                <p className="font-semibold">{student.course_type}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1">Mode</p>
                <p className="font-semibold">{student.preferred_mode}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Timing</p>
                <p className="font-semibold">{student.preferred_timing || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1 flex items-center gap-1"><Award className="w-3 h-3"/> Experience</p>
                <p className="font-semibold">{student.experience_level || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium mb-1">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${
                  student.status === "approved" ? "bg-green-100 text-green-800" :
                  student.status === "rejected" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {student.status || "pending"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left text-sm">
              <div className="p-4 bg-slate-50 rounded-lg border">
                <p className="text-gray-500 font-medium mb-1">Course Name</p>
                <p className="font-semibold text-lg">{payment?.course_name || student.course}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border">
                <p className="text-gray-500 font-medium mb-1">Total Fee Amount</p>
                <p className="font-bold text-lg text-gray-800">₹{payment?.fee_amount ?? 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-green-600 font-medium mb-1">Amount Paid</p>
                <p className="font-bold text-lg text-green-700">₹{payment?.payment_paid ?? 0}</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-orange-600 font-medium mb-1">Remaining Balance</p>
                <p className="font-bold text-lg text-orange-700">₹{payment?.remaining_balance ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PaymentDialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        student={student}
        onSuccess={fetchStudent}
      />
    </DashboardLayout>
  );
};

export default StudentDetailPage;
