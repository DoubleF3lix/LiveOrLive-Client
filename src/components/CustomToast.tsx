import { X } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

interface ToastProps {
    id: string | number;
    type: "achievement" | "normal";
    title: string;
    description: string;
    button: {
        label: string;
        onClick: () => void;
    };
}


// eslint-disable-next-line react-refresh/only-export-components
export default function toast(toast: Omit<ToastProps, "id">) {
    if (toast.type === "achievement") {
        return sonnerToast.custom((id) => (
            <Toast
                id={id}
                title={toast.title}
                description={toast.description}
                button={{
                    label: toast.button.label,
                    onClick: () => null
                }}
            />
        ));
    } else if (toast.type === "normal") {
        return sonnerToast(toast.title, { description: toast.description, action: { label: toast.button.label, onClick: toast.button.onClick } });
    }

}


export function Toast(props: Omit<ToastProps, "type">) {
    const { title, description, button, id } = props;

    return (
        <div className="flex flex-col rounded-lg bg-foreground w-full md:max-w-[364px] p-4">
            <div className="flex flex-row items-center justify-between">
                <p className="text-sm font-semibold text-background">Achievement Unlocked - {title}</p>
                <X
                    size={20} className="rounded-full p-0.5 text-secondary hover:bg-muted-foreground-hover"
                    onClick={() => {
                        button.onClick();
                        sonnerToast.dismiss(id);
                    }}
                />
            </div>
            <p className="text-sm text-ring flex-1 italic">{description}</p>
        </div>
    );
}
