import Link from "next/link";
export default function Home() {
  const routersMap = [
    ["training/curve", "曲线拟合训练"],
    ["transfer", "迁移学习"],
  ];
  return (
    <main className='relative flex h-screen w-screen items-center justify-center'>
      <div className='flex size-1/2 flex-col items-center justify-around'>
        {routersMap.map((router, key) => {
          return (
            <Link href={`/${router[0]}`} key={key}>
              <button className='btn btn-primary'>{router[1]}</button>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
