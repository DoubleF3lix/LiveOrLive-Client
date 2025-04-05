import { X } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { Toast } from '~/types/Toast';


// TODO make type for non gilded achievement (use white from commit history) 
// and plain black announcement achievement (basically inverted white, probably try normal though cause I forgot what that looked like)
export function GildedAchievementToast(props: Omit<Toast, "type">) {
    const { title, description, button, id } = props;

    return (
        <div className="flex flex-col rounded-sm border-t-4 border-l-4 border-t-achievement-toast-light border-l-achievement-toast-light border-r-4 border-b-4 border-r-achievement-toast-shadow border-b-achievement-toast-shadow bg-achievement-toast-primary w-full md:max-w-[364px] p-4"> 
            <div className="flex flex-row items-center justify-between">
                <p className="text-sm font-semibold text-black">Achievement Unlocked - {title}</p>
                <X
                    size={20} className="rounded-full p-0.5 text-secondary hover:bg-achievement-toast-shadow"
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

export function NormalAchievementToast(props: Omit<Toast, "type">) {
    const { title, description, button, id } = props;

    return (
        <div className="flex flex-col rounded-lg bg-foreground w-full md:max-w-[364px] p-4">
            <div className="flex flex-row items-center justify-between">
                <p className="text-sm font-semibold text-background">{title}</p>
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
