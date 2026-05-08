import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Participant {
    id: number;
    name?: string;
    fullname?: string;
    attended: boolean;
    rescheduled?: boolean;
}

interface Demo {
    id: number;
    campaign: string;
    instructor: string;
    date: string;
    time: string;
    status: string;
    link: string;
    participants: Participant[];
}

interface DemoDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    demo: Demo | null;
    onSaveAttendance: (demoId: number, participants: Participant[]) => void;
    onReschedule: (demoId: number, participants: Participant[]) => void;
}

const DemoDetailsDialog: React.FC<DemoDetailsDialogProps> = ({
    open,
    onOpenChange,
    demo,
    onSaveAttendance,
    onReschedule
}) => {
    const [participants, setParticipants] = useState<Participant[]>(demo?.participants || []);
    const [showRescheduleConfirm, setShowRescheduleConfirm] = useState(false);

    React.useEffect(() => {
        if (demo) {
            setParticipants(Array.isArray(demo.participants) ? demo.participants : []);
        }
    }, [demo]);

    if (!demo) return null;

    const isAfterDemoTime = () => {
        if (!demo || !demo.date || !demo.time) return false;

        try {
            const now = new Date();
            const demoDate = new Date(demo.date);

            let hours = 0;
            let minutes = 0;

            if (typeof demo.time === 'string' && (demo.time.includes('AM') || demo.time.includes('PM'))) {
                const [time, modifier] = demo.time.split(' ');
                if (time) {
                    let [h, m] = time.split(':').map(Number);
                    if (modifier === 'PM' && h < 12) h += 12;
                    if (modifier === 'AM' && h === 12) h = 0;
                    hours = h || 0;
                    minutes = m || 0;
                }
            } else if (typeof demo.time === 'string' && demo.time.includes(':')) {
                const [h, m] = demo.time.split(':').map(Number);
                hours = h || 0;
                minutes = m || 0;
            }

            demoDate.setHours(hours, minutes, 0, 0);
            return now > demoDate;
        } catch (e) {
            console.error("Error parsing demo time:", e);
            return false;
        }
    };

    const attendanceEnabled = isAfterDemoTime();

    const handleAttendanceChange = (participantId: number, checked: boolean) => {
        setParticipants(prev =>
            prev.map(p => p.id === participantId ? { ...p, attended: checked } : p)
        );
    };

    const handleSave = () => {
        onSaveAttendance(demo.id, participants);
        toast.success("Attendance saved successfully!");
        onOpenChange(false);
    };

    const handleRescheduleNotAttended = () => {
        const notAttended = participants.filter(p => !p.attended);
        if (notAttended.length === 0) {
            toast.error("All participants attended.");
            return;
        }
        onReschedule(demo.id, notAttended);
        onOpenChange(false);
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'scheduled': return 'text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full';
            case 'attended': return 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full';
            case 'rescheduled': return 'text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full';
            case 'completed': return 'text-green-600 bg-green-50 px-2 py-0.5 rounded-full';
            default: return 'text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Demo Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500 font-medium">Campaign</p>
                            <p className="font-semibold">{demo.campaign}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium">Instructor</p>
                            <p className="font-semibold">{demo.instructor}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium">Date & Time</p>
                            <p className="font-semibold">{demo.date} at {demo.time}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium">Status</p>
                            <p className={`font-semibold text-xs inline-block ${getStatusColor(demo.status)}`}>{demo.status}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500 font-medium mb-1">Meeting Link</p>
                        <p className="text-sm font-medium text-blue-600 break-all">
                            <a href={demo.link} target="_blank" rel="noopener noreferrer">{demo.link}</a>
                        </p>
                    </div>

                    <div className="border-t pt-4">
                        <p className="font-bold text-slate-800 mb-4">Attendance Section</p>
                        {!attendanceEnabled && (
                            <div className="bg-amber-50 text-amber-700 p-3 rounded-lg text-xs mb-4 font-medium">
                                Attendance can be marked after the scheduled demo time.
                            </div>
                        )}
                        <div className="space-y-3">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Lead Name</th>
                                        <th className="px-4 py-2 text-center font-medium">Attended</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {participants.map(p => (
                                        <tr key={p.id}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-slate-700">{p.fullname || p.name}</span>
                                                    {p.rescheduled && (
                                                        <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                                            Rescheduled
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Checkbox
                                                    checked={p.attended}
                                                    onCheckedChange={(checked) => handleAttendanceChange(p.id, checked === true)}
                                                    disabled={
                                                        !attendanceEnabled ||
                                                        p.rescheduled ||
                                                        (demo.status?.toLowerCase() === 'rescheduled' && p.attended) ||
                                                        (demo.status?.toLowerCase() === 'completed')
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        <Button
                            className="w-full bg-[#000080]"
                            onClick={handleSave}
                            disabled={!attendanceEnabled || demo.status?.toLowerCase() === 'completed'}
                        >
                            {demo.status?.toLowerCase() === 'completed' ? 'Attendance Finalized' : 'Save Attendance'}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
                            onClick={() => setShowRescheduleConfirm(true)}
                            disabled={!attendanceEnabled || demo.status?.toLowerCase() === 'rescheduled' || demo.status?.toLowerCase() === 'completed'}
                        >
                            {demo.status?.toLowerCase() === 'rescheduled' ? 'Already Rescheduled' : 'Reschedule for Absent Participants'}
                        </Button>
                    </div>
                </div>

                {/* Reschedule Confirmation Dialog */}
                <Dialog open={showRescheduleConfirm} onOpenChange={setShowRescheduleConfirm}>
                    <DialogContent className="max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Reschedule</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-sm text-slate-600">
                                This will start the rescheduling process for all participants who did not attend this demo. Are you sure you want to proceed?
                            </p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowRescheduleConfirm(false)}>Cancel</Button>
                            <Button className="bg-[#000080]" onClick={() => {
                                setShowRescheduleConfirm(false);
                                handleRescheduleNotAttended();
                            }}>Proceed</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </DialogContent>
        </Dialog>
    );
};

export default DemoDetailsDialog;
