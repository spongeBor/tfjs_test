import Link from "next/link";

export default function ReBack() {
  return (
    <Link href={"/"}>
      <button className='btn btn-secondary'>回首页</button>
    </Link>
  );
}
