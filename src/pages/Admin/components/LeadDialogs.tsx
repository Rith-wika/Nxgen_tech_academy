import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LeadDialogsProps {
    leadOpen: boolean;
    setLeadOpen: (open: boolean) => void;
    editLeadOpen: boolean;
    setEditLeadOpen: (open: boolean) => void;
    deleteLeadOpen: boolean;
    setDeleteLeadOpen: (open: boolean) => void;
    newLead: any;
    setNewLead: (lead: any) => void;
    editingLead: any;
    setEditingLead: (lead: any) => void;
    campaigns: any[];
    leadStatuses: any[];
    handleAddLead: (e: React.FormEvent) => void;
    handleEditLead: (e: React.FormEvent) => void;
    handleDeleteLead: () => void;
}

export const AddLeadDialog: React.FC<LeadDialogsProps> = ({
    leadOpen,
    setLeadOpen,
    newLead,
    setNewLead,
    campaigns,
    handleAddLead
}) => (
    <Dialog open={leadOpen} onOpenChange={setLeadOpen}>
        <DialogContent className="max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddLead} className="space-y-4 pt-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input required placeholder="John Doe" value={newLead.fullname} onChange={e => setNewLead({ ...newLead, fullname: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input required type="email" placeholder="john@example.com" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input required placeholder="+91 98765 43210" value={newLead.phone_number} onChange={e => setNewLead({ ...newLead, phone_number: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign</label>
                    <select required className="w-full border rounded-md p-2 text-sm bg-white" value={newLead.campaign} onChange={e => setNewLead({ ...newLead, campaign: e.target.value })}>
                        <option value="">Select Campaign</option>
                        {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <Button type="submit" className="w-full bg-[#000080]">Create Lead</Button>
            </form>
        </DialogContent>
    </Dialog>
);

export const EditLeadDialog: React.FC<LeadDialogsProps> = ({
    editLeadOpen,
    setEditLeadOpen,
    editingLead,
    setEditingLead,
    campaigns,
    leadStatuses,
    handleEditLead
}) => (
    <Dialog open={editLeadOpen} onOpenChange={setEditLeadOpen}>
        <DialogContent className="max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit Lead</DialogTitle>
            </DialogHeader>
            {editingLead && (
                <form onSubmit={handleEditLead} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input required value={editingLead.fullname} onChange={e => setEditingLead({ ...editingLead, fullname: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input required type="email" value={editingLead.email} onChange={e => setEditingLead({ ...editingLead, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input required value={editingLead.phone_number} onChange={e => setEditingLead({ ...editingLead, phone_number: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select className="w-full border rounded-md p-2 text-sm bg-white" value={editingLead.status} onChange={e => setEditingLead({ ...editingLead, status: e.target.value })}>
                            {leadStatuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <Button type="submit" className="w-full bg-[#000080]">Save Changes</Button>
                </form>
            )}
        </DialogContent>
    </Dialog>
);

export const DeleteLeadDialog: React.FC<LeadDialogsProps> = ({
    deleteLeadOpen,
    setDeleteLeadOpen,
    handleDeleteLead
}) => (
    <Dialog open={deleteLeadOpen} onOpenChange={setDeleteLeadOpen}>
        <DialogContent className="max-w-[400px]">
            <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <p className="text-sm text-slate-600">
                    Are you sure you want to delete this lead? This action cannot be undone.
                </p>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteLeadOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteLead} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
            </div>
        </DialogContent>
    </Dialog>
);
