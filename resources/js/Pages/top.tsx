import AppLayout from "@/Layouts/AppLayout";
import { LearningGrid } from "@/Components/LearningGrid";

export default function Top() {
    return (
        <AppLayout title="Top" activeThreadId={2}>
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white">
                英会話学習記録
            </h2>
            <div className="overflow-x-auto">
                <LearningGrid />
            </div>
        </AppLayout>
    );
}
