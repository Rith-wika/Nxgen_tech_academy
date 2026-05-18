import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CampaignDialogsProps {
    campaignOpen: boolean;
    setCampaignOpen: (open: boolean) => void;
    editCampaignOpen: boolean;
    setEditCampaignOpen: (open: boolean) => void;
    deleteCampaignOpen: boolean;
    setDeleteCampaignOpen: (open: boolean) => void;
    newCampaign: any;
    setNewCampaign: (campaign: any) => void;
    editingCampaign: any;
    setEditingCampaign: (campaign: any) => void;
    campaignStatuses: any[];
    courses: any[];
    handleAddCampaign: (e: React.FormEvent) => void;
    handleEditCampaignSubmit: (e: React.FormEvent) => void;
    handleDeleteCampaign: () => void;
}

export const AddCampaignDialog: React.FC<CampaignDialogsProps> = ({
    campaignOpen,
    setCampaignOpen,
    newCampaign,
    setNewCampaign,
    courses,
    handleAddCampaign
}) => (
    <Dialog open={campaignOpen} onOpenChange={setCampaignOpen}>
        <DialogContent className="max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCampaign} className="space-y-4 pt-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Name</label>
                    <Input required placeholder="Summer 2026 Batch" value={newCampaign.name} onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <Input required type="date" value={newCampaign.startDate} onChange={e => setNewCampaign({ ...newCampaign, startDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Input required type="date" value={newCampaign.endDate} onChange={e => setNewCampaign({ ...newCampaign, endDate: e.target.value })} />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input placeholder="Brief overview of the campaign" value={newCampaign.desc} onChange={e => setNewCampaign({ ...newCampaign, desc: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Link to Course</label>
                    <select
                        required
                        className="w-full border rounded-md p-2 text-sm bg-white"
                        value={newCampaign.course}
                        onChange={e => setNewCampaign({ ...newCampaign, course: e.target.value })}
                    >
                        <option value="">Select a Course</option>
                        {(courses || []).map((course: any) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" className="w-full bg-[#000080]">Create Campaign</Button>
            </form>
        </DialogContent>
    </Dialog>
);

export const EditCampaignDialog: React.FC<CampaignDialogsProps> = ({
    editCampaignOpen,
    setEditCampaignOpen,
    editingCampaign,
    setEditingCampaign,
    campaignStatuses,
    courses,
    handleEditCampaignSubmit
}) => (
    <Dialog open={editCampaignOpen} onOpenChange={setEditCampaignOpen}>
        <DialogContent className="max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit Campaign</DialogTitle>
            </DialogHeader>
            {editingCampaign && (
                <form onSubmit={handleEditCampaignSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Campaign Name</label>
                        <Input required value={editingCampaign.name} onChange={e => setEditingCampaign({ ...editingCampaign, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Date</label>
                            <Input required type="date" value={editingCampaign.startDate} onChange={e => setEditingCampaign({ ...editingCampaign, startDate: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">End Date</label>
                            <Input required type="date" value={editingCampaign.endDate} onChange={e => setEditingCampaign({ ...editingCampaign, endDate: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select className="w-full border rounded-md p-2 text-sm bg-white" value={editingCampaign.status} onChange={e => setEditingCampaign({ ...editingCampaign, status: e.target.value })}>
                            {campaignStatuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Linked Course</label>
                        <select
                            required
                            className="w-full border rounded-md p-2 text-sm bg-white"
                            value={editingCampaign.course}
                            onChange={e => setEditingCampaign({ ...editingCampaign, course: e.target.value })}
                        >
                            <option value="">Select a Course</option>
                            {(courses || []).map((course: any) => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit" className="w-full bg-[#000080]">Save Changes</Button>
                </form>
            )}
        </DialogContent>
    </Dialog>
);

export const DeleteCampaignDialog: React.FC<CampaignDialogsProps> = ({
    deleteCampaignOpen,
    setDeleteCampaignOpen,
    handleDeleteCampaign
}) => (
    <Dialog open={deleteCampaignOpen} onOpenChange={setDeleteCampaignOpen}>
        <DialogContent className="max-w-[400px]">
            <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <p className="text-sm text-slate-600">
                    Are you sure you want to delete this campaign? This action cannot be undone.
                </p>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteCampaignOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteCampaign} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
            </div>
        </DialogContent>
    </Dialog>
);
