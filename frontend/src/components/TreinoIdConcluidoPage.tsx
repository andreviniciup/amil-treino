import TreinoIdConcluido from '../imports/TreinoIdConcluido';

interface TreinoIdConcluidoPageProps {
  onComplete: () => void;
}

export function TreinoIdConcluidoPage({ onComplete }: TreinoIdConcluidoPageProps) {
  return (
    <div onClick={onComplete}>
      <TreinoIdConcluido />
    </div>
  );
}
