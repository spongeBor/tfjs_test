function Result({
  prediction,
  probability,
}: {
  prediction: string;
  probability: number;
}) {
  return (
    <div className='h-48 w-64 rounded-lg border-2 border-primary p-4'>
      <div>prediction: {prediction}</div>
      <div>probability: {probability}</div>
    </div>
  );
}

export default Result;
