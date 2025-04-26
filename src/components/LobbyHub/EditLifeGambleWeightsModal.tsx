import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/dialog";
import { Button } from "@/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/table";


type EditLifeGambleWeightsModalArgs = {
    setOpen: (open: boolean) => void;
    lifeGambleWeights: Partial<Record<number, number>>;
    setLifeGambleWeights: (lifeGambleWeights: Partial<Record<number, number>>) => void;
};

export default function EditLifeGambleWeightsModal({ setOpen, lifeGambleWeights, setLifeGambleWeights }: EditLifeGambleWeightsModalArgs) {
    const closeModal = () => setOpen(false);

    return <Dialog open>
        <DialogContent onInteractOutside={closeModal} onCloseButtonClick={closeModal}> 
            <DialogHeader>
                <DialogTitle>Edit Life Gamble Weights</DialogTitle>
                <DialogDescription>The weight is the probability of getting that reward divided by the sum of the weights. Two 1 weights are 50% odds for both.</DialogDescription>
            </DialogHeader>
            <Table>
                <TableHeader>
                    <TableRow className="bg-background hover:bg-background">
                        <TableHead className="pl-4 sm:pl-6 text-center">Reward</TableHead>
                        <TableHead className="pr-4 sm:pr-6 text-center">Weight</TableHead>
                        <TableHead className="text-center"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(lifeGambleWeights).map(([value, weight]) => (
                        <TableRow key={value}>
                            <TableCell className="pl-4 sm:pl-6 mx-auto text-center">{value}</TableCell>
                            <TableCell className="pr-4 sm:pr-6 mx-auto text-center">{weight}</TableCell>
                            <TableCell className="mx-auto text-center w-16">
                                <Button variant="destructive" className="w-16">Remove</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button variant="secondary">Add</Button>
            <DialogFooter>
                <Button onClick={() => {
                    setLifeGambleWeights(lifeGambleWeights);
                    closeModal();
                }}>Save</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>;
}