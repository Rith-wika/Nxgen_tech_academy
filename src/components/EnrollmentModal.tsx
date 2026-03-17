import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import EnrollmentForm from "./EnrollmentForm";

interface EnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle?: string;
    courseType?: "Training" | "Internship" | "Master Course";
}

export const EnrollmentModal = ({ isOpen, onClose, courseTitle, courseType }: EnrollmentModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-2xl [&>button]:text-white [&>button]:opacity-100 [&>button]:right-6 [&>button]:top-6 [&>button_svg]:h-6 [&>button_svg]:w-6">
                <div className="bg-[#000080] p-2 text-white">
                    <DialogHeader className="text-center flex flex-col items-center">
                        <DialogTitle className="text-2xl font-bold text-white">Enroll Now</DialogTitle>
                        <DialogDescription className="text-blue-100">
                            Fill in your details to begin your professional journey with NxGen Tech Academy.
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <div className="">
                    <EnrollmentForm
                        defaultCourse={courseTitle}
                        defaultCourseType={courseType}
                        onSuccess={onClose}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
