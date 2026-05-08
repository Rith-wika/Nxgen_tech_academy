import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Instructor {
    id: number | string;
    name: string;
    full_name?: string;
}

interface ScheduleDemoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCampaignName: string;
    instructors: Instructor[];
    newDemo: { instructor: string; date: string; time: string; link: string };
    setNewDemo: React.Dispatch<React.SetStateAction<{ instructor: string; date: string; time: string; link: string }>>;
    onSubmit: (e: React.FormEvent) => void;
}

const ScheduleDemoDialog: React.FC<ScheduleDemoDialogProps> = ({
    open,
    onOpenChange,
    selectedCampaignName,
    instructors,
    newDemo,
    setNewDemo,
    onSubmit
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Schedule a Demo</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Campaign Name</label>
                        <Input disabled value={selectedCampaignName || ""} className="bg-slate-100" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Instructor</label>
                        <select 
                            required 
                            className="w-full border rounded-md p-2 text-sm bg-white" 
                            value={newDemo.instructor} 
                            onChange={e => setNewDemo({ ...newDemo, instructor: e.target.value })}
                        >
                            <option value="">Choose an instructor...</option>
                            {instructors.map(inst => (
                                <option key={inst.id} value={inst.full_name || inst.name}>
                                    {inst.full_name || inst.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Input 
                                required 
                                type="date" 
                                value={newDemo.date} 
                                onChange={e => setNewDemo({ ...newDemo, date: e.target.value })} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Time Slot</label>
                            <Input 
                                required 
                                type="time" 
                                value={newDemo.time} 
                                onChange={e => setNewDemo({ ...newDemo, time: e.target.value })} 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Meeting Link / Location</label>
                        <Input 
                            required 
                            placeholder="e.g. Zoom link or Office address" 
                            value={newDemo.link} 
                            onChange={e => setNewDemo({ ...newDemo, link: e.target.value })} 
                        />
                    </div>
                    <Button type="submit" className="w-full bg-[#000080]">Confirm Schedule</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleDemoDialog;
